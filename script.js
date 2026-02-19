// script.js

// 1. Clock Logic
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// 2. Window Logic
function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('hidden');
    
    // Optional: Bring to front logic would go here (z-index)
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('hidden');
}

// 3. Theme Switcher Logic
function changeTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'teal') {
        root.style.setProperty('--bg-color', '#008080'); // Teal
    } else if (theme === 'dark') {
        root.style.setProperty('--bg-color', '#2b2b2b'); // Dark Gray
    } else if (theme === 'pink') {
        root.style.setProperty('--bg-color', '#ff71ce'); // Pink
    }
}
