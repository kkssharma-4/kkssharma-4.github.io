let zIndex = 1;

/* ===== WARNING ===== */
function startOS() {
  document.getElementById("winWarning").style.display = "none";
}

/* ===== CLOCK ===== */
setInterval(() => {
  document.getElementById("clock").innerText = new Date().toLocaleTimeString();
}, 1000);

/* ===== WINDOWS ===== */
function openWindow(id) {
  let win = document.getElementById(id);
  win.classList.remove("hidden");
  win.style.zIndex = ++zIndex;

  // Only set default position if not already dragged
  if (!win.dataset.dragged) {
    // Slight offset so multiple windows don't stack exactly
    let offset = (zIndex - 1) * 20;
    win.style.left = (120 + offset) + "px";
    win.style.top = (80 + offset) + "px";
  }
}

function closeWindow(id) {
  document.getElementById(id).classList.add("hidden");
}

function minimizeWindow(id) {
  closeWindow(id);
}

/* ===== DRAGGABLE WINDOWS ===== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".window").forEach(win => {
    const titleBar = win.querySelector(".title-bar");
    if (!titleBar) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener("mousedown", (e) => {
      // Don't drag if clicking the buttons
      if (e.target.tagName === "BUTTON") return;

      isDragging = true;
      win.style.zIndex = ++zIndex;

      // Calculate cursor offset relative to window's top-left
      offsetX = e.clientX - win.getBoundingClientRect().left;
      offsetY = e.clientY - win.getBoundingClientRect().top;

      titleBar.style.cursor = "grabbing";
      e.preventDefault(); // Prevent text selection while dragging
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      // Keep window within viewport bounds
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight - 40)); // 40 = taskbar height

      win.style.left = newLeft + "px";
      win.style.top = newTop + "px";
      win.dataset.dragged = "true";
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        titleBar.style.cursor = "default";
      }
    });

    // Bring window to front on click
    win.addEventListener("mousedown", () => {
      win.style.zIndex = ++zIndex;
    });
  });
});

/* ===== THEME ===== */
function changeTheme(theme) {
  if (theme === "dark")
    document.documentElement.style.setProperty("--bg-color", "#222");
  else if (theme === "pink")
    document.documentElement.style.setProperty("--bg-color", "#ff71ce");
  else
    document.documentElement.style.setProperty("--bg-color", "#008080");
}
