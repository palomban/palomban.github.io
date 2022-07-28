
// Global Variables
var cid = "UCiSoyHq3jZCPPoPAjHhqb3Q"; // YouTube Channel ID

// Function Description Here
function openform(){
    let formup = document.getElementById("formup");
    formup.classList.add("openform");

    let blurup = document.getElementById("formcontainer");
    blurup.style.visibility = "visible";
    blurup.style.backdropFilter = "blur(5px) opacity(1)";

    let myform = document.getElementById("subscribeform");
    myform.style.visibility = "visible";
}
// Function Description Here
function closeform(){
    let formup = document.getElementById("formup");
    formup.classList.remove("openform");

    let blurup = document.getElementById("formcontainer");
    blurup.style.visibility = "hidden";
    blurup.style.backdropFilter = "blur(0px) opacity(0)";

    let myform = document.getElementById("subscribeform");
    myform.style.visibility = "hidden";

    let mymessage = document.getElementById("thankyoumessage");
    mymessage.style.visibility = "hidden";
}
// Function Description Here
function thankyou(){
    let myform = document.getElementById("subscribeform");
    myform.style.visibility = "hidden";

    let mymessage = document.getElementById("thankyoumessage");
    mymessage.style.visibility = "visible";
}

// Load YouTube Videos and Titles (NOT YET WORKING)
var reqURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=");
function loadvideos() {
    // Load Video Titles
    var titles = document.getElementsByClassName('latestvideotitle');
    for (var i = 0, len = titles.length; i < len; i++) {
        $.getJSON(reqURL + cid,
            function(data) {
                var videoNumber = (titles[i].getAttribute('vnum') ? Number(titles[i].getAttribute('vnum')) : 0);
                console.log(videoNumber);
                var title = data.items[videoNumber].title;
                titles[i].insertAdjacentText('beforeend', title);
            }
        );
    }
    // Load Videos
    var iframes = document.getElementsByClassName('latestvideoembed');
    for (var i = 0, len = iframes.length; i < len; i++) {
        $.getJSON(reqURL + cid,
            function(data) {
                var videoNumber = (iframes[i].getAttribute('vnum') ? Number(iframes[i].getAttribute('vnum')) : 0);
                console.log(videoNumber);
                var link =  data.items[videoNumber].link;
                id = link.substr(link.indexOf("=") + 1);
                iframes[i].setAttribute("src", "https://youtube.com/embed/" + id + "?controls=0&autoplay=1&modestbranding=1&rel=0");
            }
        );
    }
}