/**
 * 书道系统 — 七维雷达图
 *
 * 用 Canvas（画布）绘制蜘蛛网图。
 *
 * Canvas 是 HTML5 的"画布"功能：
 * - 拿到一个 2D 绘图上下文（类似画笔）
 * - 在上面画线、画圆、填颜色
 * - 比 DOM 操作更适合做图表和动画
 */

// 等 DOM 加载完后再画
document.addEventListener('DOMContentLoaded', () => {
  // 先把 data.json 加载进来才能画
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      // 等 main.js 渲染完了再画雷达图
      // setTimeout 延迟 100ms，确保 DOM 已经更新完毕
      setTimeout(() => drawRadar(data.dimensions), 100);
    });
});

// 书域对应的配色（DESIGN.md 中的主题色）
const DOMAIN_COLORS = {
  '文学': '#dda0dd',
  '史学': '#c9a96e',
  '哲学': '#7b68ee',
  '数学': '#4682b4',
  '计算机': '#00ced1',
  '政治': '#8b4513',
  '管理': '#2e8b57'
};

/**
 * 绘制雷达图
 *
 * @param {Object} dimensions - 维度数据，如 {文学: 10, 史学: 10, ...}
 */
function drawRadar(dimensions) {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;  // 找不到画布就退出

  // 获取 2D 绘图上下文 —— 这就是那支"画笔"
  const ctx = canvas.getContext('2d');

  // 拿到维度名和值的数组
  const labels = Object.keys(dimensions);        // ['文学', '史学', ...]
  const values = Object.values(dimensions);      // [10, 10, 15, ...]
  const count = labels.length;                   // 7 个维度

  // Canvas 的实际像素尺寸
  const w = canvas.width;    // 400（在 HTML 上设的）
  const h = canvas.height;   // 400

  // 画布中心点和半径
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(cx, cy) - 40;  // 留 40px 边距

  // 记录每个维度的顶点位置（后面画数据和画标签都要用）
  const points = [];

  // 计算每个维度的角度
  // 一个圆是 2π 弧度，分成 count 份
  // 从 -π/2（正上方）开始，这样第一个维度在 12 点方向
  for (let i = 0; i < count; i++) {
    // 弧度 = i / count 个圆 - 半个圆（让第一个朝上）
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    points.push({
      angle,
      label: labels[i],
      value: values[i]
    });
  }

  // --- 动画参数 ---
  // 动画进度：从 0 到 1
  let progress = 0;
  // 动画速度：每帧增加的量
  const speed = 0.02;  // 约 1.5 秒完成（60fps × 1.5 ≈ 90 帧）

  /**
   * 动画循环函数
   *
   * requestAnimationFrame 是浏览器提供的"下一帧执行"方法
   * 浏览器每秒大概执行 60 次（60fps），比 setInterval 更平滑
   * 而且页面切换出去时会自动暂停，省资源
   */
  function animate() {
    // 每帧增加进度
    progress += speed;
    // 限制最大到 1（100%）
    if (progress > 1) progress = 1;

    // 清空画布，准备画新的一帧
    ctx.clearRect(0, 0, w, h);

    // --- 1. 画背景网格（蜘蛛网）---
    drawGrid(ctx, cx, cy, radius, count, points);

    // --- 2. 画数据区域（填充 + 边线）---
    drawData(ctx, cx, cy, radius, count, points, progress);

    // --- 3. 画标签文字 ---
    drawLabels(ctx, cx, cy, radius, points);

    // 如果还没到 100%，继续下一帧
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  // 启动动画
  animate();
}

/**
 * 画蜘蛛网背景网格
 *
 * 画 5 层同心多边形 + 从中心到顶点的连线
 */
function drawGrid(ctx, cx, cy, radius, count, points) {
  ctx.strokeStyle = 'rgba(42, 42, 74, 0.6)';
  ctx.lineWidth = 1;

  // 画 5 层网格（20% 到 100% 间隔）
  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;

    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = points[i].angle;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 画中心到顶点的连线（辐射线）
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const angle = points[i].angle;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/**
 * 画数据区域
 *
 * 这是雷达图的核心：把每个维度的值映射到图形上
 *
 * 原理：每个维度的值（0-100%）乘以半径，就得到数据点在画布上的位置
 * 把这些点连起来，就形成了一个不规则多边形
 *
 * @param {number} progress - 动画进度 0~1
 */
function drawData(ctx, cx, cy, radius, count, points, progress) {
  // 先把路径画出来
  ctx.beginPath();

  for (let i = 0; i < count; i++) {
    // 当前进度下的值（从 0 逐渐增长到目标值）
    const currentValue = (points[i].value / 100) * progress;
    const r = radius * currentValue;
    const x = cx + r * Math.cos(points[i].angle);
    const y = cy + r * Math.sin(points[i].angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  // 填充半透明颜色
  ctx.fillStyle = 'rgba(212, 167, 74, 0.15)';
  ctx.fill();

  // 描边
  ctx.strokeStyle = '#d4a74a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 画顶点小圆点
  for (let i = 0; i < count; i++) {
    const currentValue = (points[i].value / 100) * progress;
    const r = radius * currentValue;
    const x = cx + r * Math.cos(points[i].angle);
    const y = cy + r * Math.sin(points[i].angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = DOMAIN_COLORS[points[i].label] || '#d4a74a';
    ctx.fill();
  }
}

/**
 * 画标签文字
 *
 * 在每个维度的顶端写上名称和数值
 */
function drawLabels(ctx, cx, cy, radius, points) {
  ctx.font = '12px "Noto Serif SC", serif';
  ctx.textAlign = 'center';

  for (const point of points) {
    // 标签位置在顶点再往外 20px
    const labelR = radius + 20;
    const x = cx + labelR * Math.cos(point.angle);
    const y = cy + labelR * Math.sin(point.angle);

    // 维度名称
    ctx.fillStyle = DOMAIN_COLORS[point.label] || '#e8d5b7';
    ctx.fillText(point.label, x, y - 6);

    // 数值（像素字体）
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#8b8b8b';
    ctx.fillText(`${point.value}%`, x, y + 8);

    // 恢复字体
    ctx.font = '12px "Noto Serif SC", serif';
  }
}
