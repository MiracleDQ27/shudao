#!/usr/bin/env node

/**
 * settle.js — 书道结算计算引擎 v1
 *
 * 职责：纯计算引擎，不做任何 API 调用。
 * 从 stdin 接收 JSON 格式 session data，计算后输出新 data.json + 结算报告。
 *
 * 用法：
 *   node scripts/settle.js < session_data.json          # 正常模式
 *   node scripts/settle.js --dry-run < session_data.json # 预览（不写入）
 *
 * 幂等设计：
 *   - processedNoteIds 记录已处理的 IMA noteId，跳过重复
 *   - 每本书的 lastKnownProgress / lastKnownChapterUid 做增量 Boss 检测
 *   - 多次运行安全，不会重复计分
 */

// ===================================================================
//  常量
// ===================================================================

const DIFFICULTY = { 1: 0.7, 2: 1.0, 3: 1.3, 4: 1.6, 5: 2.0 };

const STREAK_TIERS = [
  { min: 1, max: 2, mult: 1.0 },
  { min: 3, max: 6, mult: 1.2 },
  { min: 7, max: 13, mult: 1.5 },
  { min: 14, max: 29, mult: 2.0 },
  { min: 30, max: 59, mult: 2.5 },
  { min: 60, max: 99, mult: 3.0 },
  { min: 100, max: Infinity, mult: 4.0 },
];

const BOSS_BASE_XP = { minion: 20, chapter: 30, book: 50 };
const DIM_RATING_MULT = 3;       // 理解评分 × 3
const SUB_DIM_RATIO = 0.3;       // 副维获得 30%
const BOOK_COMPLETE_BONUS = 30;  // 读完 +30 主维
const REVIEW_XP = 10;            // 复习答对 +10
const VALID_DOMAINS = ['文道', '史道', '哲道', '政道', '世道', '心道', '器道'];

// ===================================================================
//  工具函数
// ===================================================================

/** 连击加成倍率 */
function getStreakMult(days) {
  for (const t of STREAK_TIERS) {
    if (days >= t.min && days <= t.max) return t.mult;
  }
  return 1.0;
}

/** 难度倍率 */
function getDiffMult(level) {
  return DIFFICULTY[level] ?? 1.0;
}

/** 评分系数：优秀 ×1.5 / 合格 ×1.0 / 以下 ×0 */
function getRatingCoeff(rating) {
  if (!rating || rating < 5) return 0;
  return rating >= 8 ? 1.5 : 1.0;
}

// ===================================================================
//  1. IMA 笔记解析
// ===================================================================

/**
 * 将 IMA 笔记原始文本解析为结构化数据。
 * 兼容带换行和不带换行的格式。
 * 容错：各字段独立解析，单字段失败不影响其他字段。
 */
function parseNote(raw) {
  const out = { raw };
  const warns = [];

  // 通用字段提取：匹配 "(·) FIELD：VALUE" 直到下一个 "· FIELD：" 或结尾
  // 兼容换行/不换行两种格式
  function fieldValue(prefix, next) {
    const nf = next.join('|');
    const pat = new RegExp(`(?:^|·)\\s*${prefix}：(.+?)(?=(?:·\\s*(?:${nf})：)|$)`, 's');
    const m = raw.match(pat);
    return m ? m[1].trim() : null;
  }

  // -- 阅读范围：提取书名和日期 --
  const rr = raw.match(/(?:^|·)\s*阅读范围：(.+?)(?=·\s*\d{4}-\d{2}-\d{2})/);
  if (rr) {
    const range = rr[1].trim();
    const matched = range.match(/《(.+?)》/);
    out.bookName = matched ? matched[1] : range.split(/的/)[0]?.trim() || range;
    out.rangeDetail = range;
  } else {
    warns.push('阅读范围_未解析');
  }
  const dateM = raw.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateM) out.date = dateM[1];

  // -- 所属书域 --
  const dm = fieldValue('所属书域', ['聊了什么', '理解评分', '复习触发', '评价']);
  if (dm) {
    const mainM = dm.match(/(.{1,3})[（(]主[）)]/);
    const subM = dm.match(/(.{1,3})[（(]副[）)]/);
    out.mainDim = mainM ? mainM[1] : dm.split(/[··]/).map(s => s.trim())[0] || null;
    out.subDim = subM ? subM[1].trim() : null;
    if (out.mainDim && !VALID_DOMAINS.includes(out.mainDim)) warns.push(`主域异常_${out.mainDim}`);
    if (out.subDim && !VALID_DOMAINS.includes(out.subDim)) warns.push(`副域异常_${out.subDim}`);
  } else {
    warns.push('所属书域_未解析');
  }

  // -- 聊了什么 --
  out.summary = fieldValue('聊了什么', ['理解评分', '所属书域', '复习触发', '评价', '阅读范围']) || '';

  // -- 理解评分 --
  const rm = raw.match(/(?:^|·)\s*理解评分：(\d+)/);
  if (rm) {
    out.rating = parseInt(rm[1], 10);
    if (out.rating < 1 || out.rating > 10) warns.push(`评分越界_${out.rating}`);
  } else {
    warns.push('理解评分_未解析');
  }

  // -- 复习触发 --
  const rv = fieldValue('复习触发', ['评价', '理解评分', '阅读范围', '所属书域', '聊了什么']);
  if (rv != null) {
    out.reviewTriggered = rv.startsWith('是');
    out.reviewDetail = out.reviewTriggered ? rv : null;
  }

  // -- 评价 --
  const ev = fieldValue('评价', []);
  if (ev) out.evaluation = ev;

  if (warns.length) out._warnings = warns;
  return out;
}

// ===================================================================
//  2. 连续阅读天数
// ===================================================================

/**
 * 从 dailyReadTimes（{ timestamp_sec: readSeconds }）计算连续天数。
 * 从昨天开始倒推（今天可能还没读）。
 */
function calcStreak(dailyReadTimes) {
  if (!dailyReadTimes || typeof dailyReadTimes !== 'object') return 0;
  const readDates = new Set();
  for (const [ts, secs] of Object.entries(dailyReadTimes)) {
    if (secs > 0) readDates.add(toDateStr(new Date(parseInt(ts, 10) * 1000)));
  }
  if (readDates.size === 0) return 0;

  const today = toDateStr(new Date());
  let streak = 0;
  const cursor = new Date();
  // 最多倒推 366 天
  for (let i = 0; i < 366; i++) {
    const ds = toDateStr(cursor);
    if (readDates.has(ds)) {
      streak++;
    } else if (i > 0) {
      break; // 中断
    }
    // i === 0: 今天没读不中断，继续查昨天
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ===================================================================
//  3. 书名模糊匹配
// ===================================================================

/** 模糊匹配笔记书名与微信读书书架 */
function matchBook(noteBookName, wereadBooks) {
  if (!noteBookName || !wereadBooks?.length) return null;

  // 精确
  for (const b of wereadBooks) {
    if (b.title === noteBookName) return b;
  }

  // 子串
  for (const b of wereadBooks) {
    if (b.title.includes(noteBookName) || noteBookName.includes(b.title)) return b;
  }

  // 归一化后子串
  const norm = s => s.replace(/[《》「」『』""''（）()\s,，。.]/g, '');
  const nn = norm(noteBookName);
  for (const b of wereadBooks) {
    const bn = norm(b.title);
    if (bn.includes(nn) || nn.includes(bn)) return b;
  }

  return null;
}

// ===================================================================
//  4. 段位查询
// ===================================================================

function getTierName(points, tiers) {
  let name = tiers[0]?.name || '未入门';
  for (const t of tiers) {
    if (points >= t.pointsRequired) name = t.name;
    else break;
  }
  return name;
}

// ===================================================================
//  5. 等级计算
// ===================================================================

/**
 * 根据累计 totalXp 查等级表，返回完整等级信息。
 */
function calcLevel(totalXp, table) {
  let cumulative = 0;
  let level = 1;
  let title = table[0]?.title || '识文童子';
  let realm = table[0]?.realm || '开蒙';

  for (const e of table) {
    if (totalXp < cumulative) break;
    level = e.level;
    title = e.title;
    realm = e.realm;
    cumulative += e.xpToNext;
  }

  // 当前等级门槛
  let prevCumulative = 0;
  for (const e of table) {
    if (e.level >= level) break;
    prevCumulative += e.xpToNext;
  }

  const xpInLevel = totalXp - prevCumulative;
  const next = table.find(e => e.level === level);
  return { level, title, realm, xpInLevel, xpNeeded: next?.xpToNext || 0 };
}

// ===================================================================
//  6. 核心结算逻辑
// ===================================================================

function runSettlement(session) {
  const { dataJson: current, weread, imaNotes } = session;
  const output = JSON.parse(JSON.stringify(current));

  const report = {
    notesProcessed: 0,
    notesSkipped: 0,
    totalXpGained: 0,
    xpBreakdown: [],
    dimensionDeltas: {},
    dimensionTierChanges: {},
    bossesKilled: { 小怪: 0, 章Boss: 0, 书Boss: 0 },
    levelUp: null,
    streakDays: 0,
    booksCompleted: [],
    warnings: [],
  };

  // ---- 初始化 ----
  if (!output.processedNoteIds) output.processedNoteIds = [];
  for (const b of output.bookShelf.reading) {
    if (b.lastKnownChapterUid == null) b.lastKnownChapterUid = 0;
    if (b.lastKnownProgress == null) b.lastKnownProgress = 0;
  }

  // ---- 连击 ----
  report.streakDays = calcStreak(weread?.annually?.dailyReadTimes);
  const streakMult = getStreakMult(report.streakDays);

  const wereadBooks = weread?.shelf?.books || [];
  const processedIds = new Set(output.processedNoteIds);
  const newNotes = imaNotes.filter(n => !processedIds.has(n.noteId));
  report.notesSkipped = imaNotes.length - newNotes.length;

  // 每本书本轮 Boss 触发状态（同一轮只触发一次）
  const bossAwarded = {}; // { bookId: { chapter: bool, book: bool } }

  // 维度累计增量
  const dimDeltas = {};

  // ---- 处理每条新笔记 ----
  for (const imaNote of newNotes) {
    report.notesProcessed++;
    const parsed = parseNote(imaNote.rawText);
    if (parsed._warnings?.length) {
      report.warnings.push(`笔记 ${imaNote.noteId}: ${parsed._warnings.join('; ')}`);
    }

    // 匹配书籍
    const wb = matchBook(parsed.bookName, wereadBooks);

    // 查找或创建书架记录
    let shelfEntry = null;
    if (wb) {
      shelfEntry = output.bookShelf.reading.find(b => b.bookId === wb.bookId);
      if (!shelfEntry) {
        shelfEntry = {
          bookId: wb.bookId,
          title: wb.title,
          author: wb.author || '',
          cover: wb.cover || '',
          mainDim: parsed.mainDim || null,
          subDim: parsed.subDim || null,
          difficulty: 2,  // 默认一般社科
          lastKnownChapterUid: 0,
          lastKnownProgress: 0,
        };
        output.bookShelf.reading.push(shelfEntry);
      }
      // 补维度
      if (!shelfEntry.mainDim && parsed.mainDim) shelfEntry.mainDim = parsed.mainDim;
      if (!shelfEntry.subDim && parsed.subDim) shelfEntry.subDim = parsed.subDim;
    }

    // ---- Boss 检测（本轮初次见到本书时才检测） ----
    let chapterBoss = false;
    let bookBoss = false;
    if (shelfEntry && wb) {
      const prog = weread?.bookProgress?.[wb.bookId];
      if (prog) {
        const state = bossAwarded[wb.bookId] || { chapter: false, book: false };

        if (!state.chapter && prog.chapterUid != null && shelfEntry.lastKnownChapterUid != null) {
          if (prog.chapterUid > shelfEntry.lastKnownChapterUid) {
            chapterBoss = true;
            state.chapter = true;
          }
        }

        if (!state.book && prog.progress != null) {
          if (shelfEntry.lastKnownProgress < 100 && prog.progress >= 100) {
            bookBoss = true;
            state.book = true;
          }
        }

        bossAwarded[wb.bookId] = state;
      }
    }

    // ---- XP 计算 ----
    const ratingCoeff = getRatingCoeff(parsed.rating);
    const diffMult = getDiffMult(shelfEntry?.difficulty || 2);
    let noteXpTotal = 0;
    const detail = {
      noteId: imaNote.noteId,
      bookName: parsed.bookName,
      rating: parsed.rating,
      bossXp: { 小怪: 0, 章Boss: 0, 书Boss: 0 },
      reviewXp: 0,
    };

    // 小怪（评分够才有）
    if (ratingCoeff > 0) {
      detail.bossXp.小怪 = Math.round(BOSS_BASE_XP.minion * diffMult * streakMult * ratingCoeff);
      noteXpTotal += detail.bossXp.小怪;
      report.bossesKilled.小怪++;
    }

    if (chapterBoss) {
      detail.bossXp.章Boss = Math.round(BOSS_BASE_XP.chapter * diffMult * streakMult);
      noteXpTotal += detail.bossXp.章Boss;
      report.bossesKilled.章Boss++;
    }

    if (bookBoss) {
      detail.bossXp.书Boss = Math.round(BOSS_BASE_XP.book * diffMult * streakMult);
      noteXpTotal += detail.bossXp.书Boss;
      report.bossesKilled.书Boss++;
    }

    // 复习
    if (parsed.reviewTriggered) {
      detail.reviewXp = REVIEW_XP;
      noteXpTotal += REVIEW_XP;
    }

    detail.totalXp = noteXpTotal;
    report.totalXpGained += noteXpTotal;
    report.xpBreakdown.push(detail);

    // ---- 维度计算 ----
    const mainDim = parsed.mainDim || shelfEntry?.mainDim;
    const subDim = parsed.subDim || shelfEntry?.subDim;
    const r = parsed.rating || 0;

    if (mainDim && VALID_DOMAINS.includes(mainDim)) {
      dimDeltas[mainDim] = (dimDeltas[mainDim] || 0) + Math.round(r * DIM_RATING_MULT);
    }
    if (subDim && VALID_DOMAINS.includes(subDim)) {
      dimDeltas[subDim] = (dimDeltas[subDim] || 0) + Math.round(r * DIM_RATING_MULT * SUB_DIM_RATIO);
    }

    // ---- 标记已处理 ----
    output.processedNoteIds.push(imaNote.noteId);
  }

  // ---- 移动读完的书籍 + 读完奖励 ----
  const stillReading = [];
  const completedIds = new Set(output.bookShelf.completed.map(b => b.bookId));
  for (const book of output.bookShelf.reading) {
    const prog = weread?.bookProgress?.[book.bookId];
    const isNowCompleted = prog && prog.progress != null && prog.progress >= 100;
    const wasCompleted = book.lastKnownProgress >= 100;

    if (isNowCompleted && !wasCompleted) {
      // 颁发读完维度奖励
      if (book.mainDim && VALID_DOMAINS.includes(book.mainDim)) {
        dimDeltas[book.mainDim] = (dimDeltas[book.mainDim] || 0) + BOOK_COMPLETE_BONUS;
      }
      report.booksCompleted.push(book.title || book.bookId);

      // 如果书 Boss 没在笔记循环中触发过（没有对应笔记），补发
      const bs = bossAwarded[book.bookId];
      if (!bs?.book) {
        const diffMult = getDiffMult(book.difficulty || 2);
        const bossXp = Math.round(BOSS_BASE_XP.book * diffMult * streakMult);
        report.totalXpGained += bossXp;
        report.bossesKilled.书Boss++;
        report.warnings.push(`${book.title}: 无笔记但检测到读完，补发书Boss XP ${bossXp}`);
      }

      // 移到 completed
      if (!completedIds.has(book.bookId)) {
        output.bookShelf.completed.push({ ...book });
      }
    } else {
      stillReading.push(book);
    }
  }
  output.bookShelf.reading = stillReading;

  // ---- 更新书籍进度 ----
  for (const book of output.bookShelf.reading) {
    const prog = weread?.bookProgress?.[book.bookId];
    if (prog) {
      if (prog.chapterUid != null) book.lastKnownChapterUid = prog.chapterUid;
      if (prog.progress != null) book.lastKnownProgress = prog.progress;
    }
  }

  // ---- 应用维度增量 ----
  for (const [dim, delta] of Object.entries(dimDeltas)) {
    if (!output.dimensions[dim]) continue;
    const oldPoints = output.dimensions[dim].points || 0;
    const oldTier = output.dimensions[dim].tier || '未入门';
    output.dimensions[dim].points = oldPoints + delta;
    output.dimensions[dim].tier = getTierName(output.dimensions[dim].points, output.rules.dimensionTiers);
    report.dimensionDeltas[dim] = delta;

    if (output.dimensions[dim].tier !== oldTier) {
      report.dimensionTierChanges[dim] = { from: oldTier, to: output.dimensions[dim].tier };
    }
  }

  // ---- 更新玩家等级 ----
  const oldLevel = output.player.level;
  const oldTotalXp = output.player.totalXp || 0;
  const newTotalXp = oldTotalXp + report.totalXpGained;

  const li = calcLevel(newTotalXp, output.rules.levelTable);
  output.player.level = li.level;
  output.player.title = li.title;
  output.player.realm = li.realm;
  output.player.xp = li.xpInLevel;
  output.player.totalXp = newTotalXp;

  if (li.level > oldLevel) {
    report.levelUp = { from: oldLevel, to: li.level, title: li.title };
  }

  // ---- 更新修习统计 ----
  output.stats.streakDays = report.streakDays;
  if (weread?.overall?.readDays && weread.overall.readDays > (output.stats.totalDays || 0)) {
    output.stats.totalDays = weread.overall.readDays;
  }
  if (weread?.overall?.totalReadTime) {
    output.stats.totalReadingMinutes = Math.round(weread.overall.totalReadTime / 60);
  }

  output.lastSync = new Date().toISOString();

  return { newDataJson: output, report };
}

// ===================================================================
//  主入口
// ===================================================================

function main() {
  const isDryRun = process.argv.includes('--dry-run');
  let input = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { input += chunk; });
  process.stdin.on('end', () => {
    try {
      const session = JSON.parse(input);
      if (!session.dataJson) throw new Error('缺少 dataJson');
      if (!session.imaNotes) throw new Error('缺少 imaNotes');
      if (!session.weread) throw new Error('缺少 weread');

      const result = runSettlement(session);

      if (isDryRun) {
        console.log(JSON.stringify({ dryRun: true, report: result.report }, null, 2));
      } else {
        console.log(JSON.stringify({ newDataJson: result.newDataJson, report: result.report }, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify({ error: err.message, stack: err.stack }));
      process.exit(1);
    }
  });

  process.stdin.on('error', err => {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  });
}

if (require.main === module) main();

module.exports = {
  parseNote, calcStreak, matchBook,
  getTierName, calcLevel,
  getStreakMult, getDiffMult, getRatingCoeff,
  runSettlement,
};
