const STATE = { items: [], current: null, selectedTag: 'general' };

const SAMPLE = [
  { id:'gen-3001', tags:['general'], text:"I will stop calling it ‘strategy’ when it’s clearly vibes." },
  { id:'soc-2002', tags:['social'], text:"Today I will repurpose a post I swore I’d never repurpose." },
  { id:'br-1103',  tags:['brand'], text:"Our brand voice is ‘please approve this by EOD.’" },
  { id:'perf-3104',tags:['performance'], text:"My ROAS is imaginary, but my targets are real." },
  { id:'email-501',tags:['email'], text:"Every subject line is a cry for help." },
  { id:'gr-4006', tags:['growth'], text:"If it moves, I will funnel it." }
];

init();

function init(){
  STATE.items = SAMPLE;
  const area = document.getElementById('area');
  area.onchange = ()=>{ STATE.selectedTag = area.value; pick(); };
  const theme = document.getElementById('theme');
  theme.onchange = ()=>{ document.body.className = theme.value; };
  document.getElementById('next').onclick =
  document.getElementById('shuffle').onclick = pick;
  document.getElementById('copy').onclick = copyCaption;
  document.getElementById('dl').onclick = downloadPng;
  document.getElementById('shareimg').onclick = shareImage;
  pick();
}

function pool(){
  const t = STATE.selectedTag || 'general';
  if (t === 'general') return STATE.items;
  return STATE.items.filter(a => a.tags.includes(t));
}

function pick(){
  const p = pool();
  if (!p.length) return;
  STATE.current = p[Math.floor(Math.random()*p.length)];
  document.getElementById('out').textContent = `“${STATE.current.text}”`;
  drawImage();
}

async function drawImage({w=1080,h=1080}={}){
  const c = document.getElementById('c'); c.width=w; c.height=h;
  const ctx = c.getContext('2d');
  const bgSrc = document.querySelector('.bg-img').getAttribute('src');
  const bg = await loadImage(bgSrc);
  ctx.drawImage(bg, 0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ctx.fillRect(0,0,w,h);
  const text = STATE.current?.text || '...';
  let fontSize = 56, maxWidth = Math.round(w*0.88), maxLines = 5, minSize=32;
  let lines;
  do {
    ctx.font = `700 ${fontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
    lines = wrap(ctx, text, maxWidth);
    if (lines.length>maxLines || lines.some(l=>ctx.measureText(l).width>maxWidth)) fontSize -= 2; else break;
  } while (fontSize>=minSize);
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#fff';
  ctx.font = `700 ${fontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  const lh = Math.round(fontSize*1.25);
  const total = lh*lines.length;
  let y = (h-total)/2 + lh/2;
  for (const line of lines){ ctx.fillText(line, w/2, y); y+=lh; }
  ctx.fillStyle='#e5e7eb';
  ctx.font = `500 ${Math.max(22, Math.round(fontSize*0.42))}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  ctx.textAlign='right'; ctx.fillText('marketeraffirmations.com', w-60, h-40);
}

function wrap(ctx, text, maxWidth){
  const words = text.split(/\s+/); let line='', out=[];
  for (const w of words){
    const test = line ? line+' '+w : w;
    if (ctx.measureText(test).width > maxWidth && line){ out.push(line); line = w; }
    else line = test;
  }
  if (line) out.push(line);
  return out;
}
function loadImage(src){ return new Promise((res,rej)=>{ const i=new Image(); i.crossOrigin='anonymous'; i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }

function caption(){
  const id = STATE.current?.id || 'gen';
  const url = location.origin + '/a/' + id;
  return `${STATE.current?.text}\n— from Marketer Affirmations\n${url}`;
}
async function copyCaption(){ await navigator.clipboard.writeText(caption()); setHint('Copied caption.'); }
function downloadPng(){ const link=document.createElement('a'); link.download=(STATE.current?.id||'affirmation')+'.png'; link.href=document.getElementById('c').toDataURL('image/png'); link.click(); }
async function shareImage(){
  const dataUrl = document.getElementById('c').toDataURL('image/png');
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], (STATE.current?.id||'affirmation')+'.png', { type: 'image/png' });
  const text = caption();
  if (navigator.canShare && navigator.canShare({ files:[file] })) {
    await navigator.share({ files:[file], text, title:'Marketer Affirmations' });
  } else if (navigator.share) {
    const id = STATE.current?.id || 'gen';
    await navigator.share({ title:'Marketer Affirmations', text: STATE.current?.text || '', url: location.origin + '/a/' + id });
  } else {
    await copyCaption();
  }
}
function setHint(t){ const el=document.getElementById('hint'); el.textContent=t; setTimeout(()=>el.textContent='', 1200); }
