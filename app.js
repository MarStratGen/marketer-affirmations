/* Marketer Affirmations — fixes (2025-10-06g+++) FINAL
   - bg-1920.webp forced across Share/Download
   - Dropdown no longer changes quote or label
   - 'Filed under' label now changes only when 'Affirm Me' is clicked
*/

(() => {
  const AREAS = ["general","agency","brand","content","email","events","growth","performance","product","seo","social"];
  const UI_LABELS = {
    general:"General", agency:"Agency", brand:"Brand", content:"Content", email:"Email/CRM",
    events:"Events", growth:"Growth", performance:"Performance", product:"Product", seo:"SEO", social:"Social"
  };

  const PILL_NAMES = {
    general:"General Marketing",
    agency:"Agency",
    brand:"Brand",
    content:"Content",
    email:"Email / CRM",
    events:"Events",
    growth:"Growth",
    performance:"Performance",
    product:"Product",
    seo:"SEO",
    social:"Social"
  };

  const AFFIRMATIONS = {
    general: [
      "I accept the dashboard’s truth, even when it refreshes into a new one.",
      "I protect the plan from vibes that arrive after the deadline.",
      "I trust the brief that started as a question and ended as a spreadsheet."
    ],
    agency: [
      "I maintain the timeline while the scope explores its feelings.",
      "I honour the budget that returned with new friends."
    ],
    brand: [
      "I protect the tone from urgent adjectives.",
      "I accept the brand book as a living document and a warning."
    ],
    content: [
      "I trust the draft saved message the same way I trust a politician’s wave.",
      "I welcome feedback that arrives after publishing."
    ],
    email: [
      "I forgive the list that grew on its own and none of it converts.",
      "I accept the preview text that renders like a ransom note."
    ],
    events: [
      "I maintain the run sheet while the venue discovers gravity.",
      "I believe the badge printer will find peace."
    ],
    growth: [
      "I surrender to the experiment that disproves the last ten.",
      "I accept that ‘scale’ means today."
    ],
    performance: [
      "I welcome the CPC that fell because everything else did.",
      "I protect the naming convention from creativity."
    ],
    product: [
      "I accept the launch date that learned to walk.",
      "I maintain the deck that sells a feature we renamed."
    ],
    seo: [
      "I surrender to algorithm updates that retroactively punish yesterday’s best practices.",
      "I accept the sitemap as a suggestion."
    ],
    social: [
      "I protect the content calendar from vibes-based requests.",
      "I believe the next post will be the one that doesn’t need to be deleted."
    ]
  };

  const el = {
    dropdownBtn: document.getElementById("dropdownButton"),
    dropdownMenu: document.getElementById("dropdownMenu"),
    dropdownValue: document.getElementById("dropdownValue"),
    newBtn:       document.getElementById("new"),
    pill:         document.getElementById("areaPill"),
    quote:        document.getElementById("affirmation-text"),
    copy:         document.getElementById("copy"),
    share:        document.getElementById("share"),
    download:     document.getElementById("download"),
    toast:        document.getElementById("toast"),
    sticker:      document.getElementById("cardSticker"),
    canvas:       document.getElementById("exportCanvas"),
    loadError:    document.getElementById("loadError")
  };

  let currentArea = "general";
  let currentText = "Loading…";
  let lastIndex = -1;

  // NEW: support canonical /a/:area/:id path (backward compatible)
  function readPermalinkFromPath() {
    const m = location.pathname.match(/^\/a\/([^\/]+)\/([0-9a-z]{8})$/i);
    if (!m) return false;
    const [, area] = m;
    if (AREAS.includes(area)) currentArea = area;
    return true;
  }
  readPermalinkFromPath(); // run BEFORE query parsing

  const params = new URLSearchParams(location.search);
  const areaParam = params.get("area");
  if (areaParam && AREAS.includes(areaParam)) currentArea = areaParam;

  const CLICK_KEY = "ma_clicks_v1";
  let clickCount = parseInt(localStorage.getItem(CLICK_KEY) || "0", 10) || 0;

  const LABELS = [
    { t: 500, text: "Pull The Plug" },
    { t: 450, text: "Call Legal" },
    { t: 400, text: "Call HR" },
    { t: 350, text: "Call IT" },
    { t: 300, text: "Spin Up Backups" },
    { t: 250, text: "Elevate Privileges" },
    { t: 200, text: "Patch Everything" },
    { t: 150, text: "Send a Manager" },
    { t: 100, text: "Send Budget" },
    { t:  50, text: "Help Me" },
  ];

  function currentLabelFor(count) {
    for (const item of LABELS) {
      if (count >= item.t) return item.text;
    }
    return "Affirm Me";
  }

  const showToast = (msg) => {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    setTimeout(()=> el.toast.classList.remove("show"), 1400);
  };

  const updateAffirmLabel = () => {
    el.newBtn.textContent = currentLabelFor(clickCount);
  };

  const setQuote = (txt) => {
    currentText = txt;
    el.quote.textContent = txt;
    el.pill.textContent = `Filed under: ${PILL_NAMES[currentArea] || "General Marketing"}`;
  };

  const pickDifferentIndex = (len) => {
    if (len <= 1) return 0;
    let i = Math.floor(Math.random()*len);
    if (i === lastIndex) i = (i + 1 + Math.floor(Math.random()*(len-1))) % len;
    return i;
  };

  const nextAffirmation = () => {
    const pool = AFFIRMATIONS[currentArea] && AFFIRMATIONS[currentArea].length
      ? AFFIRMATIONS[currentArea]
      : AFFIRMATIONS.general;
    const idx = pickDifferentIndex(pool.length);
    lastIndex = idx;
    return pool[idx];
  };

  const shortId = (str) => {
    let h = 5381;
    for (let i=0;i<str.length;i++) h = ((h<<5)+h) ^ str.charCodeAt(i);
    const b36 = (h >>> 0).toString(36);
    return b36.padStart(8,"0").slice(-8);
  };

  // NEW: canonical permalink uses path, not query
  const buildPermalink = () => {
    const id = shortId(`${currentArea}|${currentText}`);
    return `${location.origin}/a/${encodeURIComponent(currentArea)}/${id}`;
  };

  function buildDropdown() {
    el.dropdownMenu.innerHTML = "";
    AREAS.forEach((key) => {
      const li = document.createElement("li");
      li.role = "option";
      li.dataset.value = key;
      li.textContent = UI_LABELS[key] || key;
      if (key === currentArea) li.setAttribute("aria-selected","true");
      el.dropdownMenu.appendChild(li);
    });
    el.dropdownValue.textContent = UI_LABELS[currentArea] || "General";
  }

  function toggleDropdown(forceOpen) {
    const isOpen = el.dropdownMenu.classList.contains("open");
    const next = typeof forceOpen === "boolean" ? forceOpen : !isOpen;
    el.dropdownMenu.classList.toggle("open", next);
    el.dropdownBtn.setAttribute("aria-expanded", String(next));
  }

  function handleDropdownClick(e) {
    const item = e.target.closest("li[role='option']");
    if (!item) return;
    const val = item.dataset.value;
    if (!val || !AREAS.includes(val)) return;
    currentArea = val;
    lastIndex = -1;
    [...el.dropdownMenu.children].forEach(c => c.removeAttribute("aria-selected"));
    item.setAttribute("aria-selected","true");
    el.dropdownValue.textContent = UI_LABELS[val] || val;

    // NEW: update path-based permalink without changing the quote
    const id = shortId(`${currentArea}|${currentText}`);
    history.replaceState(null, "", `/a/${encodeURIComponent(currentArea)}/${id}`);

    toggleDropdown(false); // Quote and pill label stay the same
  }

  function initFirstQuote() {
    setQuote(nextAffirmation());
    updateAffirmLabel();
  }

  async function copyText() {
    try {
      const permalink = buildPermalink();
      const payload = `"${currentText}" -Marketer Affirmations (${permalink})`;
      await navigator.clipboard.writeText(payload);
      const original = el.copy.textContent;
      el.copy.textContent = "Copied";
      el.copy.classList.add("copy-okay");
      setTimeout(()=>{ el.copy.textContent = original; el.copy.classList.remove("copy-okay"); }, 900);
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  }

  const BG_IMG_1920 = "/public/graphics/bg-1920.webp"; // Forced background

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y,   x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x,   y+h, rr);
    ctx.arcTo(x,   y+h, x,   y,   rr);
    ctx.arcTo(x,   y,   x+w, y,   rr);
    ctx.closePath();
  }

  async function ensureFonts() {
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.all([
          document.fonts.ready,
          document.fonts.load("italic 28px 'Playfair Display'"),
          document.fonts.load("52px 'Playfair Display'"),
          document.fonts.load("22px Inter")
        ]);
      }
    } catch {}
  }

  function drawVignette(ctx, W, H) {
    ctx.save();
    ctx.translate(W * 0.50, H * 0.42);
    ctx.scale(0.70, 1.05);
    const R = Math.max(W, H) * 2.6;
    const g = ctx.createRadialGradient(0,0,0, 0,0, R);
    g.addColorStop(0.00, "rgba(20,13,14,0.38)");
    g.addColorStop(0.45, "rgba(20,13,14,0.64)");
    g.addColorStop(1.00, "rgba(20,13,14,0.90)");
    ctx.fillStyle = g;
    ctx.fillRect(-W * 3, -H * 3, W * 6, H * 6);
    ctx.restore();
  }

  function loadImage(src) {
    return new Promise((resolve,reject)=>{
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = src;
    });
  }

  async function renderPNGToCanvas() {
    await ensureFonts();
    const canvas = el.canvas;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // ✅ Fill base with dark charcoal like the site background
    ctx.fillStyle = "#0f1212";
    ctx.fillRect(0, 0, W, H);

    try {
      const bg = await loadImage(BG_IMG_1920);
      const ratio = Math.max(W / bg.width, H / bg.height);
      const bw = bg.width * ratio, bh = bg.height * ratio;
      ctx.drawImage(bg, (W - bw) / 2, (H - bh) / 2, bw, bh);
    } catch {
      ctx.fillStyle = "#111315";
      ctx.fillRect(0, 0, W, H);
    }

    drawVignette(ctx, W, H);

    const M = 90;
    const cardX = M, cardY = M, cardW = W - M * 2, cardH = H - M * 2;
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    try {
      const img = await loadImage(el.sticker.src);
      ctx.globalAlpha = 0.45;
      const sw = 260, sh = (img.height / img.width) * sw;
      ctx.drawImage(img, cardX + cardW - sw - 34, cardY + cardH - sh - 34, sw, sh);
    } catch {}
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#201a15";
    ctx.globalAlpha = 0.78;
    ctx.font = "italic 28px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`Filed under: ${PILL_NAMES[currentArea]}`, cardX + cardW / 2, cardY + 70);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#141516";
    ctx.font = "52px 'Playfair Display', serif";
    ctx.textAlign = "center";
    const quoteMaxWidth = Math.min(860, cardW - 140);
    const quoteY = cardY + cardH / 2 - 40;
    wrapText(ctx, currentText, cardX + cardW / 2, quoteY, quoteMaxWidth, 64);

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#000";
    ctx.font = "22px Inter, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("marketeraffirmations.com", cardX + cardW / 2, cardY + cardH - 30);
    ctx.globalAlpha = 1;
  }

  async function exportPNGBlob() {
    await renderPNGToCanvas();
    return await new Promise(res => el.canvas.toBlob(res, "image/png"));
  }

  async function download() {
    const blob = await exportPNGBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "affirmation.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    // (Optional) later: trackEvent('download');
  }

  async function share() {
    try {
      const blob = await exportPNGBlob();
      const file = new File([blob], "affirmation.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Marketer Affirmations",
          text: currentText,
          files: [file],
          url: buildPermalink()
        });
        // (Optional) later: trackEvent('share');
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        // (Optional) later: trackEvent('share');
      }
    } catch {
      showToast("Share failed");
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let yy = y;
    ctx.textBaseline = "middle";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, yy);
        line = words[n] + " ";
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, yy);
  }

  buildDropdown();
  initFirstQuote();

  el.newBtn.addEventListener("click", () => {
    clickCount += 1;
    localStorage.setItem(CLICK_KEY, String(clickCount));
    updateAffirmLabel();
    setQuote(nextAffirmation());
    // (Optional) later: history.replaceState(null, "", `/a/${encodeURIComponent(currentArea)}/${shortId(`${currentArea}|${currentText}`)}`);
  });

  el.dropdownBtn.addEventListener("click", () => toggleDropdown());
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) toggleDropdown(false);
  });
  el.dropdownMenu.addEventListener("click", handleDropdownClick);

  el.copy.addEventListener("click", copyText);
  el.share.addEventListener("click", share);
  el.download.addEventListener("click", download);

  window.addEventListener("error", () => {
    el.loadError.textContent = "Something broke while loading. Reload the page or try again.";
    el.loadError.classList.remove("hidden");
  });
})();
