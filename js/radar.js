export function renderRadar(dimensions) {
  const el = document.getElementById('panel-radar');
  if (!el) return;
  el.innerHTML = `
    <div class="section-title">— 灵根 · 七道修行 —</div>
    <div class="radar-container">
      ${buildRadarSVG(dimensions)}
    </div>
  `;
}

function buildRadarSVG(dimensions) {
  const cx = 110, cy = 110, radius = 95;
  const dims = ['文道', '史道', '哲道', '政道', '世道', '心道', '器道'];
  const points = dims.map((_, i) => {
    const angle = (Math.PI * 2 * i / 7) - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const gridLines = [0.25, 0.5, 0.75, 1.0].map(scale =>
    points.map(p => ({
      x: cx + (p.x - cx) * scale,
      y: cy + (p.y - cy) * scale
    }))
  );

  const maxPoints = 32000;
  const dataPoints = dims.map((name, i) => {
    const dim = dimensions[name];
    const ratio = dim ? Math.min(dim.points / maxPoints, 1) : 0;
    const angle = (Math.PI * 2 * i / 7) - Math.PI / 2;
    return {
      x: cx + radius * ratio * Math.cos(angle),
      y: cy + radius * ratio * Math.sin(angle)
    };
  });

  return `<svg viewBox="0 0 220 220" class="radar-svg">
    ${gridLines.map(poly => `
      <polygon points="${poly.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"
        fill="none" stroke="rgba(180,150,100,0.06)" stroke-width="0.5"/>
    `).join('')}
    ${[0,1,2].map(i => {
      const p1 = points[i], p2 = points[i+3] || points[i-4];
      return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
        stroke="rgba(180,150,100,0.04)" stroke-width="0.5"/>`;
    }).join('')}
    <polygon points="${dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"
      fill="rgba(200,170,120,0.08)" stroke="rgba(200,170,120,0.3)" stroke-width="1"/>
    ${points.map((p, i) => `
      <text x="${p.x}" y="${p.y + (i < 3 ? -4 : 5)}" text-anchor="middle"
        fill="rgba(200,170,120,0.4)" font-size="9" font-weight="700">${dims[i]}</text>
    `).join('')}
    <circle cx="${cx}" cy="${cy}" r="1" fill="rgba(180,150,100,0.1)"/>
  </svg>`;
}
