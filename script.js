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
dragElement(document.getElementById("projects"));
dragElement(document.getElementById("about"));
dragElement(document.getElementById("settings"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  // if present, the header is where you move the DIV from:
  if (elmnt.querySelector(".title-bar")) {
    elmnt.querySelector(".title-bar").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
