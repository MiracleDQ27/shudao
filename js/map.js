export function renderMap(bookShelf, rules) {
  const el = document.getElementById('panel-map');
  if (!el) return;
  const total = (bookShelf.completed?.length || 0) + (bookShelf.reading?.length || 0) + (bookShelf.plan?.length || 0);

  el.innerHTML = `
    <div class="section-title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span>书域 · 万卷山河</span>
      <span style="font-size:10px;color:var(--text-dim)">藏书 ${total} 卷 · 在读 ${bookShelf.reading?.length || 0}</span>
    </div>
    <div class="map-wrapper">
      <svg viewBox="0 0 800 300" class="map-ink" preserveAspectRatio="xMidYMid meet">
        <rect width="800" height="300" fill="none"/>
        <defs>
          <radialGradient id="inkwash">
            <stop offset="0%" stop-color="rgba(180,150,100,0.03)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <path d="M30 280 Q80 180 150 200 Q200 160 260 190 Q300 140 370 170 Q420 120 500 160 Q560 110 630 150 Q680 130 740 170 L780 280 Z"
          fill="rgba(180,150,100,0.04)" stroke="rgba(180,150,100,0.08)" stroke-width="0.5"/>
        <path d="M30 280 Q60 220 100 230 Q130 200 170 220 Q190 240 180 280 Z"
          fill="rgba(184,168,200,0.06)" stroke="rgba(184,168,200,0.12)" stroke-width="0.5"/>
        <path d="M120 280 Q160 210 200 220 Q230 200 270 220 Q260 250 240 280 Z"
          fill="rgba(200,184,136,0.06)" stroke="rgba(200,184,136,0.12)" stroke-width="0.5"/>
        <path d="M220 280 Q270 190 320 210 Q360 180 400 210 Q390 240 370 280 Z"
          fill="rgba(168,184,216,0.06)" stroke="rgba(168,184,216,0.12)" stroke-width="0.5"/>
        <path d="M340 280 Q380 220 420 230 Q450 200 490 230 Q480 260 460 280 Z"
          fill="rgba(216,168,136,0.06)" stroke="rgba(216,168,136,0.12)" stroke-width="0.5"/>
        <path d="M440 280 Q480 200 530 220 Q560 190 600 220 Q590 250 570 280 Z"
          fill="rgba(136,200,168,0.06)" stroke="rgba(136,200,168,0.12)" stroke-width="0.5"/>
        <path d="M540 280 Q580 220 620 230 Q650 200 690 230 Q680 260 660 280 Z"
          fill="rgba(216,184,168,0.06)" stroke="rgba(216,184,168,0.12)" stroke-width="0.5"/>
        <path d="M640 280 Q680 210 720 220 Q760 200 790 230 Q780 260 770 280 Z"
          fill="rgba(168,216,200,0.06)" stroke="rgba(168,216,200,0.12)" stroke-width="0.5"/>
        <path d="M0 260 Q40 230 80 240 Q120 210 160 225 Q200 190 240 210 Q280 170 320 195 Q360 150 400 180 Q440 140 480 175 Q520 150 560 185 Q600 165 640 195 Q680 175 720 210 Q760 200 800 230"
          fill="none" stroke="rgba(180,150,100,0.08)" stroke-width="1"/>
        <path d="M0 280 Q60 260 120 270 Q180 250 240 265 Q300 245 360 260 Q420 240 480 258 Q540 245 600 260 Q660 248 720 265 Q780 255 800 270"
          fill="none" stroke="rgba(180,150,100,0.05)" stroke-width="0.8"/>
        <text x="105" y="255" fill="rgba(184,168,200,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">文道域</text>
        <text x="210" y="255" fill="rgba(200,184,136,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">史道域</text>
        <text x="330" y="255" fill="rgba(168,184,216,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">哲道域</text>
        <text x="450" y="255" fill="rgba(216,168,136,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">政道域</text>
        <text x="560" y="255" fill="rgba(136,200,168,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">世道域</text>
        <text x="660" y="255" fill="rgba(216,184,168,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">心道域</text>
        <text x="760" y="255" fill="rgba(168,216,200,0.2)" font-size="10" text-anchor="middle" letter-spacing="3">器道域</text>
        <circle cx="400" cy="220" r="5" fill="none" stroke="rgba(200,170,120,0.3)" stroke-width="1"/>
        <circle cx="400" cy="220" r="2" fill="rgba(200,170,120,0.2)"/>
        <circle cx="400" cy="180" r="120" fill="url(#inkwash)" opacity="0.3"/>
      </svg>
      <div class="map-legend">
        <span><span class="dot-done"></span>已探索</span>
        <span><span class="dot-dim"></span>待探索</span>
        <span><span class="dot-player"></span>当前位置</span>
      </div>
    </div>
  `;
}
