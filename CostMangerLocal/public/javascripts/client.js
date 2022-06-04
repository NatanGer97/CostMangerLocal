console.log("Client Side Code Is Running");
const btnClickMe = document.getElementById('myButton');

btnClickMe.addEventListener('click',function(e)
{
    console.log('btn was clicked');
    fetch('/users/clicked',{method: "POST"})
    .then(function(response){
        if(response.ok)
        { 
            console.log(e);
            console.log("Clicked Was recorded");
            return;
        }
        throw new Error('Request failed.');
    })
    .catch(function(err){console.log(err);});
    
});