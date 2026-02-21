let zIndex=1;

/* WARNING */
function startOS(){
document.getElementById("winWarning").style.display="none";
}

/* CLOCK */
setInterval(()=>{
document.getElementById("clock")
.innerText=new Date().toLocaleTimeString();
},1000);

/* WINDOWS */
function openWindow(id){
let win=document.getElementById(id);
win.classList.remove("hidden");
win.style.zIndex=++zIndex;
}

function closeWindow(id){
document.getElementById(id).classList.add("hidden");
}

function minimizeWindow(id){
closeWindow(id);
}

/* THEME */
function changeTheme(theme){

if(theme==="dark")
document.documentElement.style
.setProperty("--bg-color","#222");

else if(theme==="pink")
document.documentElement.style
.setProperty("--bg-color","#ff71ce");

else
document.documentElement.style
.setProperty("--bg-color","#008080");
}
