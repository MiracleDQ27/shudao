export function renderCharacter(player, xpToNext) {
  const el = document.getElementById('panel-character');
  if (!el) return;
  const progress = xpToNext > 0 ? Math.min(player.xp / xpToNext * 100, 100) : 0;
  el.innerHTML = `
    <div class="section-title">— 人物 —</div>
    <div class="char-avatar-row">
      <div class="char-avatar">
        <div class="char-avatar-ring"></div>
        <span class="char-avatar-text">${player.name[0]}</span>
      </div>
      <div class="char-info">
        <div class="char-name">${player.name}</div>
        <div class="char-title">${player.realm}境 · ${player.title}</div>
      </div>
    </div>
    <div class="char-xp-section">
      <div class="char-xp-header">
        <span>修为</span>
        <span>${player.xp} <span class="char-xp-total">/ ${xpToNext} XP</span></span>
      </div>
      <div class="xp-bar">
        <div class="xp-bar-fill" style="width:${progress}%"></div>
      </div>
      <div class="char-next">下一境还需 ${xpToNext - player.xp} XP</div>
    </div>
  `;
}

export function renderDimList(dimensions) {
  const el = document.getElementById('panel-dimlist');
  if (!el) return;
  const dimColors = {
    '文道': 'var(--wen)', '史道': 'var(--shi)', '哲道': 'var(--zhe)',
    '政道': 'var(--zheng)', '世道': 'var(--shi2)', '心道': 'var(--xin)', '器道': 'var(--qi)'
  };
  el.innerHTML = `
    <div class="section-title">— 灵根 · 道基 —</div>
    <div class="dim-list">
      ${Object.entries(dimensions).map(([name, dim]) => `
        <div class="dim-item" style="border-left-color:${dimColors[name] || 'var(--gold)'}">
          <span class="dim-name" style="color:${dimColors[name] || 'var(--text-primary)'}">${name}</span>
          <span class="dim-tier">${dim.tier}</span>
        </div>
      `).join('')}
    </div>
  `;
}

export function renderDungeon(bossHistory) {
  const el = document.getElementById('panel-dungeon');
  if (!el) return;
  if (!bossHistory || bossHistory.length === 0) {
    el.innerHTML = `
      <div class="section-title">— 副本 · 战历 —</div>
      <div class="empty-state">
        <div class="icon" style="font-size:24px">⚔</div>
        <div class="text">尚无战历</div>
        <div class="hint">读书 → 理解 → 战 Boss</div>
      </div>
      <div class="boss-types">
        <div class="boss-type"><div class="boss-type-label">小怪</div><div class="boss-type-hint">每次阅读</div></div>
        <div class="boss-type"><div class="boss-type-label">章 Boss</div><div class="boss-type-hint">每章结算</div></div>
        <div class="boss-type"><div class="boss-type-label">书 Boss</div><div class="boss-type-hint">全书通关</div></div>
      </div>
    `;
    return;
  }
  // TODO: render boss history list when data exists
}

export function renderInsights(knowledgePoints) {
  const el = document.getElementById('panel-insights');
  if (!el) return;
  const count = knowledgePoints?.length || 0;
  el.innerHTML = `
    <div class="section-title">— 感悟 · 道藏 —</div>
    <div class="empty-state" style="padding:10px 0">
      <div class="icon" style="font-size:18px">☯</div>
      <div class="text">${count > 0 ? `${count} 条感悟` : '尚无感悟'}</div>
    </div>
    <div class="insight-card">
      <div class="insight-header">
        <span>铭刻 · 知识点</span>
        <span class="insight-count">${count}</span>
      </div>
      <div class="insight-hint">连续 3 次答对复习题后铭刻</div>
    </div>
  `;
}

export function renderStats(stats, multiplier, totalXp) {
  const el = document.getElementById('panel-stats');
  if (!el) return;
  const hours = Math.floor((stats.totalReadingMinutes || 0) / 60);
  el.innerHTML = `
    <div class="section-title">— 修习 · 统计 —</div>
    <div class="stats-list">
      <div class="stat-row"><span>修习天数</span><span>${stats.totalDays || 0} 日</span></div>
      <div class="stat-row"><span>当前连续</span><span>${stats.streakDays || 0} 日</span></div>
      <div class="stat-row"><span>最长连续</span><span>${stats.streakDays || 0} 日</span></div>
      <div class="stat-row"><span>阅读总时长</span><span>${hours} 小时</span></div>
      <div class="stat-row"><span>修为加成</span><span>×${multiplier}</span></div>
      <div class="stat-row total-xp"><span>总修为</span><span>${totalXp || 0} XP</span></div>
    </div>
  `;
}
