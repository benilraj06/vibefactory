/* ============ Vibe Factory ============ */
// Change this to your real inbox — the contact form opens a pre-filled email to it.
const CONTACT_EMAIL = "hello@vibefactory.dev";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#year").textContent = new Date().getFullYear();

/* ---------- Invert theme (remembered) ---------- */
const root = document.documentElement;
try { if (localStorage.getItem("vf-inverted") === "1") root.classList.add("inverted"); } catch (e) {}
const syncThemeColor = () =>
  $('meta[name="theme-color"]').setAttribute("content", root.classList.contains("inverted") ? "#ffffff" : "#000000");
syncThemeColor();
$("#invertBtn").addEventListener("click", () => {
  root.classList.toggle("inverted");
  syncThemeColor();
  try { localStorage.setItem("vf-inverted", root.classList.contains("inverted") ? "1" : "0"); } catch (e) {}
});

/* ---------- Difference cursor ---------- */
const cursor = $(".cursor");
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", (e) => {
    cursor.classList.toggle("big", !!e.target.closest("a, button, .card, .hero-badge, input, textarea, select"));
  });
}

/* ---------- Magnetic buttons ---------- */
$$(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  });
  btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
});

/* ---------- Card spotlight origin ---------- */
$$(".card").forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(el); });

/* ---------- Scramble words in hero ---------- */
const scrambleEl = $(".scramble");
const words = scrambleEl.dataset.words.split("|");
const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
let wi = 0;
function scrambleTo(target) {
  const from = scrambleEl.textContent;
  const len = Math.max(from.length, target.length);
  const queue = Array.from({ length: len }, (_, i) => ({
    from: from[i] || "", to: target[i] || "",
    start: Math.floor(Math.random() * 14), end: 14 + Math.floor(Math.random() * 16),
  }));
  let frame = 0;
  (function tick() {
    let out = "", done = 0;
    for (const q of queue) {
      if (frame >= q.end) { done++; out += q.to; }
      else if (frame >= q.start) out += `<span class="glyph">${GLYPHS[Math.floor(Math.random() * GLYPHS.length)]}</span>`;
      else out += q.from;
    }
    scrambleEl.innerHTML = out;
    if (done < queue.length) { frame++; requestAnimationFrame(tick); }
  })();
}
if (!reduceMotion) setInterval(() => { wi = (wi + 1) % words.length; scrambleTo(words[wi]); }, 2800);

/* =========================================================
   THE VIBE MACHINE — turns a sentence into a mock app
   ========================================================= */
const THEMES = [
  { keys: ["fit", "gym", "workout", "run", "coach", "health", "yoga", "step"], icon: "◆", metric: ["Today's streak", "12 days", 72],
    feats: [["⚡", "Quick workout", "7 min"], ["◎", "Streak tracker", "12d"], ["▲", "Progress charts", "+8%"], ["♥", "Heart-rate sync", "live"]] },
  { keys: ["recipe", "food", "cook", "meal", "kitchen", "diet", "eat"], icon: "●", metric: ["Meals planned", "5 / 7", 70],
    feats: [["◐", "Fridge scanner", "AI"], ["≡", "Smart grocery list", "12"], ["★", "Saved recipes", "48"], ["⏱", "Cook timer", "18m"]] },
  { keys: ["money", "expense", "split", "budget", "finance", "pay", "trip", "bill"], icon: "▲", metric: ["You're owed", "₹4,250", 58],
    feats: [["⇄", "Split a bill", "new"], ["◷", "Recent activity", "9"], ["◎", "Monthly budget", "64%"], ["✓", "Settle up", "2"]] },
  { keys: ["music", "practice", "song", "guitar", "piano", "beat", "sing"], icon: "♪", metric: ["Practised this week", "3h 20m", 80],
    feats: [["♩", "Metronome", "92bpm"], ["◴", "Session timer", "25m"], ["▤", "Song library", "31"], ["◉", "Record a take", "rec"]] },
  { keys: ["habit", "sleep", "calm", "mind", "meditat", "journal", "mood", "night"], icon: "☾", metric: ["Habits done", "4 / 5", 80],
    feats: [["☾", "Wind-down routine", "10pm"], ["✎", "Mood journal", "today"], ["◎", "Habit rings", "4/5"], ["≋", "Breathing timer", "4m"]] },
  { keys: ["learn", "study", "student", "school", "quiz", "class", "course", "lang"], icon: "✦", metric: ["Lessons complete", "18 / 24", 75],
    feats: [["▣", "Flashcards", "120"], ["?", "Daily quiz", "5q"], ["◷", "Focus mode", "25m"], ["▲", "Leaderboard", "#3"]] },
  { keys: ["shop", "store", "sell", "market", "order", "deliver", "cart"], icon: "■", metric: ["Orders today", "37", 62],
    feats: [["▦", "Product catalog", "214"], ["⌂", "Track delivery", "2"], ["♡", "Wishlist", "9"], ["✓", "One-tap checkout", "UPI"]] },
  { keys: ["travel", "trip", "map", "explore", "city", "hike", "tour"], icon: "◭", metric: ["Trip ready", "86%", 86],
    feats: [["◭", "Offline maps", "saved"], ["▤", "Itinerary", "4d"], ["✈", "Bookings", "3"], ["☀", "Weather", "28°"]] },
];
const FALLBACK = { icon: "✺", metric: ["Daily active vibe", "98%", 90],
  feats: [["✦", "Smart home feed", "new"], ["◎", "Personal dashboard", "live"], ["⚑", "Reminders", "3"], ["◐", "Dark / light mode", "auto"]] };
const SUFFIX = ["ly", "ify", "o", "io", "Hub", "Go", "Flow", "Mate", "Loop", "Nest"];
const STOP = new Set("a an the for of with and to my your app that in on at by from who is are which tracker finder".split(" "));

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function designApp(idea) {
  const lower = idea.toLowerCase();
  const theme = THEMES.find((t) => t.keys.some((k) => lower.includes(k))) || FALLBACK;
  const h = hash(lower);
  const words = lower.replace(/[^a-z\s]/g, "").split(/\s+/).filter((w) => w && !STOP.has(w));
  const base = (words.find((w) => w.length > 3) || words[0] || "vibe").slice(0, 7);
  const name = cap(base) + SUFFIX[h % SUFFIX.length];
  return { name, theme, tagline: cap(idea.trim()) };
}

const log = $("#buildLog");
const phoneScreen = $("#phoneScreen");
let building = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

async function typeLine(html, cls = "") {
  const line = document.createElement("div");
  if (cls) line.className = cls;
  log.appendChild(line);
  const caret = '<span class="caret"></span>';
  // type plain text char by char, then swap in final html
  const plain = html.replace(/<[^>]+>/g, "");
  for (let i = 1; i <= plain.length; i += 2) {
    line.innerHTML = esc(plain.slice(0, i)) + caret;
    log.scrollTop = log.scrollHeight;
    await sleep(12);
  }
  line.innerHTML = html;
  log.scrollTop = log.scrollHeight;
}

function renderApp({ name, theme, tagline }) {
  const [label, value, pct] = theme.metric;
  phoneScreen.innerHTML = `
    <div class="phone-status"><span>9:41</span><span>▮▮▮ ◔</span></div>
    <div class="app">
      <div class="app-head">
        <div class="app-icon">${theme.icon}</div>
        <div><div class="app-name">${esc(name)}</div><div class="app-tag">${esc(tagline.slice(0, 38))}</div></div>
      </div>
      <div class="app-hero">
        <small>${label}</small>
        <strong>${value}</strong>
        <div class="app-bar"><i style="width:${pct}%"></i></div>
      </div>
      <ul class="app-list">
        ${theme.feats.map(([ic, t, m], i) => `<li style="animation-delay:${0.15 + i * 0.1}s"><span>${ic}</span>${t}<em>${m}</em></li>`).join("")}
      </ul>
      <nav class="app-nav"><span>⌂</span><span>◎</span><span>＋</span><span>☰</span></nav>
    </div>`;
}

async function build(idea) {
  if (building || !idea.trim()) return;
  building = true;
  const app = designApp(idea);
  const phone = $("#phone");
  log.innerHTML = "";
  phone.classList.remove("building"); void phone.offsetWidth; phone.classList.add("building");

  await typeLine(`<span class="dim">$</span> vibe build "${esc(idea.trim())}"`);
  await sleep(250);
  await typeLine(`<span class="dim">→</span> reading the vibe…`);
  await sleep(300);
  await typeLine(`<span class="dim">→</span> naming it: <span class="ok">${esc(app.name)}</span>`);
  await typeLine(`<span class="dim">→</span> sketching 4 screens, 1 design system`);
  await sleep(250);
  for (const [, f] of app.theme.feats) await typeLine(`  <span class="dim">+</span> ${f}`);
  await typeLine(`<span class="dim">→</span> compiling android  <span class="dim">[████████████]</span> done`);
  await typeLine(`<span class="dim">→</span> generating service worker + manifest  done`);
  await sleep(200);
  renderApp(app);
  await typeLine(`<span class="ok">✓ ${esc(app.name)} is live on Android &amp; the web.</span>`);
  await typeLine(`<span class="dim">want the real thing? scroll to #contact ↓</span>`);
  building = false;
}

$("#vibeForm").addEventListener("submit", (e) => { e.preventDefault(); build($("#vibeInput").value); });
$$("#chips button").forEach((b) => b.addEventListener("click", () => { $("#vibeInput").value = b.textContent; build(b.textContent); }));

/* ---------- Contact → pre-filled email ---------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = `New vibe: ${f.get("type")} — ${f.get("name")}`;
  const body = `Name: ${f.get("name")}\nEmail: ${f.get("email")}\nProject: ${f.get("type")}\n\n${f.get("message")}`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

/* ---------- This site is a PWA ---------- */
if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
let deferredPrompt;
const installBtn = $("#installBtn");
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; installBtn.hidden = false; });
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null; installBtn.hidden = true;
});
