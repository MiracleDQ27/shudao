export function renderMap(bookShelf, rules) {
  const el = document.getElementById('panel-map');
  if (!el) return;
  const total = (bookShelf.completed?.length || 0) + (bookShelf.reading?.length || 0) + (bookShelf.plan?.length || 0);

  el.innerHTML = `
    <div class="section-title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span>— 书域 · 万卷山河 —</span>
      <span style="font-size:9px;color:var(--text-dim)">藏书 ${total} 卷 · 在读 ${bookShelf.reading?.length || 0}</span>
    </div>
    <div class="map-container">
      <div class="map-terrain">
        <span class="map-region" style="left:8%;bottom:50%;color:rgba(180,160,120,0.15)">文 道 域</span>
        <span class="map-region" style="left:35%;bottom:35%;color:rgba(180,160,120,0.1)">史 道 域</span>
        <span class="map-region" style="right:20%;top:22%;color:rgba(180,160,120,0.1)">哲 道 域</span>
        <span class="map-region" style="right:15%;bottom:45%;color:rgba(180,160,120,0.1)">器 道 域</span>
        <span class="map-region" style="left:18%;top:40%;color:rgba(180,160,120,0.08)">心 道 域</span>
        <span class="map-region" style="right:6%;bottom:28%;color:rgba(180,160,120,0.08)">世 道 域</span>
        <span class="map-region" style="right:8%;bottom:55%;color:rgba(180,160,120,0.08)">政 道 域</span>
        <div class="map-player">
          <span>道</span>
        </div>
        <div class="map-credit">万 卷 山 河</div>
      </div>
      <div class="map-legend">
        <span><i class="dot-done"></i>已探索</span>
        <span><i class="dot-dim"></i>待探索</span>
        <span><i class="dot-player"></i>当前位置</span>
      </div>
    </div>
  `;
}
