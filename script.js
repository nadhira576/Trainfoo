/* ===== CLOCK ===== */
const clock = document.getElementById('clock');
function tick(){ const d=new Date(); clock.textContent=`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} WIB`; }
tick(); setInterval(tick, 30000);

/* ===== TABS ===== */
const tabs = document.querySelectorAll('.tab');
const screens = document.querySelectorAll('.screen');
function go(toId){
  tabs.forEach(t=>t.classList.toggle('active', t.dataset.to===toId));
  screens.forEach(sc=>sc.classList.toggle('active', sc.id===toId));
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(btn=>btn.addEventListener('click', ()=>go(btn.dataset.to)));
document.querySelectorAll('[data-to]').forEach(e=>{
  if(e.tagName==='A' || e.classList.contains('btn') || e.classList.contains('brand')) e.addEventListener('click', ()=>go(e.dataset.to));
});

/* ===== DATA PETA (1200x800) ===== */
const STATIONS = [
  { id:'BOG', name:'St. Bogor', x:120, y:700, line:['RED'] },
  { id:'CIT', name:'St. Cilebut', x:160, y:670, line:['RED'] },
  { id:'DEP', name:'St. Depok', x:220, y:610, line:['RED'] },
  { id:'UI ', name:'St. UI',    x:260, y:560, line:['RED'] },
  { id:'TAN', name:'St. Tanah Abang', x:430, y:540, line:['BLUE'] },
  { id:'PLM', name:'St. Palmerah',    x:430, y:620, line:['BLUE'] },
  { id:'MGR', name:'St. Manggarai', x:550, y:480, line:['RED','BLUE'] },
  { id:'SUD', name:'St. Sudirman', x:590, y:430, line:['RED'] },
  { id:'DUK', name:'St. Duku Atas', x:630, y:390, line:['RED'] },
  { id:'JUA', name:'St. Juanda', x:740, y:300, line:['RED'] },
  { id:'KOT', name:'St. Jakarta Kota', x:820, y:240, line:['RED'] },
  { id:'PSM', name:'St. Pasar Minggu', x:650, y:560, line:['BLUE'] },
  { id:'PSR', name:'St. Pasar Senen', x:670, y:340, line:['RED'] }
];
const LINES = {
  RED:  { name:'Red Line',  color:'#E54D4D', path:[
    '120,700 160,670 220,610 260,560 550,480 590,430 630,390 670,340 740,300 820,240'
  ]},
  BLUE: { name:'Blue Line', color:'#3b82f6', path:[
    '430,620 430,540 550,480 650,560'
  ]}
};

/* ===== WEATHER & HOME STATS ===== */
const WX = ['Cerah','Cerah Berawan','Berawan','Hujan Ringan','Hujan Sedang'];
const wxStatus = document.getElementById('wxStatus');
const wxTemp = document.getElementById('wxTemp');
const wxStation = document.getElementById('wxStation');
function updateWeather(){
  const s = STATIONS[Math.floor(Math.random()*STATIONS.length)];
  const cond = WX[Math.floor(Math.random()*WX.length)];
  const t = 26 + Math.floor(Math.random()*6);
  if(wxStatus){ wxStatus.textContent = cond; }
  if(wxTemp){ wxTemp.textContent = `${t}°C`; }
  if(wxStation){ wxStation.textContent = s.name; }
}
updateWeather(); setInterval(updateWeather, 120000);

let lastReport = null;
const densityEl = document.getElementById('density');
const densityAgo = document.getElementById('densityAgo');
function renderDensity(){
  if(!densityEl || !densityAgo) return;
  if(!lastReport){
    densityEl.textContent='Level 3/5'; densityAgo.textContent='—';
    const c = document.getElementById('densityCar'); if(c) c.textContent='Level 3/5';
    const ca = document.getElementById('densityAgoCar'); if(ca) ca.textContent='—';
    const s = document.getElementById('densitySta'); if(s) s.textContent='Level 3/5';
    const sa = document.getElementById('densityAgoSta'); if(sa) sa.textContent='—';
    return;
  }
  const mins = Math.max(1, Math.round((Date.now()-lastReport.time)/60000));
  const txt = `Level ${lastReport.level}/5 @ ${lastReport.station}`;
  densityEl.textContent = txt; densityAgo.textContent = `${mins} mnt lalu`;
  const c = document.getElementById('densityCar'); if(c) c.textContent = txt;
  const ca = document.getElementById('densityAgoCar'); if(ca) ca.textContent = `${mins} mnt lalu`;
  const s = document.getElementById('densitySta'); if(s) s.textContent = txt;
  const sa = document.getElementById('densityAgoSta'); if(sa) sa.textContent = `${mins} mnt lalu`;
}

/* Stats */
function updateStats(){
  const trips = Number(sessionStorage.getItem('trainfo:trips')||'0');
  const reports = Number(localStorage.getItem('trainfo:reports')||'0');
  const favs = JSON.parse(localStorage.getItem('trainfo:favs')||'[]').length;
  const a = document.getElementById('statTrips'); if(a) a.textContent = trips;
  const b = document.getElementById('statReports'); if(b) b.textContent = reports;
  const c = document.getElementById('statFavs'); if(c) c.textContent = favs;
}
renderDensity(); updateStats();

/* ===== FAVORIT (modal) ===== */
const favChips = document.getElementById('favChips');
const modalFav = document.getElementById('modalFav');
const favFrom = document.getElementById('favFrom');
const favTo = document.getElementById('favTo');
const openFavBtn = document.getElementById('btnAddFav');
if(openFavBtn){
  openFavBtn.onclick=()=>{ fillSelect(favFrom); fillSelect(favTo); modalFav.showModal(); };
}
const favSaveBtn = document.getElementById('btnFavSave');
if(favSaveBtn){
  favSaveBtn.onclick=(e)=>{
    e.preventDefault();
    const a=favFrom.value, b=favTo.value;
    if(a===b){ alert('Asal & tujuan tidak boleh sama'); return; }
    const favs = JSON.parse(localStorage.getItem('trainfo:favs')||'[]');
    favs.push({from:a,to:b}); localStorage.setItem('trainfo:favs', JSON.stringify(favs));
    renderFavs(); modalFav.close(); updateStats();
  };
}
function renderFavs(){
  if(!favChips) return;
  favChips.innerHTML='';
  const favs = JSON.parse(localStorage.getItem('trainfo:favs')||'[]');
  if(!favs.length){ favChips.innerHTML='<span class="muted">Belum ada rute favorit</span>'; return; }
  favs.forEach((f)=>{
    const from = STATIONS.find(s=>s.id===f.from)?.name || f.from;
    const to = STATIONS.find(s=>s.id===f.to)?.name || f.to;
    const el = document.createElement('span');
    el.className='chip'; el.textContent=`${from} → ${to}`;
    el.title='Klik untuk cari jadwal'; el.style.cursor='pointer';
    el.onclick=()=>{
      go('screen-schedule');
      document.getElementById('fromStation').value=f.from;
      document.getElementById('toStation').value=f.to;
      document.getElementById('formSchedule').requestSubmit();
    };
    favChips.appendChild(el);
  });
}
renderFavs();

/* ===== MAP RENDER ===== */
const svg = document.getElementById('mapSvg');
const LAYER_LINES = document.getElementById('layer-lines');
const LAYER_STATIONS = document.getElementById('layer-stations');
const LAYER_ROUTE = document.getElementById('layer-route');

function renderLines(){
  if(!LAYER_LINES) return;
  LAYER_LINES.innerHTML = '';
  Object.values(LINES).forEach(line=>{
    line.path.forEach(pts=>{
      const el = document.createElementNS('http://www.w3.org/2000/svg','polyline');
      el.setAttribute('points', pts);
      el.setAttribute('stroke', line.color);
      el.setAttribute('stroke-width', 12);
      el.setAttribute('fill','none');
      el.setAttribute('stroke-linecap','round');
      el.setAttribute('stroke-linejoin','round');
      LAYER_LINES.appendChild(el);
    });
  });
}
function renderStations(){
  if(!LAYER_STATIONS) return;
  LAYER_STATIONS.innerHTML='';
  STATIONS.forEach(s=>{
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',s.x); c.setAttribute('cy',s.y); c.setAttribute('r',10);
    c.setAttribute('class','station-dot'); c.setAttribute('data-sta',s.id);
    c.setAttribute('fill','#fff'); c.setAttribute('stroke', s.line.includes('RED')? '#E54D4D':'#3b82f6');
    c.setAttribute('stroke-width','5'); c.style.cursor='pointer';
    c.addEventListener('click',()=>openTooltip(s));
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', s.x+12); t.setAttribute('y', s.y-12);
    t.textContent = s.name;
    LAYER_STATIONS.appendChild(c); LAYER_STATIONS.appendChild(t);
  });
}
renderLines(); renderStations();

/* Zoom & Pan */
let view = {x:0, y:0, w:1200, h:800};
function applyView(){ if(svg) svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`); }
function zoom(f, cx=600, cy=400){
  view.x = cx-(cx-view.x)*f; view.y = cy-(cy-view.y)*f; view.w*=f; view.h*=f; applyView();
}
if(svg){
  svg.addEventListener('wheel', e=>{ e.preventDefault(); zoom(e.deltaY<0?0.9:1.1, e.offsetX*(view.w/svg.clientWidth)+view.x, e.offsetY*(view.h/svg.clientHeight)+view.y); }, {passive:false});
}
let drag=null;
if(svg){
  svg.addEventListener('mousedown',e=>drag={x:e.clientX,y:e.clientY,ox:view.x,oy:view.y});
  window.addEventListener('mouseup',()=>drag=null);
  window.addEventListener('mousemove',e=>{
    if(!drag) return;
    const dx = (e.clientX-drag.x)*(view.w/svg.clientWidth);
    const dy = (e.clientY-drag.y)*(view.h/svg.clientHeight);
    view.x = drag.ox - dx; view.y = drag.oy - dy; applyView();
  });
}
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetMapBtn = document.getElementById('resetMap');
if(zoomInBtn) zoomInBtn.onclick=()=>zoom(0.9);
if(zoomOutBtn) zoomOutBtn.onclick=()=>zoom(1.1);
if(resetMapBtn) resetMapBtn.onclick=()=>{ view={x:0,y:0,w:1200,h:800}; applyView(); };

function centerOnStation(id){
  const s = STATIONS.find(v=>v.id===id); if(!s) return;
  view.x = s.x - view.w/2; view.y = s.y - view.h/2; applyView();
}
function highlightRoute(fromId, toId){
  if(!LAYER_ROUTE) return;
  LAYER_ROUTE.innerHTML='';
  const from = STATIONS.find(s=>s.id===fromId);
  const to   = STATIONS.find(s=>s.id===toId);
  if(!from || !to) return;
  const path = document.createElementNS('http://www.w3.org/2000/svg','polyline');
  path.setAttribute('points', `${from.x},${from.y} ${to.x},${to.y}`);
  LAYER_ROUTE.appendChild(path);
}

/* Map search */
const searchStation = document.getElementById('searchStation');
const btnClearSearch = document.getElementById('btnClearSearch');
if(searchStation){
  searchStation.addEventListener('input', ()=>{
    const q = searchStation.value.toLowerCase().trim();
    LAYER_STATIONS.querySelectorAll('.station-dot').forEach(c=>c.setAttribute('fill','#fff'));
    if(!q) return;
    STATIONS.forEach(s=>{
      if(s.name.toLowerCase().includes(q)){
        LAYER_STATIONS.querySelector(`.station-dot[data-sta="${s.id}"]`)?.setAttribute('fill','#fde047');
        centerOnStation(s.id);
      }
    });
  });
}
if(btnClearSearch) btnClearSearch.onclick=()=>{ searchStation.value=''; searchStation.dispatchEvent(new Event('input')); };

/* Tooltip */
const tooltip = document.getElementById('tooltip');
function openTooltip(s){
  if(!tooltip) return;
  tooltip.innerHTML = `
    <b>${s.name}</b><br/>
    <small>Line: ${s.line.join(', ')}</small>
    <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn red small" id="ttJadwal">Jadwal</button>
      <button class="btn ghost small" id="ttKe">Ke sini</button>
      <button class="btn ghost small" id="ttLapor">Lapor</button>
    </div>`;
  tooltip.classList.add('show');
  const ttJ = document.getElementById('ttJadwal');
  const ttK = document.getElementById('ttKe');
  const ttL = document.getElementById('ttLapor');
  if(ttJ) ttJ.onclick=()=>{ go('screen-schedule'); fromSel.value=s.id; };
  if(ttK) ttK.onclick=()=>{ highlightRoute(fromSel.value, s.id); go('screen-map'); };
  if(ttL) ttL.onclick=()=>{ reportStation.value=s.id; modalReport.showModal(); };
}
document.addEventListener('click', (e)=>{
  if(!tooltip) return;
  const isDot = e.target.closest ? e.target.closest('.station-dot') : null;
  if(!tooltip.contains(e.target) && !isDot) tooltip.classList.remove('show');
});

/* ===== JADWAL ===== */
function fillSelect(sel){ if(!sel) return; sel.innerHTML = STATIONS.map(s=>`<option value="${s.id}">${s.name}</option>`).join(''); }
const fromSel = document.getElementById('fromStation');
const toSel   = document.getElementById('toStation');
const datePick= document.getElementById('datePick');
const linePick= document.getElementById('linePick');
fillSelect(fromSel); fillSelect(toSel); fillSelect(favFrom); fillSelect(favTo);
if(datePick) datePick.value = new Date().toISOString().slice(0,10);

function mockSchedules(from, to, line='ALL'){
  const base = new Date(); base.setMinutes(base.getMinutes() + 5);
  const rows = [];
  for (let i=0;i<8;i++){
    const dep = new Date(base.getTime() + i*10*60000);
    const dur = 20 + Math.floor(Math.random()*25);
    const arr = new Date(dep.getTime() + dur*60000);
    const useLine = line==='ALL' ? (Math.random()>.5?'RED':'BLUE') : line;
    rows.push({ depart: time(dep), arrive: time(arr), dur: `${dur} mnt`, line: useLine });
  }
  return rows;
}
function time(d){ return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }

const tblBody = document.querySelector('#tblSchedule tbody');
const scheduleMeta = document.getElementById('scheduleMeta');
const formSchedule = document.getElementById('formSchedule');
if(formSchedule){
  formSchedule.addEventListener('submit',(e)=>{
    e.preventDefault();
    const from = fromSel.value, to = toSel.value, line=linePick.value;
    if(from===to){ alert('Asal & tujuan tidak boleh sama'); return; }
    const rows = mockSchedules(from, to, line).filter(r=> line==='ALL' || r.line===line);
    tblBody.innerHTML = rows.map(r=>`<tr><td>${r.depart}</td><td>${r.arrive}</td><td>${r.dur}</td><td>${r.line==='RED'?'Red Line':'Blue Line'}</td></tr>`).join('');
    scheduleMeta.textContent = `${STATIONS.find(s=>s.id===from).name} → ${STATIONS.find(s=>s.id===to).name} • ${rows.length} opsi`;
    sessionStorage.setItem('trainfo:trips', String((+sessionStorage.getItem('trainfo:trips')||0)+1));
    updateStats();
    highlightRoute(from, to);
    go('screen-map');
  });
}

/* Save favorite from schedule */
const btnSaveFav = document.getElementById('btnSaveFav');
if(btnSaveFav){
  btnSaveFav.onclick=()=>{
    const from=fromSel.value, to=toSel.value;
    if(from===to) return alert('Asal dan tujuan tidak boleh sama.');
    const favs = JSON.parse(localStorage.getItem('trainfo:favs')||'[]');
    favs.push({from,to}); localStorage.setItem('trainfo:favs', JSON.stringify(favs));
    renderFavs(); updateStats(); alert('Disimpan ke Favorit!');
  };
}

/* ===== REPORT (modal) ===== */
const modalReport = document.getElementById('modalReport');
const reportStation = document.getElementById('reportStation');
const quickReportBtn = document.getElementById('btnReport');
const quickHomeBtn = document.getElementById('quickReport'); // in home (not present in desktop hero)
if(quickHomeBtn){ quickHomeBtn.onclick=()=>{ fillSelect(reportStation); modalReport.showModal(); }; }
if(quickReportBtn){ quickReportBtn.onclick=()=>{ fillSelect(reportStation); modalReport.showModal(); }; }
const formReport = document.getElementById('formReport');
if(formReport){
  formReport.addEventListener('submit', e=>e.preventDefault());
}
const btnReportSend = document.getElementById('btnReportSend');
if(btnReportSend){
  btnReportSend.onclick=(e)=>{
    e.preventDefault();
    lastReport = {
      station: STATIONS.find(s=>s.id===reportStation.value).name,
      level: Number(document.getElementById('reportLevel').value),
      note: document.getElementById('reportNote').value.trim(),
      time: Date.now()
    };
    localStorage.setItem('trainfo:reports', String((+localStorage.getItem('trainfo:reports')||0)+1));
    modalReport.close(); renderDensity(); updateStats();
    alert('Terima kasih! Laporan kepadatan tercatat.');
  };
}

/* ===== AKUN (demo interaksi) ===== */
const btnEditProfile = document.getElementById('btnEditProfile');
if(btnEditProfile) btnEditProfile.onclick=()=>alert('Demo: fitur ubah profil belum tersambung.');
const btnNotifDelay = document.getElementById('btnNotifDelay');
if(btnNotifDelay) btnNotifDelay.onclick=()=>alert('Demo: notifikasi delay diaktifkan.');
const btnFaq = document.getElementById('btnFaq');
if(btnFaq) btnFaq.onclick=()=>alert('FAQ: hubungi support@trainfo.app');
const btnLogout = document.getElementById('btnLogout');
if(btnLogout) btnLogout.onclick=()=>alert('Demo: logout.');

/* Misc */
const btnNotify = document.getElementById('btnNotify');
if(btnNotify) btnNotify.onclick=()=>alert('Demo: notifikasi tersimpan.');
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ if(tooltip) tooltip.classList.remove('show'); }});
