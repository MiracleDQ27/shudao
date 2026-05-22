export function renderRadar(dimensions) {
  const el = document.getElementById('panel-radar');
  if (!el) return;
  el.innerHTML = `
    <div class="section-title">灵根 · 七道修行</div>
    <div class="radar-container">
      ${buildRadarSVG(dimensions)}
    </div>
  `;
}

function buildRadarSVG(dimensions) {
  const cx = 130, cy = 130, radius = 115;
  const dims = ['文道', '史道', '哲道', '政道', '世道', '心道', '器道'];
  const dimColors = {
    '文道': '#b8a8c8', '史道': '#c8b888', '哲道': '#a8b8d8',
    '政道': '#d8a888', '世道': '#88c8a8', '心道': '#d8b8a8', '器道': '#a8d8c8'
  };
  const points = dims.map((_, i) => {
    const angle = (Math.PI * 2 * i / 7) - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const gridLines = [0.25, 0.5, 0.75, 1.0].map(scale =>
    points.map(p => ({ x: cx + (p.x - cx) * scale, y: cy + (p.y - cy) * scale }))
  );

  const maxPoints = 32000;
  const dataPoints = dims.map((name, i) => {
    const dim = dimensions[name];
    const ratio = dim ? Math.min(dim.points / maxPoints, 1) : 0;
    const angle = (Math.PI * 2 * i / 7) - Math.PI / 2;
    return { x: cx + radius * ratio * Math.cos(angle), y: cy + radius * ratio * Math.sin(angle) };
  });

  const ptsStr = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return `<svg viewBox="0 0 260 260" class="radar-svg" style="display:block">
    <defs>
      <filter id="inkglow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    ${gridLines.map(poly => `
      <polygon points="${poly.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"
        fill="none" stroke="rgba(180,150,100,0.05)" stroke-width="0.5"/>
    `).join('')}
    ${points.map(p => `
      <line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"
        stroke="rgba(180,150,100,0.04)" stroke-width="0.5"/>`).join('')}
    <polygon points="${ptsStr}"
      fill="rgba(200,170,120,0.06)" stroke="rgba(200,170,120,0.2)" stroke-width="0.8"
      filter="url(#inkglow)"/>
    <polygon points="${ptsStr}"
      fill="rgba(200,170,120,0.04)" stroke="rgba(200,170,120,0.35)" stroke-width="1.2"/>
    ${dataPoints.map((p, i) => `
      <circle cx="${p.x}" cy="${p.y}" r="2.5"
        fill="${dimColors[dims[i]]}" opacity="0.4"
        data-dim="${dims[i]}"/>
    `).join('')}
    ${points.map((p, i) => `
      <text x="${p.x}" y="${p.y + (i < 3 ? -6 : 7)}" text-anchor="middle"
        fill="rgba(200,170,120,0.35)" font-size="10" font-weight="300"
        letter-spacing="2" data-dim="${dims[i]}">${dims[i]}</text>
    `).join('')}
    <circle cx="${cx}" cy="${cy}" r="1.5" fill="rgba(180,150,100,0.08)"/>
  </svg>`;
}

export function highlightDim(dimName) {
  const svg = document.querySelector('.radar-svg');
  if (!svg) return;
  // 重置所有顶点
  svg.querySelectorAll('circle[data-dim]').forEach(el => {
    el.setAttribute('opacity', '0.4');
    el.setAttribute('r', '2.5');
  });
  svg.querySelectorAll('text[data-dim]').forEach(el => {
    el.setAttribute('fill', 'rgba(200,170,120,0.35)');
  });
  if (!dimName) return;
  // 高亮选中维度
  const circle = svg.querySelector(`circle[data-dim="${dimName}"]`);
  const label = svg.querySelector(`text[data-dim="${dimName}"]`);
  if (circle) { circle.setAttribute('opacity', '0.9'); circle.setAttribute('r', '4'); }
  if (label) label.setAttribute('fill', 'rgba(200,170,120,0.8)');
}
