let z=1;

/* CLOCK */
setInterval(()=>{
document.getElementById("clock")
.innerText=new Date().toLocaleTimeString();
},1000);

/* BOOT */
window.onload=()=>{
setTimeout(()=>{
document.getElementById("bootScreen").style.display="none";
},2500);
};

/* WINDOWS */
function openWindow(id){
const w=document.getElementById(id);
w.classList.remove("hidden");
w.style.zIndex=++z;
}

function closeWindow(id){
document.getElementById(id).classList.add("hidden");
}

function minimizeWindow(id){
closeWindow(id);
}

/* THEME */
function changeTheme(t){
document.documentElement.style
.setProperty("--bg-color",
t==="dark"?"#222":
t==="pink"?"#ff71ce":"#008080");
}

/* START MENU */
document.querySelector(".start-btn")
.onclick=()=>{
document.getElementById("startMenu")
.classList.toggle("hidden");
};

/* RIGHT CLICK */
document.addEventListener("contextmenu",e=>{
e.preventDefault();
const m=document.getElementById("contextMenu");
m.style.top=e.pageY+"px";
m.style.left=e.pageX+"px";
m.classList.remove("hidden");
});

document.addEventListener("click",()=>{
contextMenu.classList.add("hidden");
});

/* ICON DRAG */
document.querySelectorAll(".icon")
.forEach(icon=>{
icon.onmousedown=function(e){
let shiftX=e.clientX-icon.getBoundingClientRect().left;
let shiftY=e.clientY-icon.getBoundingClientRect().top;

function moveAt(pageX,pageY){
icon.style.left=pageX-shiftX+"px";
icon.style.top=pageY-shiftY+"px";
}

function onMouseMove(e){
moveAt(e.pageX,e.pageY);
}

document.addEventListener("mousemove",onMouseMove);

icon.onmouseup=function(){
document.removeEventListener("mousemove",onMouseMove);
icon.onmouseup=null;
};
};
});
