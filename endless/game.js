(function(){

const RADIUS = 3;
const TARGET_SIZE = Math.min(window.innerWidth, window.innerHeight / 2);
const S = TARGET_SIZE / (RADIUS * 3.2);
let CX = 240, CY = 222;

window.addEventListener("load", () => {
  const svg = document.getElementById("board");
  const rect = svg.getBoundingClientRect();
  CX = rect.width / 2;
  CY = S * RADIUS * 1.5;
  render();
});

const COLORS = [null,'#0000FF','#008000','#FF0000','#000080','#800000','#008080','#000000','#808080','#302d2d',"#631717","#687f39","#8d5b17","#6407b5","#00ff17","#00ffe5","#ff9e00","#00b0ff","#54006a","#554444","#6d4a00","#4c00d0","#00ffa5","#b10000","#a200ff"];
const DOT_COLORS = ['#FF4E4E','#FF9500','#FFCC00','#34C759','#00C7BE','#007AFF','#AF52DE','#FF2D55','#FF6B35','#00E5FF'];

let grid = {}, selected = [], dragging = false;
let score = 0, minVal = 1, gameOver = false;




// ─── COMBO ────────────────────────────────────────────────────────────────────
// stos zdarzeń: 'super' (+1) lub 'mega' (+2)
// gdy suma >= 3 → COMBO xN
let comboStack = [];
function comboWeight(t){ return t === 'mega' ? 2 : 1; }
function comboTotal(st){ return st.reduce((s,t) => s + comboWeight(t), 0); }

// ─── POPUP LAYER ──────────────────────────────────────────────────────────────
let popLayer = null;

function ensureLayer(){
  if(popLayer) return;
  popLayer = document.createElement('div');
  Object.assign(popLayer.style, {
    position:'fixed', inset:'0', pointerEvents:'none', zIndex:'999', overflow:'hidden'
  });
  document.body.appendChild(popLayer);

  const css = document.createElement('style');
  css.textContent = `
@keyframes mpFloat{
  0%  {transform:translate(-50%,-50%) scale(0.2) rotate(-10deg);opacity:0}
  20% {transform:translate(-50%,-60%) scale(1.25) rotate(5deg);opacity:1}
  65% {transform:translate(-50%,-80%) scale(1.05) rotate(-2deg);opacity:1}
  100%{transform:translate(-50%,-120%) scale(0.75) rotate(4deg);opacity:0}
}
@keyframes mpCombo{
  0%  {transform:translate(-50%,-50%) scale(0.1) rotate(-12deg);opacity:0}
  22% {transform:translate(-50%,-56%) scale(1.4) rotate(6deg);opacity:1}
  60% {transform:translate(-50%,-70%) scale(1.05) rotate(-2deg);opacity:1}
  100%{transform:translate(-50%,-115%) scale(0.7) rotate(5deg);opacity:0}
}
@keyframes mpDot{
  0%  {transform:translate(0,0) scale(1);opacity:1}
  100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}
}
@keyframes mpStar{
  0%  {transform:translate(0,0) scale(1) rotate(0deg);opacity:1}
  100%{transform:translate(var(--dx),var(--dy)) scale(0) rotate(var(--rot));opacity:0}
}
.mp-word{position:fixed;pointer-events:none;font-family:'Inter','Segoe UI',sans-serif;font-weight:900;letter-spacing:-1px;white-space:nowrap;animation:mpFloat 0.9s cubic-bezier(0.22,1,0.36,1) forwards}
.mp-combo{position:fixed;pointer-events:none;font-family:'Inter','Segoe UI',sans-serif;font-weight:900;letter-spacing:-2px;white-space:nowrap;animation:mpCombo 1.15s cubic-bezier(0.22,1,0.36,1) forwards}
.mp-dot{position:fixed;border-radius:50%;pointer-events:none;animation:mpDot var(--pd) ease-out forwards}
.mp-star{position:fixed;pointer-events:none;animation:mpStar var(--pd) ease-out forwards;font-size:var(--sz)}
`;
  document.head.appendChild(css);
}

function rndDotColor(){ return DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)]; }

function spawnConfetti(x, y, n){
  ensureLayer();
  const count = 6 + n * 3;
  const shapes = ['●','▪','▸','◆','▲'];
  for(let i = 0; i < count; i++){
    const angle = Math.random() * Math.PI * 2;
    const dist  = 20 + Math.random() * 45;
    const sz    = (9 + Math.random() * 8).toFixed(0) + 'px';
    const pd    = (0.4 + Math.random() * 0.35).toFixed(2) + 's';
    const rot   = (Math.random() * 540 - 270).toFixed(0) + 'deg';
    const c     = document.createElement('div');
    c.className = 'mp-star';
    c.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    c.style.cssText = `left:${x}px;top:${y}px;color:${rndDotColor()};--dx:${(Math.cos(angle)*dist).toFixed(1)}px;--dy:${(Math.sin(angle)*dist).toFixed(1)}px;--pd:${pd};--rot:${rot};--sz:${sz}`;
    popLayer.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

function spawnDots(x, y, count, spread){
  ensureLayer();
  for(let i = 0; i < count; i++){
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist  = spread * (0.5 + Math.random() * 0.8);
    const sz    = (5 + Math.random() * 7).toFixed(1);
    const pd    = (0.35 + Math.random() * 0.35).toFixed(2) + 's';
    const d     = document.createElement('div');
    d.className = 'mp-dot';
    d.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${rndDotColor()};--dx:${(Math.cos(angle)*dist).toFixed(1)}px;--dy:${(Math.sin(angle)*dist).toFixed(1)}px;--pd:${pd}`;
    popLayer.appendChild(d);
    d.addEventListener('animationend', () => d.remove());
  }
}

function spawnStars(x, y, count, spread){
  ensureLayer();
  const glyphs = ['★','✦','✸','◆','⬡'];
  for(let i = 0; i < count; i++){
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const dist  = spread * (0.6 + Math.random() * 0.9);
    const sz    = (13 + Math.random() * 10).toFixed(0) + 'px';
    const pd    = (0.45 + Math.random() * 0.45).toFixed(2) + 's';
    const rot   = (Math.random() * 360 - 180).toFixed(0) + 'deg';
    const s     = document.createElement('div');
    s.className = 'mp-star';
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.cssText = `left:${x}px;top:${y}px;color:${rndDotColor()};--dx:${(Math.cos(angle)*dist).toFixed(1)}px;--dy:${(Math.sin(angle)*dist).toFixed(1)}px;--pd:${pd};--rot:${rot};--sz:${sz}`;
    popLayer.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

function showWord(text, color, fontSize, x, y, isCombo){
  ensureLayer();
  const el = document.createElement('div');
  el.className = isCombo ? 'mp-combo' : 'mp-word';
  el.textContent = text;
  el.style.cssText = `left:${x}px;top:${y}px;font-size:${fontSize}px;color:${color};text-shadow:0 2px 8px rgba(0,0,0,0.25)`;
  popLayer.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function showMergePopup(type, x, y){
  if(type === 'super'){
    showWord('SUPER!', '#34C759', 36, x, y, false);
    spawnDots(x, y, 10, 70);
  } else {
    showWord('MEGA!', '#FF9500', 46, x, y, false);
    spawnDots(x, y, 18, 100);
  }
}

function showComboPopup(total, x, y){
  showWord('COMBO x' + total, '#FF2D55', 56, x, y, true);
  spawnDots(x, y, 22, 110);
  spawnStars(x, y, 10, 130);
}

// ─── GRID ─────────────────────────────────────────────────────────────────────

function axPx(q, r){
  return { x: CX + S * (1.5 * q), y: CY + S * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r) };
}
function hexPts(cx, cy, s){
  return Array.from({length:6}, (_,i) => {
    const a = Math.PI/180 * (60*i);
    return `${cx + s*Math.cos(a)},${cy + s*Math.sin(a)}`;
  }).join(' ');
}
function neighbors(q, r){
  return [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]].map(([dq,dr]) => `${q+dq},${r+dr}`);
}
function buildGrid(){
  const radius = 2; grid = {};
  for(let q = -radius; q <= radius; q++)
    for(let r = -radius; r <= radius; r++)
      if(Math.abs(q+r) <= radius) grid[`${q},${r}`] = 0;
}

function maxOnBoard(){
  return Object.values(grid).reduce((m,v) => v > m ? v : m, 1);
}

function randVal() {

  let n = minVal;

  while (Math.random() < 1/3) n++;
  return n;
}

function addTile(first){
  const allEmpty = Object.keys(grid).filter(k => grid[k] === 0);
  if(!allEmpty.length){ return; }
  const filled = Object.keys(grid).filter(k => grid[k] !== 0);
  let sc = [];
  if(filled.length > 0){
    for(const key of filled){
      const [q,r] = key.split(',').map(Number);
      for(const [nq,nr] of [[q+1,r],[q-1,r],[q,r+1],[q,r-1],[q+1,r-1],[q-1,r+1]]){
        const nk = `${nq},${nr}`;
        if(grid[nk] === 0) sc.push(nk);
      }
    }
    sc = [...new Set(sc)];
  }
  const target = sc.length > 0
    ? sc[Math.floor(Math.random() * sc.length)]
    : allEmpty[Math.floor(Math.random() * allEmpty.length)];
  grid[target] = randVal();
  render();
}

// ─── RENDER ───────────────────────────────────────────────────────────────────

function render(){
  const svg = document.getElementById('board');
  svg.innerHTML = '';
  Object.entries(grid).forEach(([key, val]) => {
    const [q,r] = key.split(',').map(Number);
    const {x,y} = axPx(q,r);
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.dataset.key = key;
    const isSel = selected.includes(key);
    const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points', hexPts(x,y,S-2));
    if(val === 0){
      poly.setAttribute('fill','#e9e9ec');
      poly.setAttribute('stroke','#d0d0d0');
      poly.setAttribute('stroke-width','1');
    } else {
      poly.setAttribute('fill', isSel ? lighten(COLORS[val]) : COLORS[val]);
      poly.setAttribute('stroke', isSel ? '#ffffff' : 'rgba(0,0,0,0.15)');
      poly.setAttribute('stroke-width', isSel ? '3' : '1');
      const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x',x); txt.setAttribute('y',y+6);
      txt.setAttribute('text-anchor','middle');
      txt.setAttribute('font-size', val >= 10 ? '13' : '17');
      txt.setAttribute('font-weight','600');
      txt.setAttribute('fill','#ffffff');
      txt.setAttribute('pointer-events','none');
      txt.textContent = val;
      g.appendChild(txt);
      if(isSel){
        const idx = selected.indexOf(key) + 1;
        const badge = document.createElementNS('http://www.w3.org/2000/svg','rect');
        badge.setAttribute('x', x+S*0.52-10); badge.setAttribute('y', y-S*0.52-10);
        badge.setAttribute('width',20); badge.setAttribute('height',20);
        badge.setAttribute('rx',6); badge.setAttribute('ry',6);
        badge.setAttribute('fill','#ffffff');
        badge.setAttribute('stroke','rgba(0,0,0,0.15)'); badge.setAttribute('stroke-width','1');
        badge.setAttribute('filter','drop-shadow(0px 1px 2px rgba(0,0,0,0.25))');
        badge.setAttribute('pointer-events','none');
        const dt = document.createElementNS('http://www.w3.org/2000/svg','text');
        dt.setAttribute('x', x+S*0.52); dt.setAttribute('y', y-S*0.52+5);
        dt.setAttribute('text-anchor','middle'); dt.setAttribute('font-size','12');
        dt.setAttribute('font-weight','600'); dt.setAttribute('font-family','Inter,Segoe UI,sans-serif');
        dt.setAttribute('fill', COLORS[val]); dt.setAttribute('pointer-events','none');
        dt.textContent = idx;
        g.appendChild(badge); g.appendChild(dt);
      }
    }
    g.insertBefore(poly, g.firstChild);
    svg.appendChild(g);
  });
}

function lighten(hex){
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)})`;
}

function formatNumber(num) {
  const suffixes = ["", "K", "M", "B", "T", "Qd", "Qi"];

  let tier = Math.floor(Math.log10(Math.abs(num)) / 3);

  if (tier <= 0) {
    // liczby < 1000 → zawsze 2 miejsca po przecinku
    return num.toFixed(2);
  }

  if (tier >= suffixes.length) tier = suffixes.length - 1;

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);

  const short = num / scale;

  // liczby z sufiksem → jedno miejsce po przecinku
  return short.toFixed(1) + suffix;
}




let passiveInterval = null;

function startPassiveIncome() {
  if (passiveInterval) return; // żeby nie tworzyć wielu timerów

  passiveInterval = setInterval(() => {
    let gain = 0;

    for (const key in grid) {
      const val = grid[key];
      gain += Math.pow(2, val - 1); // 2^(poziom-1)
    }
    gain = gain/100
    score += gain;
    document.getElementById('score').textContent = "$"+formatNumber(score)+" (+$"+formatNumber(gain)+"/s)";
  }, 1000);
}


function checkOver(){
  const hasMoves = Object.keys(grid).filter(k => grid[k] > 0).some(key => {
    const val = grid[key];
    const [q,r] = key.split(',').map(Number);
    return neighbors(q,r).some(nk => grid[nk] === val);
  });
  if(!hasMoves){
    return true;
  }
  return false;
}


// ─── INPUT ────────────────────────────────────────────────────────────────────

function keyAtPoint(px, py){
  let bestKey = null, bestD = S * 1.1;
  Object.keys(grid).forEach(key => {
    const [q,r] = key.split(',').map(Number);
    const {x,y} = axPx(q,r);
    const d = Math.hypot(px-x, py-y);
    if(d < bestD){ bestD = d; bestKey = key; }
  });
  return bestKey;
}
function getXY(e){
  const svg = document.getElementById('board');
  const rect = svg.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return { px: src.clientX - rect.left, py: src.clientY - rect.top };
}
function screenXY(e){
  const src = e.touches ? e.changedTouches[0] : e;
  return { sx: src.clientX, sy: src.clientY };
}

function onTap(e){
  e.preventDefault();
  const {px,py} = getXY(e);
  const key = keyAtPoint(px,py);
  if(!key || grid[key] === 0) return;
  if(selected.includes(key) && selected.length >= 2){
    const {sx,sy} = screenXY(e);
    merge(sx, sy); return;
  }
  if(selected.length === 0){ selected = [key]; render(); return; }
  const val = grid[key], chainVal = grid[selected[0]];
  if(val !== chainVal){ selected = [key]; render(); return; }
  const [q,r] = key.split(',').map(Number);
  if(!selected.some(s => neighbors(q,r).includes(s))){ selected = [key]; render(); return; }
  selected.push(key); render();
}

function startDrag(e){
  if(gameOver) return;
  e.preventDefault();
  const {px,py} = getXY(e);
  const key = keyAtPoint(px,py);
  if(!key || grid[key] === 0) return;
  dragging = true; selected = [key]; render();
}
function moveDrag(e){
  if(!dragging) return;
  e.preventDefault();
  const {px,py} = getXY(e);
  const key = keyAtPoint(px,py);
  if(!key || grid[key] === 0 || selected.includes(key)) return;
  if(grid[key] !== grid[selected[0]]) return;
  const [q,r] = key.split(',').map(Number);
  if(!selected.some(s => neighbors(q,r).includes(s))) return;
  selected.push(key); render();
}
function endDrag(e){
  if(!dragging) return;
  dragging = false;
  if(selected.length >= 2){
    const {sx,sy} = screenXY(e);
    merge(sx, sy);
  } else { selected = []; render(); }
}


function upgradeOldTiles(){
  const threshold = minVal;
  if(threshold < 1) return;
  Object.keys(grid).forEach(k => {
    if(grid[k] > 0 && grid[k] < threshold){
      grid[k] = threshold;
    }
  });
}


// ─── MERGE ────────────────────────────────────────────────────────────────────


function merge(sx, sy){
  const n   = selected.length;
  const val = grid[selected[0]];
  const newVal = val + Math.floor(Math.log2(n));

  // pozycja = środek ostatniego kafelka (zawsze, niezależnie od myszy)
  const lastKey = selected[selected.length-1];
  const [lq,lr] = lastKey.split(',').map(Number);
  const {x: lx, y: ly} = axPx(lq, lr);
  const boardRect = document.getElementById('board').getBoundingClientRect();
  const popX = boardRect.left + lx;
  const popY = boardRect.top  + ly;

  selected.forEach(k => { grid[k] = 0; });
  grid[lastKey] = newVal;



  const max = maxOnBoard();
  const offsetMax = Math.floor(max/5);
  const isMega  = ((n >= 8 || newVal > 7+offsetMax) || (n >= 4 && newVal > 5+offsetMax));
  const isSuper = !isMega && (n >= 4 || newVal > 5+offsetMax);

  if(isMega || isSuper){
    const type = isMega ? 'mega' : 'super';
    showMergePopup(type, popX, popY);
    comboStack.push(type);
    if(comboStack.length > 50) comboStack.shift();
    const total = comboTotal(comboStack);
    if(total >= 3){
      const cx = popX, cy = popY, ct = total;
      setTimeout(() => showComboPopup(ct, cx, cy - 30), 180);
    }
  } else {
    // połączenie < 4 - same konfetti, zeruj combo
    spawnConfetti(popX, popY, newVal);
    comboStack = [];
  }
  upgradeOldTiles();

  msg(`Połączono ${n}×${val} → ${newVal}`);
  for(let i = 0; i < (n-2); i++) addTile(true);
  addTile(false);
  selected = [];
  if (checkOver()){
    msg("Na planszy nie ma dostępnych ruchów. Spróbuj zamieszać lub ulepszyć.")
  }
  saveGame();
  render();
}

// ─── GAME STATE ───────────────────────────────────────────────────────────────

document.getElementById("popup-btn").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
  reset();
};
function showPopup(s){
  document.getElementById("popup-score").textContent = "Wynik: " + s;
  document.getElementById("popup").classList.remove("hidden");
}
function msg(t){ if(gameOver) return; document.getElementById('msg').textContent = t; }
function reset(){
  buildGrid(); selected = []; score = 0; gameOver = false; comboStack = [];
  for(let i = 0; i < 18; i++) addTile(true);
  addTile(false);
  msg('Przeciągnij po sąsiadujących kafelkach tej samej wartości.');
}

// --- SAVING

function saveGame() {
  const data = {
    grid: grid,
    score: score,
    minVal: minVal,
  };

  localStorage.setItem("hexfusion_save", JSON.stringify(data));
}


function loadGame() {
  const raw = localStorage.getItem("hexfusion_save");
  if (!raw) return false;

  const data = JSON.parse(raw);

  // przywracamy grid
  grid = {};
  for (const key in data.grid) {
    grid[key] = data.grid[key];
  }

  // przywracamy score
  score = data.score || 0;
  minVal = data.minVal || 1;

  // odśwież UI
    if (checkOver()){
    msg("Na planszy nie ma dostępnych ruchów. Spróbuj zamieszać lub ulepszyć.")
  }
  document.getElementById('score').textContent = "$"+formatNumber(score);
  document.getElementById('btn-upgrade-min-value').textContent = "Ulepsz "+minVal+" ⇒ "+(minVal+1)+" ($"+formatNumber(250*Math.pow(5, minVal-1))+")";
  document.getElementById('btn-shuffle').textContent = "Zamieszaj ($"+formatNumber(50*minVal)+")";

  render();

  return true;
}



function upgradeMinValue(){
  const price = 250*Math.pow(5, minVal-1)
  if (score >= price){
    score -= price;
    minVal += 1;
    document.getElementById('btn-upgrade-min-value').textContent = "Ulepsz "+minVal+" ⇒ "+(minVal+1)+" ($"+formatNumber(price*5)+")";
    document.getElementById('btn-shuffle').textContent = "Zamieszaj ($"+formatNumber(50*minVal)+")";
    if (checkOver()){
      msg("Na planszy nie ma dostępnych ruchów. Spróbuj zamieszać lub ulepszyć.")
    }else{
      msg("Przeciągnij po sąsiadujących kafelkach tej samej wartości.");
    }
    upgradeOldTiles();
    render();
    saveGame();
  }
}

function shuffleGrid() {
  const keys = Object.keys(grid);
  const values = Object.values(grid);

  // Fisher–Yates shuffle
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  // przypisujemy przetasowane wartości z powrotem
  for (let i = 0; i < keys.length; i++) {
    grid[keys[i]] = values[i];
  }
}



function shuffle(){
  const price = 50*minVal;
  if (score >= price){
    score -= price;

    shuffleGrid();

    document.getElementById('btn-shuffle').textContent = "Zamieszaj ($"+formatNumber(50*minVal)+")";
    if (checkOver()){
      msg("Na planszy nie ma dostępnych ruchów. Spróbuj zamieszać lub ulepszyć.")
    }else{
      msg("Przeciągnij po sąsiadujących kafelkach tej samej wartości.");
    }
    render();
    saveGame();
  }
}



function goToRunMode() {
  window.location.href = window.location.origin + "/";
}

startPassiveIncome();

// ─── EVENTS ───────────────────────────────────────────────────────────────────

const svg = document.getElementById('board');
const isTouch = matchMedia("(pointer: coarse)").matches;
if(!isTouch){
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', moveDrag);
  svg.addEventListener('mouseup',   endDrag);
  svg.addEventListener('mouseleave', endDrag);
} else {
  svg.addEventListener("touchstart", onTap, { passive: false });
}
document.getElementById('btn-upgrade-min-value').addEventListener('click', upgradeMinValue);
document.getElementById('btn-shuffle').addEventListener('click', shuffle);
document.getElementById('btn-run-mode').addEventListener('click', goToRunMode);
if (!loadGame()) {
  reset();
}
})();