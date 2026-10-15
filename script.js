/* ===== Settings ===== */
const SERVER_HOST = "138.2.92.246";
const SERVER_PORT = 25566;
const SERVER_NAME = "Plub & Friend Survival Server";
const REFRESH_SECONDS = 30;
/* ==================== */

const ADDRESS = SERVER_HOST + ":" + SERVER_PORT;
const $ = id => document.getElementById(id);
let currentList = [];

/* ---------- Procedural pixel art ---------- */
function mulberry(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;

function drawScene(night) {
  const c = $("sky"), g = c.getContext("2d");
  const W = c.width, H = c.height, rnd = mulberry(11);
  const px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };

  // sky in visible steps
  const top = night ? [8, 12, 38] : [78, 164, 232];
  const bot = night ? [44, 70, 128] : [208, 240, 253];
  const bands = 16;
  for (let i = 0; i < bands; i++) {
    px(0, Math.floor(i * 6), W, 7, rgb(lerp(top, bot, i / (bands - 1))));
  }
  px(0, bands * 6, W, H, rgb(bot));

  if (night) {
    for (let i = 0; i < 80; i++) {
      const a = (0.35 + rnd() * 0.65).toFixed(2);
      px(Math.floor(rnd() * W), Math.floor(rnd() * 72), 1, 1, `rgba(255,255,255,${a})`);
    }
    px(240, 10, 24, 24, "rgba(220,230,255,.12)");
    px(246, 14, 12, 12, "#e9edf7");
    px(249, 18, 2, 2, "#c3cadb"); px(253, 21, 3, 2, "#c3cadb"); px(248, 22, 2, 2, "#d3d9e8");
  } else {
    px(238, 8, 28, 28, "rgba(255,240,150,.22)");
    px(244, 14, 16, 16, "#fff3a6");
    px(246, 16, 12, 12, "#ffd83a");
  }

  // hills
  const far = night ? "#15234a" : "#86b9ae";
  const mid = night ? "#0f2038" : "#58a04c";
  for (let x = 0; x < W; x++) {
    const yf = Math.round(66 + Math.sin(x / 29) * 7 + Math.sin(x / 11 + 1) * 3);
    px(x, yf, 1, H - yf, far);
    const ym = Math.round(77 + Math.sin(x / 19 + 2) * 5 + Math.sin(x / 7) * 1.5);
    px(x, ym, 1, H - ym, mid);
  }

  // ground
  const gy = x => 90 + Math.round(Math.sin(x / 17) * 2 + Math.sin(x / 6));
  const grass = night ? ["#2c5a2a", "#27502a", "#33652f"] : ["#6bbf42", "#5fae3a", "#7acc4f"];
  const dirt = night ? [60, 42, 28] : [124, 86, 52];
  for (let x = 0; x < W; x++) {
    const y0 = gy(x);
    px(x, y0, 1, 2, grass[Math.floor(rnd() * 3)]);
    for (let y = y0 + 2; y < H; y++) {
      const d = Math.floor((rnd() - 0.5) * 26);
      let col = rgb([dirt[0] + d, dirt[1] + d, dirt[2] + d]);
      if (rnd() < 0.025) col = night ? "#3d3f46" : "#8e9096";
      px(x, y, 1, 1, col);
    }
  }

  // trees
  const leafCols = night ? ["#143a1c", "#1b4a24", "#10331a"] : ["#2e7d32", "#3a8f3a", "#276b2b"];
  const leaves = (x0, y0, w, h) => {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      px(x0 + x, y0 + y, 1, 1, leafCols[Math.floor(rnd() * 3)]);
    }
  };
  [26, 74, 138, 196, 292].forEach(base => {
    const x = base + Math.floor(rnd() * 8);
    const y = gy(x);
    px(x, y - 8, 2, 8, night ? "#3b2713" : "#5d3b1e");
    leaves(x - 3, y - 13, 8, 4);
    leaves(x - 2, y - 17, 6, 4);
    leaves(x - 1, y - 19, 4, 2);
  });
}

function cloudImg(seed) {
  const rnd = mulberry(seed);
  const c = document.createElement("canvas");
  c.width = 22; c.height = 9;
  const g = c.getContext("2d");
  const body = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  body(2, 4, 18, 4, "#ffffff");
  body(5, 2, 7 + Math.floor(rnd() * 3), 3, "#ffffff");
  body(11, 1, 6, 4, "#ffffff");
  body(2, 7, 18, 1, "#dcebf6");
  return c.toDataURL();
}

function dirtTile() {
  const c = document.createElement("canvas");
  c.width = c.height = 16;
  const g = c.getContext("2d");
  const rnd = mulberry(5);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const d = Math.floor((rnd() - 0.5) * 22);
    g.fillStyle = `rgb(${78 + d},${54 + d},${32 + d})`;
    g.fillRect(x, y, 1, 1);
    if (rnd() < 0.03) { g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(x, y, 1, 1); }
  }
  return c.toDataURL();
}

function grassBlock() {
  const c = document.createElement("canvas");
  c.width = c.height = 16;
  const g = c.getContext("2d");
  const rnd = mulberry(3);
  const j = (v, s) => Math.max(0, Math.min(255, v + Math.floor((rnd() - .5) * s)));
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const topSide = y < 5 || (y < 7 && rnd() < .45);
    const r = topSide ? [92, 160, 56] : [134, 96, 58];
    g.fillStyle = `rgb(${j(r[0], 34)},${j(r[1], 34)},${j(r[2], 34)})`;
    g.fillRect(x, y, 1, 1);
  }
  return c.toDataURL();
}

/* ---------- Setup ---------- */
document.body.style.backgroundImage = `url(${dirtTile()})`;
$("icon").src = grassBlock();
$("title").textContent = SERVER_NAME;
document.title = SERVER_NAME + " - Status";
$("address").textContent = ADDRESS;
drawScene(false);

[{ top: "14%", w: 170, dur: 110, delay: -20, seed: 1 },
 { top: "30%", w: 120, dur: 150, delay: -90, seed: 2 },
 { top: "8%",  w: 140, dur: 190, delay: -150, seed: 3 }].forEach(o => {
  const img = document.createElement("img");
  img.className = "cloud";
  img.alt = "";
  img.src = cloudImg(o.seed);
  img.style.cssText = `top:${o.top};width:${o.w}px;animation-duration:${o.dur}s;animation-delay:${o.delay}s`;
  $("clouds").append(img);
});

const BAR_SLOTS = 20;
for (let i = 0; i < BAR_SLOTS; i++) $("bar").append(document.createElement("span"));

$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(ADDRESS); $("copy").textContent = "Copied"; }
  catch { $("copy").textContent = "Press Ctrl+C"; }
  setTimeout(() => $("copy").textContent = "Copy address", 1600);
});

/* ---------- Data ---------- */
async function fetchStatus() {
  try {
    const r = await fetch(`https://api.mcsrvstat.us/3/${ADDRESS}`, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    return {
      online: !!d.online,
      motd: d.motd && d.motd.clean ? d.motd.clean.join("\n") : "",
      online_n: d.players ? d.players.online : 0,
      max_n: d.players ? d.players.max : 0,
      list: d.players && d.players.list ? d.players.list.map(p => p.name) : null,
      version: d.version || "",
      software: d.software || "",
      icon: d.icon || null
    };
  } catch (e1) {
    const r = await fetch(`https://api.mcstatus.io/v2/status/java/${ADDRESS}`, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    return {
      online: !!d.online,
      motd: d.motd ? d.motd.clean : "",
      online_n: d.players ? d.players.online : 0,
      max_n: d.players ? d.players.max : 0,
      list: d.players && d.players.list ? d.players.list.map(p => p.name_clean) : null,
      version: d.version ? d.version.name_clean : "",
      software: "",
      icon: d.icon || null
    };
  }
}

/* ---------- Rendering ---------- */
let sceneNight = false;
function setMode(online) {
  document.body.className = online ? "online" : "offline";
  const night = !online;
  if (night !== sceneNight) { sceneNight = night; drawScene(night); }
}

function drawPlayers() {
  const grid = $("players");
  const q = $("search").value.trim().toLowerCase();
  grid.textContent = "";
  currentList.filter(n => n.toLowerCase().includes(q)).forEach(name => {
    const el = document.createElement("div");
    el.className = "tile";
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = `https://mc-heads.net/avatar/${encodeURIComponent(name)}/128`;
    img.onerror = () => { img.onerror = null; img.src = "https://mc-heads.net/avatar/MHF_Steve/128"; };
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = name;
    tag.title = name;
    el.append(img, tag);
    grid.append(el);
  });
}
$("search").addEventListener("input", drawPlayers);

function setBar(filled) {
  [...$("bar").children].forEach((s, i) => s.classList.toggle("on", i < filled));
}

function render(s) {
  setMode(s.online);
  $("status").textContent = s.online ? "Online" : "Offline";
  $("motd").textContent = s.online ? (s.motd || SERVER_NAME) : "The server is not responding right now.";
  $("meta").textContent = s.online ? [s.version, s.software].filter(Boolean).join("  |  ") : "";
  if (s.icon) $("icon").src = s.icon;

  const pct = s.online && s.max_n ? Math.min(1, s.online_n / s.max_n) : 0;
  $("count").innerHTML = s.online ? `${s.online_n}<small>/${s.max_n}</small>` : "-";
  $("countLabel").textContent = s.online ? (s.online_n === 1 ? "player online" : "players online") : "offline";
  $("pct").textContent = s.online && s.max_n ? Math.round(pct * 100) + "% full" : "";
  setBar(s.online_n > 0 ? Math.max(1, Math.round(pct * BAR_SLOTS)) : 0);
  $("badge").textContent = s.online ? s.online_n : 0;

  const note = $("note");
  note.textContent = "";
  currentList = s.online && s.list ? s.list : [];
  $("search").hidden = currentList.length < 6;
  if (currentList.length < 6) $("search").value = "";
  drawPlayers();

  if (!s.online) note.textContent = "No players to show while the server is offline.";
  else if (s.online_n === 0) note.textContent = "Nobody is online right now. Be the first to join.";
  else if (!s.list || !s.list.length) note.textContent = `${s.online_n} online, but this server does not share player names.`;
  else if (s.list.length < s.online_n) note.textContent = `Showing ${s.list.length} of ${s.online_n} players. The server only shares part of the list.`;
}

function renderError() {
  setMode(false);
  $("status").textContent = "No data";
  $("motd").textContent = "Could not reach the status service. Check your connection and refresh.";
  $("meta").textContent = "";
  $("count").textContent = "-";
  $("pct").textContent = "";
  setBar(0);
  currentList = [];
  $("players").textContent = "";
  $("note").textContent = "";
}

function skeletons() {
  const grid = $("players");
  grid.textContent = "";
  for (let i = 0; i < 4; i++) { const s = document.createElement("div"); s.className = "skeleton"; grid.append(s); }
}

let remaining = REFRESH_SECONDS, busy = false, first = true;
async function update() {
  if (busy) return;
  busy = true;
  if (first) skeletons();
  try { render(await fetchStatus()); } catch (e) { renderError(); }
  first = false;
  $("updated").textContent = "Last checked: " + new Date().toLocaleTimeString();
  remaining = REFRESH_SECONDS;
  busy = false;
}

setInterval(() => {
  if (busy) return;
  remaining = Math.max(0, remaining - 1);
  $("next").textContent = `Refreshing in ${remaining}s`;
  if (remaining === 0) update();
}, 1000);

$("refresh").addEventListener("click", update);
update();
