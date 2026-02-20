let z=1;

/* WARNING CLOSE */
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
let w=document.getElementById(id);
w.classList.remove("hidden");
w.style.zIndex=++z;
}

function closeWindow(id){
document.getElementById(id)
.classList.add("hidden");
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
