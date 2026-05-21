/**
 * 书道系统 — 主程序
 *
 * 职责：加载 data.json → 渲染页面上所有动态内容
 *
 * 这是整个前端的数据流起点：
 *   data.json → fetch → 解析 → 调用各渲染函数 → DOM 更新
 */

// =============================================
// 页面启动：等 HTML 全部加载完再执行 JS
// =============================================

// DOMContentLoaded：浏览器把 HTML 解析完了、DOM 树建好了，但图片/样式可能还没加载完
// 我们只需要操作 DOM，所以这个时机刚好
document.addEventListener('DOMContentLoaded', () => {
  // 用 fetch 加载 data.json
  // fetch 是浏览器内置的"发请求拿数据"的接口
  // 它返回一个 Promise（承诺），表示"我现在去拿，拿到了告诉你"
  fetch('data.json')
    // .then() 是 Promise 的回调：上一个步骤完成后的下一步
    // response.json() 把拿到的文本解析成 JS 对象（类似 JSON.parse）
    .then(response => response.json())
    .then(data => {
      // data 现在是一个 JS 对象，结构见 data.json
      renderAll(data);
    })
    .catch(error => {
      // 如果 data.json 加载失败（路径不对、文件不存在等）
      console.error('data.json 加载失败:', error);
      document.body.innerHTML = `
        <div style="text-align:center;padding:4rem 1rem;color:#8b8b8b;">
          <h2>⚠️ 数据加载失败</h2>
          <p style="color:#ff6b6b;">${error.message || '未知错误'}</p>
          <p>请确保 data.json 文件存在且格式正确</p>
        </div>
      `;
    });
});

// =============================================
// 主渲染函数：调用各个模块渲染页面
// =============================================

// 把 data 拆分传给各个渲染函数，每个只负责自己那一块
function renderAll(data) {
  renderPlayer(data.player, data.stats);
  renderCurrentBook(data.currentBook);
  renderDimensionLabels(data.dimensions);
  renderBossChain(data.currentBook.chapters);
  renderBossRecords(data.bossRecords);
  renderDomainMap(data.dimensions, data.currentBook.domain);
  renderBookshelf(data.bookShelf);
}

// =============================================
// 1. 角色信息
// =============================================

function renderPlayer(player, stats) {
  // document.getElementById()：根据 HTML 元素的 id 找到它
  // .textContent：修改元素的文字内容（更安全，不会解析 HTML）
  document.getElementById('player-name').textContent = player.name;
  document.getElementById('level-badge').textContent = `Lv.${player.level}`;
  document.getElementById('level-title').textContent = player.title;
  document.getElementById('xp-current').textContent = player.xp;
  document.getElementById('xp-next').textContent = player.xpToNext;
  document.getElementById('streak-days').textContent = stats.streakDays;
  document.getElementById('total-days').textContent = stats.totalDays;

  // 计算经验条百分比
  // Math.min() 防止超过 100%（比如升级后经验溢出）
  const xpPercent = Math.min((player.xp / player.xpToNext) * 100, 100);
  document.getElementById('xp-bar-fill').style.width = `${xpPercent}%`;
}

// =============================================
// 2. 当前阅读
// =============================================

function renderCurrentBook(book) {
  if (!book) return;

  document.getElementById('reading-title').textContent = `《${book.title}》`;
  document.getElementById('reading-author').textContent = book.author;
  document.getElementById('progress-text').textContent = `${book.progress}%`;
  document.getElementById('progress-fill').style.width = `${book.progress}%`;
}

// =============================================
// 3. 维度标签（雷达图下方的文字列表）
// =============================================

function renderDimensionLabels(dimensions) {
  const container = document.getElementById('dimension-labels');
  // Object.entries()：把对象转成 [key, value] 的数组
  // 比如 {文学: 10} → ["文学", 10]
  // 这样就可以用 forEach 遍历了
  const labels = Object.entries(dimensions).map(([name, value]) => {
    // 创建一个 span 元素
    const span = document.createElement('span');
    span.className = 'dimension-tag';
    span.textContent = `${name} ${value}%`;
    return span;
  });

  // 把生成的标签都塞进容器
  // ... 是展开运算符，把数组展开成一个个参数
  container.append(...labels);
}

// =============================================
// 4. Boss 链（当前副本的进度）
// =============================================

function renderBossChain(chapters) {
  const container = document.getElementById('boss-chain');
  container.innerHTML = ''; // 清空占位

  if (!chapters || chapters.length === 0) {
    container.innerHTML = '<div style="color:#8b8b8b;">暂无副本数据</div>';
    return;
  }

  // 找到第一个 locked 的章节作为"当前目标"
  const firstLockedIndex = chapters.findIndex(ch => ch.status === 'locked');

  chapters.forEach((chapter, index) => {
    const node = document.createElement('div');
    node.className = 'boss-node';

    // 根据状态决定样式和图标
    // 这是一个典型的"状态映射"模式
    let icon, statusText, extraClass;

    switch (chapter.status) {
      case 'done':
        icon = '✅';
        statusText = '已击破';
        extraClass = 'boss-done';
        break;
      case 'locked':
        icon = '🔒';
        statusText = index === firstLockedIndex ? '⚔️ 当前' : '未解锁';
        extraClass = index === firstLockedIndex ? 'boss-current' : 'boss-locked';
        break;
      default:
        icon = '❓';
        statusText = '未知';
        extraClass = 'boss-locked';
    }

    node.className = `boss-node ${extraClass}`;
    node.innerHTML = `
      <span class="boss-icon">${icon}</span>
      <span class="boss-name">${chapter.name}</span>
      <span class="boss-status">${statusText}</span>
    `;

    container.appendChild(node);
  });
}

// =============================================
// 5. Boss 战记录
// =============================================

function renderBossRecords(records) {
  const container = document.getElementById('records-list');
  container.innerHTML = '';

  if (!records || records.length === 0) {
    container.innerHTML = '<div style="color:#8b8b8b;text-align:center;padding:1rem 0;">暂无战斗记录</div>';
    return;
  }

  records.forEach(record => {
    const item = document.createElement('div');
    item.className = 'record-item';
    item.innerHTML = `
      <span class="record-date">${record.date}</span>
      <span class="record-boss">${record.bossName}</span>
      <span class="record-xp">+${record.xpGain}</span>
      <span class="record-summary">${record.summary}</span>
    `;
    container.appendChild(item);
  });
}

// =============================================
// 6. 书域地图
// 显示 7 个书域，当前在读的标记为"攻略中"
// =============================================

// 每个书域的图标和默认状态
const DOMAIN_META = {
  '文学': { icon: '📝', status: '未探索' },
  '史学': { icon: '📜', status: '未探索' },
  '哲学': { icon: '💭', status: '未探索' },
  '数学': { icon: '📐', status: '未探索' },
  '计算机': { icon: '💻', status: '未探索' },
  '政治': { icon: '⚖️', status: '未探索' },
  '管理': { icon: '📊', status: '未探索' }
};

function renderDomainMap(dimensions, activeDomain) {
  const container = document.getElementById('domain-grid');
  container.innerHTML = '';

  Object.entries(dimensions).forEach(([name, value]) => {
    const meta = DOMAIN_META[name] || { icon: '❓', status: '未知' };
    const cell = document.createElement('div');
    cell.className = 'domain-cell';

    // 判断状态：如果当前在读的书属于这个书域，标记为 active
    // 如果维度值 > 20%，标记为 cleared（有基础）
    let statusText, extraClass;

    if (name === activeDomain) {
      statusText = '⚔️ 攻略中';
      extraClass = 'domain-active';
    } else if (value >= 20) {
      statusText = '⭐ 有基础';
      extraClass = 'domain-cleared';
    } else if (value > 0) {
      statusText = '📚 待攻略';
      extraClass = '';
    } else {
      statusText = meta.status;
      extraClass = '';
    }

    if (extraClass) cell.classList.add(extraClass);

    cell.innerHTML = `
      <span class="domain-icon">${meta.icon}</span>
      <span class="domain-name">${name}</span>
      <span class="domain-status">${statusText}</span>
    `;

    container.appendChild(cell);
  });
}

// =============================================
// 7. 书架信息
// =============================================

function renderBookshelf(shelf) {
  if (!shelf) return;

  document.getElementById('book-total').textContent = shelf.total;
  document.getElementById('book-reading').textContent = shelf.reading.length;
  document.getElementById('book-done').textContent = shelf.completed.length;
  document.getElementById('plan-main').textContent = shelf.plan.main;
  document.getElementById('plan-sub').textContent = shelf.plan.sub;
  document.getElementById('plan-casual').textContent = shelf.plan.casual.join('、');
}
