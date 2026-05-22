# 书道结算操作手册

> 本文档定义"同步书道"命令的完整执行流程。结算管道打通"读 → 聊 → 结算 → 可视化"闭环。

## 架构概览

```
Claude（API 拉取 + 组装）→  settle.js（纯计算）→  data.json（数据源）
```

| 层 | 职责 | 技术 |
|----|------|------|
| 数据采集层（Claude） | 拉微信读书 API + IMA 笔记，组装 session_data.json | weread-skills + ima-skill |
| 计算引擎层 | 纯计算 XP/维度/Boss，不调 API | scripts/settle.js |
| 持久层 | 游戏数据唯一源 | data.json |

## 输入格式（session_data.json）

```json
{
  "dataJson": { /* 当前 data.json 全文 */ },
  "weread": {
    "overall": { "readDays": 5, "totalReadTime": 36000 },
    "annually": { "dailyReadTimes": { "1719129600": 3600 } },
    "shelf": {
      "books": [
        { "bookId": "wr001", "title": "书名", "author": "作者", "cover": "" }
      ]
    },
    "bookProgress": {
      "wr001": { "progress": 45, "chapterUid": 12 }
    }
  },
  "imaNotes": [
    {
      "noteId": "xxx",
      "modifyTime": 1747785600000,
      "rawText": "· 阅读范围：..."
    }
  ]
}
```

字段说明：

| 字段 | 来源 | 说明 |
|------|------|------|
| `weread.overall` | weread-skills readdata | `readDays` 总天数，`totalReadTime` 秒 |
| `weread.annually.dailyReadTimes` | weread-skills readdata 年度数据 | `{ "timestamp_sec": readSeconds }` |
| `weread.shelf.books` | weread-skills shelf | 书架列表 |
| `weread.bookProgress` | weread-skills readdata 详情 | 每本书进度和当前章节 |
| `imaNotes[].rawText` | ima-skill get_doc_content | IMA 笔记全文 |

## 结算流程

### Step 0：前置检查

```bash
# 检查 data.json 存在且合法
node -e "JSON.parse(require('fs').readFileSync('data.json','utf8'))" && echo "OK"
# 检查 settle.js 存在
node scripts/settle.js --help 2>/dev/null || node -e "require('./scripts/settle')" && echo "OK"
```

### Step 1：拉微信读书 API

```bash
# 1a 书架
weread-skills shelf
# 1b 阅读统计
weread-skills readdata
# 1c 每本书进度（用上一步 bookId 遍历）
weread-skills bookProgress --bookId <bookId>
```

提取字段：

- `shelf.books[]` → 书架
- `readdata.overall` → 总天数、总时长
- `readdata.annually[].dailyReadTimes` → 每日阅读数据
- `readdata.bookProgress[]` → 各书进度

### Step 2：拉 IMA 笔记

```bash
# 2a 获取"书道"笔记本
ima-skill list_notebook
# 2b 列出笔记
ima-skill list_note --notebookId <id>
# 2c 获取每条笔记内容
ima-skill get_doc_content --noteId <id>
```

筛选条件：
- 只处理书道笔记本（notebookName = "书道"）内的笔记
- 按 modifyTime 排序，取最近 N 条

### Step 3：组装 session_data.json

将 Step 1 和 Step 2 的数据与当前 data.json 合并为 session_data.json：

```json
{
  "dataJson": <当前 data.json 全文>,
  "weread": { <Step 1 结果> },
  "imaNotes": [ <Step 2 结果> ]
}
```

写入临时文件：

```bash
node -e "
const s = JSON.parse(require('fs').readFileSync('session_data.json','utf8'));
console.log('dataJson keys:', Object.keys(s.dataJson));
console.log('weread keys:', Object.keys(s.weread));
console.log('imaNotes count:', s.imaNotes.length);
"
```

### Step 4：执行 settle.js 结算计算

```bash
# 预览模式（推荐先预览）
node scripts/settle.js --dry-run < session_data.json
# 确认无误后正式计算
node scripts/settle.js < session_data.json > settle_output.json
```

输出格式：

```json
{
  "newDataJson": { /* 完整新 data.json */ },
  "report": {
    "notesProcessed": 3,
    "notesSkipped": 0,
    "totalXpGained": 150,
    "xpBreakdown": [
      { "noteId": "xxx", "bookName": "书名", "rating": 8, "bossXp": { "小怪": 30, "章Boss": 0, "书Boss": 0 }, "reviewXp": 0, "totalXp": 30 }
    ],
    "dimensionDeltas": { "政道": 51, "史道": 15 },
    "dimensionTierChanges": { "政道": { "from": "未入门", "to": "初窥门径" } },
    "bossesKilled": { "小怪": 3, "章Boss": 1, "书Boss": 0 },
    "levelUp": { "from": 1, "to": 2, "title": "诵经学徒" },
    "streakDays": 5,
    "booksCompleted": ["书名"],
    "warnings": []
  }
}
```

### Step 5：展示结算报告给用户确认

向用户呈现报告摘要：

```
📊 结算报告
━━━━━━━━━━━━━━━━━━
处理笔记：3 条（跳过 0 条）
获得 XP ：150
段位变化：政道 未入门 → 初窥门径
Boss 击杀：小怪×3  章Boss×1
等级变化：Lv.1 → Lv.2（诵经学徒）
连击天数：5 天
读完书籍：-
警告：无

是否写入 data.json？[y/N]
```

等待用户确认后再继续。

### Step 6：写入 data.json

```bash
# 从 settle_output.json 提取 newDataJson 写入
node -e "
const o = JSON.parse(require('fs').readFileSync('settle_output.json','utf8'));
require('fs').writeFileSync('data.json', JSON.stringify(o.newDataJson, null, 2) + '\n', 'utf8');
console.log('已写入 data.json');
"
```

### Step 7：输出结算摘要

向用户展示同步完成摘要：

```
✅ 同步完成
━━━━━━━━━━━━━━━━━━
累计 XP    ：{total}（{level} 级 · {title}）
Boss 记录  ：小怪×{n}  章Boss×{n}  书Boss×{n}
段位变化   ：{dim} {old}→{new}
阅读连击   ：{streak} 天
```

### Step 8：收尾

清理临时文件：

```bash
rm session_data.json settle_output.json
```

如果做了设计或需求变更，更新对应文档。非增量日常结算不需要更新文档。

## 幂等性说明

- `data.json` 的 `processedNoteIds` 字段记录已处理的 IMA noteId
- 已处理的笔记再次运行时自动跳过（`notesSkipped` 计数）
- 每本书的 `lastKnownChapterUid` / `lastKnownProgress` 做增量 Boss 检测
- 重复运行不会导致重复计分

## 异常处理

| 异常 | 处理 |
|------|------|
| 微信读书 API 超时 | 重试 1 次，仍失败则跳过，下次补算 |
| IMA 笔记格式不完整 | settle.js 容错解析，仅影响该条笔记，不阻塞整批 |
| 书名匹配不到书架 | settle.js 仍处理笔记（无 Boss 检测），仅丢失 Boss XP |
| settle.js 报错 | 检查 session_data.json 格式，修正后重跑 |
| data.json 损坏 | 从 git 恢复上次提交版本 |

## 首次同步

首次同步时 `processedNoteIds` 为空，所有 IMA 笔记都被处理。
注意：首次同步可能产生大量数据（取决于积压笔记数量）。
建议先用 `--dry-run` 预览。
