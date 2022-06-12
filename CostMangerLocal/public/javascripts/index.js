console.log("index.js is running");
const buttonShow = document.getElementById('buttonShow');
const spanTime = document.getElementById('time').getElementsByTagName("span")[0];
// const spans = spanTime.getElementsByTagName("span")[0];
// const currentTime = spanTime.getElementById('currentTime');

let time = new Date().toLocaleTimeString();

setInterval(function(){
    
    spanTime.innerHTML = new Date().toLocaleTimeString();
},1000);


buttonShow.addEventListener('click',function(e)
{
    console.log(spans.innerText);
    
    buttonShow.innerHTML = "ok"
});

