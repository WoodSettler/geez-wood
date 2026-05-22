/* =========================================================
   Wood cluster — vanilla JS · reads /wood data from <script id="wood-data">
   ========================================================= */
(() => {
  const dataEl = document.getElementById('wood-data');
  if (!dataEl) return;
  const { nodes, edges, adj } = JSON.parse(dataEl.textContent);

  const byId = Object.fromEntries(nodes.map(n => [n.slug, n]));
  const radius = (slug) => 6 + Math.min((adj[slug] || []).length, 8) * 1.6;

  const svg     = document.getElementById('mapSvg');
  const gEdges  = document.getElementById('edges');
  const gNodes  = document.getElementById('nodes');
  const canvas  = document.getElementById('mapCanvas');
  const sbBody  = document.getElementById('sbBody');
  const sbL     = document.getElementById('sbL');
  const sbR     = document.getElementById('sbR');
  const stageBtns = document.querySelectorAll('.stage-pill');
  const searchInp = document.getElementById('searchInput');
  const viewBtns  = document.querySelectorAll('.view-toggle button');
  const mapList   = document.getElementById('mapList');

  const state = { stage: 'all', search: '', selected: null, view: 'map', tx: 0, ty: 0, scale: 1 };

  // ─── edges ────────────────────────────────────
  edges.forEach((e, i) => {
    const na = byId[e.a], nb = byId[e.b];
    if (!na || !nb) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
    const dx = nb.x - na.x, dy = nb.y - na.y;
    const len = Math.hypot(dx, dy) || 1;
    const offset = ((i * 37) % 50) - 25;
    const px = mx + (-dy / len) * offset, py = my + (dx / len) * offset;
    path.setAttribute('d', `M ${na.x} ${na.y} Q ${px} ${py} ${nb.x} ${nb.y}`);
    path.classList.add('edge');
    path.setAttribute('data-a', e.a);
    path.setAttribute('data-b', e.b);
    gEdges.appendChild(path);
  });

  // ─── nodes ────────────────────────────────────
  nodes.forEach(n => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('node');
    g.setAttribute('data-id', n.slug);
    g.setAttribute('data-stage', n.stage);
    g.setAttribute('transform', `translate(${n.x}, ${n.y})`);

    const r = radius(n.slug);
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('r', r + 3);
    ring.classList.add('ring');
    g.appendChild(ring);

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', r);
    dot.classList.add('dot');
    g.appendChild(dot);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', 0);
    txt.setAttribute('y', r + 19);
    txt.setAttribute('text-anchor', 'middle');
    txt.classList.add('label');
    txt.textContent = n.title.length > 22 ? n.title.slice(0, 20) + '…' : n.title;
    g.appendChild(txt);

    g.addEventListener('mouseenter', () => highlight(n.slug));
    g.addEventListener('mouseleave', () => { if (!state.selected) clear(); else highlight(state.selected); });
    g.addEventListener('click', (ev) => { ev.stopPropagation(); select(n.slug); });

    gNodes.appendChild(g);
  });

  canvas.addEventListener('click', (ev) => {
    if (ev.target.closest('.node')) return;
    select(null);
  });

  // ─── highlight ────────────────────────────────
  function highlight(slug) {
    const related = new Set(adj[slug] || []);
    document.querySelectorAll('.node').forEach(g => {
      const id = g.getAttribute('data-id');
      g.classList.remove('is-related', 'is-faded', 'is-selected');
      if (id === slug) g.classList.add('is-selected');
      else if (related.has(id)) g.classList.add('is-related');
      else g.classList.add('is-faded');
    });
    document.querySelectorAll('.edge').forEach(p => {
      const a = p.getAttribute('data-a'), b = p.getAttribute('data-b');
      p.classList.remove('is-related', 'is-faded');
      if (a === slug || b === slug) p.classList.add('is-related');
      else p.classList.add('is-faded');
    });
    applyFilters();
  }
  function clear() {
    document.querySelectorAll('.node').forEach(g => g.classList.remove('is-related', 'is-faded', 'is-selected'));
    document.querySelectorAll('.edge').forEach(p => p.classList.remove('is-related', 'is-faded'));
    applyFilters();
  }

  // ─── filter ──────────────────────────────────
  function applyFilters() {
    const q = state.search.trim().toLowerCase();
    document.querySelectorAll('.node').forEach(g => {
      const id = g.getAttribute('data-id');
      const n = byId[id];
      const stageOK = state.stage === 'all' || n.stage === state.stage;
      const searchOK = !q ||
        n.title.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)) ||
        (n.summary || '').toLowerCase().includes(q);
      g.classList.toggle('is-hidden', !(stageOK && searchOK));
    });
  }

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.stage = btn.getAttribute('data-stage');
      applyFilters(); renderList();
    });
  });

  searchInp.addEventListener('input', () => {
    state.search = searchInp.value;
    applyFilters(); renderList();
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === '/') { e.preventDefault(); searchInp.focus(); }
    if (e.key === 'Escape') { select(null); searchInp.blur(); }
    if (['1','2','3','4'].includes(e.key)) stageBtns[parseInt(e.key)-1]?.click();
  });

  // ─── sidebar ─────────────────────────────────
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
  }
  function select(slug) {
    state.selected = slug;
    if (!slug) { clear(); renderDefault(); return; }
    highlight(slug);
    renderNote(slug);
  }
  function renderNote(slug) {
    const n = byId[slug];
    const links = [...(adj[slug] || [])].map(s => byId[s]).filter(Boolean);
    sbL.textContent = '/ wood / ' + slug;
    sbR.innerHTML = '<b>' + n.lastWatered + ' ago</b>';
    sbBody.innerHTML = `
      <div class="sb-note">
        <button class="close" id="closeBtn" style="float:right;font-family:var(--font-mono);font-size:12px;color:var(--ink-3);background:transparent;border:0;cursor:pointer;padding:0">close ×</button>
        <div class="stage-line ${n.stage}" style="display:inline-flex;align-items:center;gap:8px;font-family:var(--font-h);font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">
          <span class="blob" style="width:9px;height:9px;border-radius:50%;background:${n.stage==='evergreen'?'var(--dye-tomato)':n.stage==='growing'?'var(--dye-sun)':'var(--dye-sage)'}"></span>
          <span style="color:${n.stage==='evergreen'?'var(--dye-tomato)':n.stage==='growing'?'var(--dye-sun)':'var(--dye-sage)'}">${n.stage} · ${n.stage==='seedling'?'刚冒芽':n.stage==='growing'?'生长中':'长青'}</span>
        </div>
        <h3 style="font-family:var(--font-card);font-weight:400;font-size:28px;line-height:1.15;color:var(--ink);margin:0 0 12px;text-wrap:balance">${escapeHtml(n.title)}</h3>
        <p style="font-family:var(--font-body);font-style:italic;font-size:15px;line-height:1.55;color:var(--ink-2);margin:0 0 18px">${escapeHtml(n.summary)}</p>
        <dl style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-family:var(--font-mono);font-size:11px;color:var(--ink-2);padding:12px 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);margin:0 0 16px">
          <dt style="color:var(--ink-3);font-size:10px;letter-spacing:.06em;text-transform:uppercase">slug</dt><dd style="margin:0">/wood/${n.slug}</dd>
          <dt style="color:var(--ink-3);font-size:10px;letter-spacing:.06em;text-transform:uppercase">watered</dt><dd style="margin:0">${n.lastWatered} ago</dd>
          <dt style="color:var(--ink-3);font-size:10px;letter-spacing:.06em;text-transform:uppercase">linked</dt><dd style="margin:0">${links.length} backlink${links.length===1?'':'s'}</dd>
        </dl>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">
          ${n.tags.map(t => `<span class="tag" data-tag="${t}" style="font-family:var(--font-h);font-size:11px;padding:3px 8px;border:1px solid var(--rule);border-radius:999px;color:var(--ink-2);cursor:pointer">#${escapeHtml(t)}</span>`).join('')}
        </div>
        <h4 style="font-family:var(--font-h);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);margin:18px 0 8px;font-weight:500">backlinks · ${links.length}</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:4px">
          ${links.length === 0
            ? '<li style="font-family:var(--font-body);font-style:italic;color:var(--ink-3)">(orphan note — 还没有连接)</li>'
            : links.map(l => `<li data-go="${l.slug}" style="padding:6px 8px;background:var(--paper);border:1px solid var(--rule);font-family:var(--font-body);font-style:italic;font-size:13px;color:var(--ink);cursor:pointer">← ${escapeHtml(l.title)}</li>`).join('')}
        </ul>
        <a href="/wood/${n.slug}" style="display:inline-flex;align-items:center;gap:8px;font-family:var(--font-h);font-size:13px;font-weight:600;padding:10px 16px;background:var(--ink);color:var(--paper);border:1.5px solid var(--ink);text-decoration:none;margin-top:20px">open note →</a>
      </div>
    `;
    sbBody.querySelector('#closeBtn').addEventListener('click', () => select(null));
    sbBody.querySelectorAll('[data-go]').forEach(li => {
      li.addEventListener('click', () => select(li.getAttribute('data-go')));
    });
    sbBody.querySelectorAll('[data-tag]').forEach(t => {
      t.addEventListener('click', () => {
        searchInp.value = t.getAttribute('data-tag');
        state.search = searchInp.value;
        applyFilters(); renderList();
      });
    });
  }
  function renderDefault() {
    sbL.textContent = 'DETAILS · 详情';
    sbR.innerHTML = '<b>—</b>';
    // restore default body via re-render — easier to just reload
    location.hash = '';
    // we keep default markup from server render; reset by reloading? No — just clear
    // restore initial inner HTML if cached
    sbBody.innerHTML = initialSidebar;
    bindRecently();
  }
  function bindRecently() {
    sbBody.querySelectorAll('.recently a').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/wood/')) {
          e.preventDefault();
          select(href.replace('/wood/', ''));
        }
      });
    });
  }
  const initialSidebar = sbBody.innerHTML;
  bindRecently();

  // ─── list view ───────────────────────────────
  function renderList() {
    const q = state.search.trim().toLowerCase();
    const items = nodes.filter(n => {
      const stageOK = state.stage === 'all' || n.stage === state.stage;
      const searchOK = !q ||
        n.title.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)) ||
        (n.summary || '').toLowerCase().includes(q);
      return stageOK && searchOK;
    });
    mapList.innerHTML = items.length === 0
      ? '<div style="padding:80px 32px;text-align:center;font-family:var(--font-body);font-style:italic;color:var(--ink-3)">没有匹配的笔记</div>'
      : items.map(n => `
        <div class="row" data-stage="${n.stage}" data-id="${n.slug}">
          <span class="stamp">${n.lastWatered} ago</span>
          <span class="blob"></span>
          <span class="t">${escapeHtml(n.title)}</span>
          <span class="tags-mini">${n.tags.map(t => '#' + t).join(' ')}</span>
          <span class="bk">↗ ${(adj[n.slug] || []).length}</span>
        </div>
      `).join('');
    mapList.querySelectorAll('.row').forEach(r => {
      r.addEventListener('click', () => {
        select(r.getAttribute('data-id'));
        if (state.view === 'list') switchView('map');
      });
    });
  }

  function switchView(v) {
    state.view = v;
    viewBtns.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-view') === v));
    canvas.hidden = (v !== 'map');
    mapList.hidden = (v !== 'list');
    if (v === 'list') renderList();
  }
  viewBtns.forEach(b => b.addEventListener('click', () => switchView(b.getAttribute('data-view'))));

  // ─── pan + zoom ──────────────────────────────
  function applyTransform() {
    const t = `translate(${state.tx} ${state.ty}) scale(${state.scale})`;
    gNodes.setAttribute('transform', t);
    gEdges.setAttribute('transform', t);
  }
  let dragging = false, dragStart = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.node')) return;
    dragging = true; canvas.classList.add('is-dragging');
    dragStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    state.tx = dragStart.tx + (e.clientX - dragStart.x);
    state.ty = dragStart.ty + (e.clientY - dragStart.y);
    applyTransform();
  });
  window.addEventListener('pointerup', () => { dragging = false; canvas.classList.remove('is-dragging'); });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const dz = e.deltaY > 0 ? -0.1 : 0.1;
    state.scale = Math.max(0.5, Math.min(2.4, state.scale + dz));
    applyTransform();
  }, { passive: false });

  applyFilters();
  renderList();
})();
