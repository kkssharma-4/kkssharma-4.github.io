/* ============================================================
   KKSSHARMA OS — script.js
   ============================================================ */

let zIndex = 1;
let soundEnabled = true;
const openWindows = {}; // track which windows are open

/* ===== AUDIO (Web Audio API — no files needed) ===== */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "open") {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "close") {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "error") {
      osc.type = "square";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "boot") {
      // Short ascending boot chime
      [262, 330, 392, 523].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.2);
      });
    }
  } catch (e) {}
}

function toggleSound(el) {
  soundEnabled = el.checked;
}

/* ===== BOOT SEQUENCE ===== */
window.addEventListener("load", () => {
  const bar = document.getElementById("bootBar");
  const hw = document.getElementById("boot-hw");
  const kern = document.getElementById("boot-kern");
  const gui = document.getElementById("boot-gui");

  let progress = 0;
  const interval = setInterval(() => {
    progress += 4;
    bar.style.width = Math.min(progress, 100) + "%";

    if (progress === 28) kern.textContent = "OK";
    if (progress === 72) gui.textContent = "OK";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById("bootScreen").style.display = "none";
        document.getElementById("winWarning").style.display = "flex";
      }, 400);
    }
  }, 40);
});

/* ===== WARNING ===== */
function startOS() {
  document.getElementById("winWarning").style.display = "none";
  document.getElementById("desktop").style.display = "flex";
  document.getElementById("taskbar").style.display = "flex";
  playSound("boot");
}

/* ===== CLOCK + DATE ===== */
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const full = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const clockEl = document.getElementById("clock");
  clockEl.innerHTML = `<span id="clock-time">${time}</span>&nbsp;&nbsp;<span id="clock-date">${date}</span>`;
  clockEl.dataset.full = full;
  const tooltip = document.getElementById("clock-tooltip");
  if (tooltip) tooltip.textContent = full;
}
updateClock();
setInterval(updateClock, 1000);

document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  const tooltip = document.getElementById("clock-tooltip");
  clock.addEventListener("mouseenter", () => tooltip.classList.add("visible"));
  clock.addEventListener("mouseleave", () => tooltip.classList.remove("visible"));
});

/* ===== WINDOWS ===== */
function openWindow(id) {
  const win = document.getElementById(id);
  win.classList.remove("hidden");
  win.style.zIndex = ++zIndex;
  openWindows[id] = true;

  if (!win.dataset.dragged) {
    const count = Object.keys(openWindows).filter(k => openWindows[k]).length;
    win.style.left = (80 + count * 22) + "px";
    win.style.top  = (60 + count * 22) + "px";
  }

  playSound("open");
  updateTaskbar();
}

function closeWindow(id) {
  document.getElementById(id).classList.add("hidden");
  openWindows[id] = false;
  playSound("close");
  updateTaskbar();
}

function minimizeWindow(id) {
  document.getElementById(id).classList.add("hidden");
  openWindows[id] = "minimized";
  updateTaskbar();
}

function restoreWindow(id) {
  const win = document.getElementById(id);
  win.classList.remove("hidden");
  win.style.zIndex = ++zIndex;
  openWindows[id] = true;
  updateTaskbar();
}

/* ===== TASKBAR WINDOW BUTTONS ===== */
const windowNames = {
  about: "About Me",
  projects: "Projects",
  skills: "Skills",
  terminal: "Terminal",
  contact: "Contact",
  settings: "Settings",
};

function updateTaskbar() {
  const bar = document.getElementById("taskbar-windows");
  bar.innerHTML = "";
  for (const [id, state] of Object.entries(openWindows)) {
    if (!state) continue;
    const btn = document.createElement("button");
    btn.className = "taskbar-win-btn" + (state === true ? " active" : "");
    btn.textContent = windowNames[id] || id;
    btn.onclick = () => {
      if (state === true) {
        minimizeWindow(id);
      } else {
        restoreWindow(id);
      }
    };
    bar.appendChild(btn);
  }
}

/* ===== DRAGGABLE WINDOWS ===== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".window").forEach(win => {
    const titleBar = win.querySelector(".title-bar");
    if (!titleBar) return;

    let isDragging = false, offsetX = 0, offsetY = 0;

    titleBar.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      win.style.zIndex = ++zIndex;
      offsetX = e.clientX - win.getBoundingClientRect().left;
      offsetY = e.clientY - win.getBoundingClientRect().top;
      titleBar.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      win.style.left = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - win.offsetWidth)) + "px";
      win.style.top  = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - win.offsetHeight - 40)) + "px";
      win.dataset.dragged = "true";
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) { isDragging = false; titleBar.style.cursor = "default"; }
    });

    win.addEventListener("mousedown", () => { win.style.zIndex = ++zIndex; });
  });
});

/* ===== RIGHT-CLICK CONTEXT MENU ===== */
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const menu = document.getElementById("ctxMenu");
  menu.style.left = Math.min(e.clientX, window.innerWidth - 180) + "px";
  menu.style.top  = Math.min(e.clientY, window.innerHeight - 150) + "px";
  menu.classList.remove("hidden");
});

document.addEventListener("click", hideCtx);

function hideCtx() {
  document.getElementById("ctxMenu").classList.add("hidden");
}

function refreshDesktop() {
  // Visual flash
  document.getElementById("desktop").style.opacity = "0";
  setTimeout(() => document.getElementById("desktop").style.opacity = "1", 200);
}

/* ===== START MENU ===== */
function toggleStart() {
  const menu = document.getElementById("startMenu");
  menu.classList.toggle("hidden");
  hideCtx();
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("#startMenu") && !e.target.closest("#startBtn")) {
    document.getElementById("startMenu").classList.add("hidden");
  }
});

/* ===== SETTINGS TABS ===== */
function switchTab(name, btn) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
  document.getElementById("tab-" + name).classList.remove("hidden");
  btn.classList.add("active");
}

/* ===== WALLPAPER ===== */
const wallpaperStyles = {
  "solid-teal":      { bg: "#008080", image: "none" },
  "solid-navy":      { bg: "#000080", image: "none" },
  "solid-dark":      { bg: "#222222", image: "none" },
  "solid-pink":      { bg: "#ff71ce", image: "none" },
  "pattern-dots":    { bg: "#1a1a2e", image: "radial-gradient(circle,#ffffff22 1px,transparent 1px)", size: "16px 16px" },
  "pattern-grid":    { bg: "#0d0d0d", image: "linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px)", size: "20px 20px" },
  "pattern-stripes": { bg: "none",    image: "repeating-linear-gradient(45deg,#003366,#003366 10px,#004488 10px,#004488 20px)" },
  "pattern-checker": { bg: "#333",    image: "linear-gradient(45deg,#555 25%,transparent 25%,transparent 75%,#555 75%),linear-gradient(45deg,#555 25%,transparent 25%,transparent 75%,#555 75%)", size: "16px 16px", pos: "0 0,8px 8px" },
  "gradient-sunset": { bg: "none",    image: "linear-gradient(135deg,#f093fb,#f5576c,#fda085)" },
  "gradient-ocean":  { bg: "none",    image: "linear-gradient(135deg,#0575e6,#021b79)" },
  "gradient-forest": { bg: "none",    image: "linear-gradient(135deg,#134e5e,#71b280)" },
  "gradient-space":  { bg: "none",    image: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" },
};

function applyWallpaper(el) {
  const s = wallpaperStyles[el.dataset.wp];
  if (!s) return;
  document.body.style.backgroundColor = s.bg !== "none" ? s.bg : "";
  document.body.style.backgroundImage = s.image !== "none" ? s.image : "none";
  document.body.style.backgroundSize = s.size || "auto";
  document.body.style.backgroundPosition = s.pos || "0 0";
  document.querySelectorAll(".wp-swatch").forEach(sw => sw.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("wp-preview-label").textContent = "Selected: " + el.title;
}

/* ===== WINDOW COLOUR ===== */
function changeWindowColor(color) {
  document.documentElement.style.setProperty("--title-color", color);
}

/* ===== TERMINAL ===== */
const termCommands = {
  help: `Available commands:
  whoami     — who am I?
  skills     — list my skills
  projects   — list my projects
  contact    — contact info
  date       — current date & time
  clear      — clear terminal
  ls         — list desktop apps
  hello      — say hello
  shutdown   — shut down the OS`,

  whoami: "Krishan Kant Sharma\nBSc Computer Science Student\nLearning AI, Web Dev & Cyber Security.",

  skills: `[ LANGUAGES ]   Python, JavaScript, HTML/CSS, C
[ WEB DEV ]     HTML5, CSS3, Vanilla JS
[ AI / ML ]     Prompt Engineering, ML basics
[ SECURITY ]    Networking, Linux, CTF beginner
[ TOOLS ]       Git, VS Code, Linux CLI`,

  projects: "📁 Retro OS Portfolio — this site!\n   More coming soon...",

  contact: "📧 kkssharma071@gmail.com\n🐙 github.com/kkssharma-4\n💼 https://www.linkedin.com/in/krishan-kant-sharma-3664792b5/",

  date: () => new Date().toString(),

  ls: "about/   projects/   skills.txt   terminal.exe   contact/   settings/",

  hello: "Hello! Welcome to KKSSHARMA OS. Type 'help' for commands.",

  clear: "__CLEAR__",

  shutdown: () => { setTimeout(shutDown, 500); return "Shutting down..."; },
};

function handleTermKey(e) {
  if (e.key !== "Enter") return;
  const input = document.getElementById("termInput");
  const cmd = input.value.trim().toLowerCase();
  input.value = "";

  const output = document.getElementById("term-output");
  const cmdLine = document.createElement("div");
  cmdLine.className = "term-line";
  cmdLine.innerHTML = `<span class="term-prompt-inline">C:\\KKSSHARMA&gt;</span> ${escHtml(cmd)}`;
  output.appendChild(cmdLine);

  if (!cmd) return;

  const handler = termCommands[cmd];
  if (!handler && cmd !== "") {
    const err = document.createElement("div");
    err.className = "term-line term-error";
    err.textContent = `'${cmd}' is not recognized. Type 'help'.`;
    output.appendChild(err);
    playSound("error");
  } else {
    const result = typeof handler === "function" ? handler() : handler;
    if (result === "__CLEAR__") {
      output.innerHTML = "";
    } else {
      const res = document.createElement("pre");
      res.className = "term-result";
      res.textContent = result;
      output.appendChild(res);
    }
  }

  // Scroll to bottom
  const body = document.querySelector("#terminal .terminal-body");
  body.scrollTop = body.scrollHeight;
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* ===== SHUT DOWN ===== */
function shutDown() {
  playSound("close");
  document.getElementById("startMenu").classList.add("hidden");
  document.getElementById("ctxMenu").classList.add("hidden");

  // Fade out
  document.body.style.transition = "opacity 0.6s";
  document.body.style.opacity = "0";

  setTimeout(() => {
    document.body.style.opacity = "1";
    document.body.style.background = "#000";
    document.body.style.backgroundImage = "none";
    document.getElementById("desktop").style.display = "none";
    document.getElementById("taskbar").style.display = "none";
    document.querySelectorAll(".window").forEach(w => w.classList.add("hidden"));
    document.getElementById("shutdownScreen").classList.remove("hidden");
  }, 700);
}
