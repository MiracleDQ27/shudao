import { renderRadar, highlightDim } from './radar.js';
import { renderMap } from './map.js';
import { renderCharacter, renderDimList, renderDungeon, renderInsights, renderStats } from './panels.js';

async function init() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('data.json', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderAll(data);
  } catch (err) {
    document.getElementById('app').innerHTML = `<div id="error">数据加载失败: ${err.message}</div>`;
  }
}

function renderAll(data) {
  const { player, dimensions, stats, bossHistory, bookShelf, knowledgePoints, rules } = data;

  const levelEntry = rules.levelTable.find(l => l.level === player.level);
  const xpToNext = levelEntry ? levelEntry.xpToNext : 300;

  let multiplier = 1;
  for (const bonus of rules.streakBonuses) {
    if (stats.streakDays >= bonus.minDays && (bonus.maxDays === null || stats.streakDays <= bonus.maxDays)) {
      multiplier = bonus.multiplier;
      break;
    }
  }

  document.getElementById('app').innerHTML = buildLayout(data, xpToNext, multiplier);
  renderCharacter(player, xpToNext);
  renderDimList(dimensions, rules.dimensionTiers);
  renderRadar(dimensions);
  renderMap(bookShelf);
  renderDungeon(bossHistory);
  renderInsights(knowledgePoints);
  renderStats(stats, multiplier, player.totalXp);

  // 灵根列表 → 雷达图联动
  document.getElementById('panel-dimlist')?.addEventListener('click', (e) => {
    const item = e.target.closest('.dim-item');
    if (!item) return;
    const dim = item.dataset.dim;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.dim-item.active').forEach(el => el.classList.remove('active'));
    if (!wasActive) {
      item.classList.add('active');
      highlightDim(dim);
    } else {
      highlightDim(null);
    }
  });
}

function buildLayout(data, xpToNext, multiplier) {
  const { player, stats } = data;
  return `
    <div class="painting-bg">
      <svg viewBox="0 0 1920 650" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="mistA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(200,185,160,0)"/>
            <stop offset="45%" stop-color="rgba(200,185,160,0.02)"/>
            <stop offset="65%" stop-color="rgba(200,185,160,0.04)"/>
            <stop offset="100%" stop-color="rgba(200,185,160,0)"/>
          </linearGradient>
          <linearGradient id="mistB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(200,185,160,0)"/>
            <stop offset="40%" stop-color="rgba(200,185,160,0.015)"/>
            <stop offset="70%" stop-color="rgba(200,185,160,0.03)"/>
            <stop offset="100%" stop-color="rgba(200,185,160,0)"/>
          </linearGradient>
          <linearGradient id="mistC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(220,205,180,0)"/>
            <stop offset="50%" stop-color="rgba(220,205,180,0.025)"/>
            <stop offset="80%" stop-color="rgba(220,205,180,0.04)"/>
            <stop offset="100%" stop-color="rgba(220,205,180,0)"/>
          </linearGradient>
        </defs>

        <!-- 1. 最远景 — 淡墨 -->
        <path d="M-100 650 Q0 400 80 420 Q160 350 250 370 Q340 290 440 330 Q520 250 600 280 Q680 210 780 250 Q860 190 960 230 Q1020 170 1100 200 Q1180 150 1260 180 Q1340 130 1420 160 Q1500 110 1580 140 Q1660 100 1740 130 Q1820 90 1900 120 Q1980 80 2060 120 L2060 650 Z"
          fill="rgba(180,160,130,0.035)" stroke="rgba(180,160,130,0.015)" stroke-width="0.5"/>

        <!-- 2. 远景 — 淡墨 + 尖峰 -->
        <path d="M-80 650 Q0 440 60 430 Q120 370 180 400 Q240 320 320 360 Q380 260 440 300 Q500 220 560 270 Q620 200 680 250 Q740 190 800 240 Q860 180 940 230 Q1000 170 1060 210 Q1120 160 1180 200 Q1240 150 1320 190 Q1380 140 1440 180 Q1500 130 1580 170 Q1640 120 1720 160 Q1800 110 1880 150 Q1960 100 2040 150 L2040 650 Z"
          fill="rgba(160,140,115,0.045)" stroke="rgba(160,140,115,0.02)" stroke-width="0.5"/>

        <!-- 雾霭 A -->
        <rect x="0" y="280" width="2060" height="140" fill="url(#mistA)"/>

        <!-- 3. 中远景 — 左侧主峰群 -->
        <path d="M-60 650 Q0 500 40 490 Q80 440 120 470 Q160 400 220 440 Q280 360 340 400 Q380 340 420 380 Q460 320 500 370 Q540 300 600 350 Q640 290 700 340 Q740 280 800 330 Q860 270 920 320 Q960 260 1000 300 Q1040 240 1080 290 Q1120 230 1160 280 Q1200 220 1240 270 Q1280 210 1340 260 Q1400 200 1460 250 Q1520 200 1580 240 Q1640 190 1700 230 Q1760 190 1840 230 Q1920 180 2000 220 Q2080 170 2140 220 L2140 650 Z"
          fill="rgba(140,120,95,0.055)" stroke="rgba(140,120,95,0.025)" stroke-width="0.5"/>

        <!-- 雾霭 B -->
        <rect x="0" y="360" width="2140" height="120" fill="url(#mistB)"/>

        <!-- 4. 中近景 — 右侧群峰 -->
        <path d="M-40 650 Q20 540 100 560 Q160 480 260 520 Q320 440 400 480 Q460 400 540 440 Q600 370 680 420 Q740 350 820 400 Q880 340 960 390 Q1020 330 1100 380 Q1160 320 1240 370 Q1300 310 1380 360 Q1440 300 1520 350 Q1580 290 1660 340 Q1720 290 1800 330 Q1860 280 1940 320 Q2000 270 2080 310 Q2140 260 2200 310 L2200 650 Z"
          fill="rgba(130,110,85,0.065)" stroke="rgba(130,110,85,0.025)" stroke-width="0.5"/>

        <!-- 5. 近景 — 浓墨主峰 -->
        <path d="M-20 650 Q40 560 120 580 Q180 520 280 560 Q340 490 420 540 Q480 460 560 510 Q620 440 700 490 Q760 430 840 480 Q900 420 980 470 Q1040 410 1120 460 Q1180 400 1260 450 Q1320 390 1400 440 Q1460 380 1540 430 Q1600 380 1680 420 Q1740 370 1820 410 Q1880 360 1960 400 Q2020 350 2100 390 Q2160 340 2220 390 L2220 650 Z"
          fill="rgba(120,100,75,0.075)" stroke="rgba(120,100,75,0.03)" stroke-width="0.5"/>

        <!-- 雾霭 C — 山腰横雾 -->
        <rect x="0" y="420" width="2220" height="100" fill="url(#mistC)"/>

        <!-- 6. 最前景 — 墨色最浓 -->
        <path d="M0 650 Q60 580 140 600 Q200 540 300 580 Q360 510 460 550 Q520 480 620 530 Q680 460 780 510 Q840 450 940 500 Q1000 440 1100 490 Q1160 440 1260 480 Q1320 420 1420 470 Q1480 420 1580 460 Q1640 410 1740 450 Q1800 400 1900 440 Q1960 390 2060 430 Q2120 380 2220 430 L2220 650 Z"
          fill="rgba(100,80,60,0.09)" stroke="rgba(100,80,60,0.035)" stroke-width="0.5"/>

        <!-- 飞鸟 — 两点墨 -->
        <path d="M800 180 Q810 170 815 178 Q820 170 830 180" fill="none" stroke="rgba(100,80,60,0.06)" stroke-width="1"/>
        <path d="M840 160 Q848 152 852 158 Q856 152 864 160" fill="none" stroke="rgba(100,80,60,0.05)" stroke-width="1"/>
        <path d="M820 200 Q826 194 830 198 Q834 194 840 200" fill="none" stroke="rgba(100,80,60,0.04)" stroke-width="0.8"/>
      </svg>
    </div>

    <div class="painting-content">
      <div class="scroll-topbar">
        <div class="topbar-left">
          <span class="realm-seal">${player.realm}</span>
          <span class="topbar-divider"></span>
          <span class="topbar-level">${player.name} · ${player.title} · Lv.${player.level}</span>
        </div>
        <div class="topbar-title">书 道</div>
        <div class="topbar-right">
          <span>修习 ${stats.totalDays} 日</span>
          <span class="topbar-dot"></span>
          <span>连续 ${stats.streakDays} 日</span>
          <span class="topbar-dot"></span>
          <span>加成 ×${multiplier}</span>
        </div>
      </div>

      <div class="main-grid">
        <div class="col-left">
          <div id="panel-character" class="panel-card"></div>
          <div id="panel-dimlist" class="panel-card"></div>
        </div>
        <div class="col-center">
          <div id="panel-radar" class="panel-card"></div>
          <div id="panel-map" class="panel-card"></div>
        </div>
        <div class="col-right">
          <div id="panel-dungeon" class="panel-card"></div>
          <div id="panel-insights" class="panel-card"></div>
          <div id="panel-stats" class="panel-card"></div>
        </div>
      </div>
    </div>
  `;
}

init();
