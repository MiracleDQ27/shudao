import { renderRadar } from './radar.js';
import { renderMap } from './map.js';
import { renderCharacter, renderDimList, renderDungeon, renderInsights, renderStats } from './panels.js';

async function init() {
  try {
    const res = await fetch('data.json');
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
  renderDimList(dimensions);
  renderRadar(dimensions);
  renderMap(bookShelf, rules);
  renderDungeon(bossHistory);
  renderInsights(knowledgePoints);
  renderStats(stats, multiplier, player.totalXp);
}

function buildLayout(data, xpToNext, multiplier) {
  const { player, stats } = data;
  return `
    <div class="top-bar">
      <div class="top-bar-left">
        <span class="realm-badge">境</span>
        <span class="realm-name">${player.realm}</span>
        <span class="top-divider"></span>
        <span class="top-level">Lv.${player.level} · ${player.title}</span>
      </div>
      <div class="top-title">书 道</div>
      <div class="top-right">
        <span>修习 ${stats.totalDays} 日</span>
        <span>连续 ${stats.streakDays} 日</span>
        <span class="top-multiplier">加成 ×${multiplier}</span>
      </div>
    </div>
    <div class="main-grid" id="mainGrid">
      <div class="col-left">
        <div id="panel-character" class="panel-section"></div>
        <div id="panel-dimlist" class="panel-section"></div>
      </div>
      <div class="col-center">
        <div id="panel-radar" class="panel-section"></div>
        <div id="panel-map" class="panel-section" style="flex:1"></div>
      </div>
      <div class="col-right">
        <div id="panel-dungeon" class="panel-section"></div>
        <div id="panel-insights" class="panel-section"></div>
        <div id="panel-stats" class="panel-section"></div>
      </div>
    </div>
  `;
}

init();
