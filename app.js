// ========= Config =========
const AREAS = ["general","brand","content","email","events","growth","performance","product","seo","social"];
const WORKER_BASE = ""; // leave empty in visual test. Hook up later.
const SITE_BASE   = window.location.origin;

// ========= DOM helpers =========
const qs = s => document.querySelector(s);
const body = document.body;
const areaSel  = qs('#area');
const quoteEl  = qs('#quote');
const canvas   = qs('#exportCanvas');
const ctx      = canvas.getContext('2d');

// ========= State =========
const state = {
  data: [],
  pool: [],
  current: null,
  area: 'general',
  assets: {},
};

// ========= Init =========
(async function init(){
  populateAreas();
  bindUI();
  await preloadAssets();
  await loadAffirmations();
  const deepLinked = checkDeepLink();
  if (!deepLinked) {
    fromURL();
    filterByArea(state.area);
    nextAffirmation(true);
  }
})();

function populateAreas(){
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  areaSel.innerHTML = AREAS.map(a => `<option value="${a}">${capitalize(a)}</option>`).join("");
  areaSel.value = "general";
}

function bindUI(){
  areaSel.addEventListener('change', () => {
    state.area = areaSel.value;
    filterByArea(state.area);
    writeURL();
  });
  qs('#new').onclick = () => nextAffirmation(true);
  qs('#copy').onclick = () => copyCaption();
  qs('#share').onclick = () => shareImageOrCaption();
}


function checkDeepLink(){
  const path = location.pathname;
  const match = path.match(/\/a\/([A-Z0-9]+)/);
  if (!match) return false;
  
  const targetId = match[1];
  const found = state.data.find(x => x.id === targetId);
  
  if (found) {
    state.current = found;
    state.area = found.tags[0] || 'general';
    areaSel.value = state.area;
    fromURL();
    filterByArea(state.area);
    setQuote(found.text);
    return true;
  } else {
    showNotFound();
    return true;
  }
}

function showNotFound(){
  quoteEl.innerHTML = '<div style="text-align:center"><div style="font-size:48px;margin-bottom:12px">🤷</div><div>Affirmation not found</div></div>';
  setTimeout(() => {
    fromURL();
    filterByArea(state.area);
    nextAffirmation(true);
  }, 2000);
}

function fromURL(){
  const u = new URL(location.href);
  const area  = u.searchParams.get('area');
  if (area && AREAS.includes(area)) {
    state.area = area; areaSel.value = area;
  }
}

function writeURL(){
  const u = new URL(location.href);
  u.searchParams.set('area', state.area);
  history.replaceState({}, '', u);
}

// ========= Data =========
async function loadAffirmations(){
  try{
    const res = await fetch('/data/affirmations.json', { cache: 'no-store' });
    state.data = await res.json();
  }catch(e){
    state.data = [
      {"id":"A001","tags":["general"],"text":"If it moves, I will funnel it."},
      {"id":"A002","tags":["brand"],"text":"Our brand voice is \"please approve this by EOD\"."},
      {"id":"A003","tags":["performance"],"text":"Today I accept that CPA is a feeling."},
      {"id":"A004","tags":["social"],"text":"If it worked once on TikTok, it’s now a strategy."},
      {"id":"A005","tags":["growth"],"text":"Scale first, apologise in the retro we never book."}
    ];
  }
}

function filterByArea(area){
  state.pool = state.data.filter(x => (x.tags||[]).includes(area));
  if (!state.pool.length) state.pool = state.data.filter(x => (x.tags||[]).includes('general'));
}

function nextAffirmation(forceDifferent=false){
  if (!state.pool.length) return;
  let pick;
  for (let i=0;i<10;i++){
    pick = state.pool[Math.floor(Math.random()*state.pool.length)];
    if (!forceDifferent || !state.current || pick.id !== state.current.id) break;
  }
  state.current = pick;
  setQuote(pick.text);
}

function setQuote(text){
  const clean = (text||'').replace(/\s+/g,' ').trim();
  
  // Animate quote change if supported
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(2px)';
    
    setTimeout(() => {
      quoteEl.textContent = clean;
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 150);
  } else {
    quoteEl.textContent = clean;
  }
}

// ========= Caption =========
function caption(){
  const id = state.current?.id || 'A000';
  const quote = quoteEl.textContent;
  return `${quote}
from Marketer Affirmations
${SITE_BASE}/a/${id}`;
}

async function copyCaption(){
  try{
    await navigator.clipboard.writeText(caption());
    showToast('Caption copied');
  }catch(_){
    showToast('Copy failed');
  }
  postLog("copy");
}

// ========= Share / Download =========
async function shareImageOrCaption(){
  const blob = await renderCanvasToBlob();
  if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob],'affirmation.png',{type:'image/png'})] })) {
    try{
      await navigator.share({
        title: 'Marketer Affirmation',
        files: [new File([blob], 'affirmation.png', { type: 'image/png' })],
        text: caption()
      });
      postLog("shareimg");
      showToast('Shared');
      return;
    }catch(e){
      if (e.name !== 'AbortError') {
        await copyCaption();
      }
      return;
    }
  }
  await copyCaption();
}

// ========= Worker logging (no-op in visual test) =========
async function postLog(event){
  if (!WORKER_BASE) return;
  const id = state.current?.id || 'A000';
  try{
    await fetch(`${WORKER_BASE}/api/log`,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ event, id })
    });
  }catch(_){}
}

// ========= Assets / Canvas =========
async function preloadAssets(){
  const paths = {
    fallPattern: '/public/graphics/fall-pattern-02.png'
  };
  const load = src => new Promise(res => {
    const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null); img.src = src;
  });
  for (const [k, v] of Object.entries(paths)) {
    state.assets[k] = await load(v);
  }
}

async function renderCanvasToBlob(){
  const id = state.current?.id || 'A000';
  const text = quoteEl.textContent || '';

  ctx.clearRect(0,0,1080,1080);

  // Background: Black base
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0,0,1080,1080);
  
  // Fall pattern wallpaper
  if (state.assets.fallPattern) {
    ctx.globalAlpha = 0.35;
    drawCoverImage(state.assets.fallPattern, 1080, 1080);
    ctx.globalAlpha = 1;
  }
  
  // Dark vignette
  const vignette = ctx.createRadialGradient(540, 320, 200, 540, 540, 700);
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0,0,1080,1080);
  
  // Card background - warm ivory gradient
  const cardX = 90, cardY = 180, cardW = 900, cardH = 720;
  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGradient.addColorStop(0, '#fdfcfb');
  cardGradient.addColorStop(1, '#f7f4ef');
  
  // Card with rounded corners and shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 20;
  
  ctx.fillStyle = cardGradient;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  
  // Reset shadow for text
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // Text color
  ctx.fillStyle = '#1a3a2e';

  // Text rendering
  const padding = 140;
  const maxWidth = 1080 - padding*2;
  const maxHeight = 1080 - 400;

  const { fontSize, lines, lineHeight } = fitText(
    text, 
    '"Playfair Display","Cormorant Garamond",Georgia,serif', 
    maxWidth, 
    maxHeight, 
    68, 
    32
  );

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `500 ${fontSize}px "Playfair Display","Cormorant Garamond",Georgia,serif`;

  const totalH = lines.length * lineHeight;
  let y = (1080 / 2) - (totalH / 2) + 40;
  for (const ln of lines){
    ctx.fillText(ln, 540, y);
    y += lineHeight;
  }

  // Footer
  ctx.font = `24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillText('marketeraffirmations.com', 1020, 1020);

  return await new Promise(res => canvas.toBlob(res, 'image/png', 0.94));
}

function drawCoverImage(img, W, H){
  const iw = img.width, ih = img.height;
  const r = Math.max(W/iw, H/ih);
  const nw = iw * r, nh = ih * r;
  const nx = (W - nw)/2, ny = (H - nh)/2;
  ctx.drawImage(img, nx, ny, nw, nh);
}

function roundRect(context, x, y, width, height, radius){
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

// Fit text with binary search + word wrap
function fitText(text, fontFamily, maxWidth, maxHeight, maxPx, minPx){
  const words = text.split(/\s+/);
  let hi = maxPx, lo = minPx, best = { fontSize: minPx, lines: [text], lineHeight: minPx*1.16 };
  while (hi - lo > 1){
    const mid = Math.floor((hi + lo)/2);
    const lineHeight = Math.round(mid*1.16);
    const lines = wrapWords(words, `${mid}px ${fontFamily}`, maxWidth);
    const height = lines.length * lineHeight;
    if (height <= maxHeight){ // fits → try bigger
      best = { fontSize: mid, lines, lineHeight };
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return best;
}

function wrapWords(words, font, maxWidth){
  const lines = [];
  let line = '';
  ctx.font = font;
  for (const w of words){
    const test = line ? (line + ' ' + w) : w;
    if (ctx.measureText(test).width <= maxWidth){
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ========= Toast notifications =========
let toastTimeout;
function showToast(msg){
  let toast = qs('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;pointer-events:none;opacity:0;transition:opacity 0.2s;z-index:9999';
    document.body.appendChild(toast);
  }
  
  clearTimeout(toastTimeout);
  toast.textContent = msg;
  toast.style.opacity = '1';
  
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2000);
}
