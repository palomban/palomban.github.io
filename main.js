

// Function Description Here
function openform(){
    let formup = document.getElementById("formup");
    formup.classList.add("openform");
}
function closeform(){
    let formup = document.getElementById("formup");
    formup.classList.remove("openform");
}

function thankyou(){
    let myform = document.getElementById("subscribeform");
    myform.classList.add("completedform");
}