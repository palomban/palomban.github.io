// Global Constants
const cid = "UCiSoyHq3jZCPPoPAjHhqb3Q"; // YouTube Channel ID

// Function Description Here
function openForm(){
    const formUp = document.getElementById("formup");
    const formContainer = document.getElementById("formcontainer");
    const subscribeForm = document.getElementById("subscribeform");
    if (formUp && formContainer && subscribeForm) {
        formUp.classList.add("openform");
        formContainer.style.visibility = "visible";
        formContainer.style.backdropFilter = "blur(5px) opacity(1)";
        subscribeForm.style.visibility = "visible";
    } else {
        console.error("One or more form elements not found");
    }
}
// Function Description Here
function closeForm(){
    const formUp = document.getElementById("formup");
    const formContainer = document.getElementById("formcontainer");
    const subscribeForm = document.getElementById("subscribeform");
    const thankYouMessage = document.getElementById("thankyoumessage");
    if (formUp && formContainer && subscribeForm && thankYouMessage) {
        formUp.classList.remove("openform");
        formContainer.style.visibility = "hidden";
        formContainer.style.backdropFilter = "blur(0px) opacity(0)";
        subscribeForm.style.visibility = "hidden";
        thankYouMessage.style.visibility = "hidden";
    } else {
        console.error("One or more form elements not found");
    }
}
// Function Description Here
function thankYou(){
    const subscribeForm = document.getElementById("subscribeform");
    const thankYouMessage = document.getElementById("thankyoumessage");
    if (subscribeForm && thankYouMessage) {
        subscribeForm.style.visibility = "hidden";
        thankYouMessage.style.visibility = "visible";
    } else {
        console.error("One or more form elements not found");
    }
}

// Load YouTube Videos
function loadVideos(){
    const reqURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=");
    const videoTitles = document.querySelectorAll('.latestvideotitle');
    const videoEmbeds = document.querySelectorAll('.latestvideoembed');
    fetch(`${reqURL}${cid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (!data.items || data.items.length === 0) {
                throw new Error("No video data found");
            }
            videoTitles.forEach(title => {
                const videoNumber = parseInt(title.getAttribute("vnum") || 0, 10);
                if (videoNumber >= 0 && videoNumber < data.items.length) {
                    title.textContent = data.items[videoNumber].title;
                } else {
                    console.error(`Invalid video number: ${videoNumber}`);
                }
            });
            videoEmbeds.forEach(iframe => {
                const videoNumber = parseInt(iframe.getAttribute("vnum") || 0, 10);
                if (videoNumber >= 0 && videoNumber < data.items.length) {
                    const link = data.items[videoNumber].link;
                    const id = link.split("=")[1];
                    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?controls=1&autoplay=0&modestbranding=1&rel=0`;
                } else {
                    console.error(`Invalid video number: ${videoNumber}`);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching video data:", error);
        });
}

// Copy URL to clipboard
function copyURL(){
    if (navigator.clipboard) {
        // Modern clipboard API (requires HTTPS in most browsers)
        navigator.clipboard.writeText(window.location.href)
            .then(function() {
                alert('URL copied to clipboard!');
            })
            .catch(function(err) {
                console.error('Could not copy text: ', err);
                alert('Failed to copy URL.');
            });
    } else {
        // Fallback for older browsers
        var tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px'; // Move off-screen to hide it
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('URL copied to clipboard!');
    }
}

// Open share links
document.addEventListener('DOMContentLoaded', function() {
    const shareLinks = document.querySelectorAll('.share');
    shareLinks.forEach(function(shareLink) {
        shareLink.addEventListener('click', function(event) {
            event.preventDefault();
            const baseUrl = this.href;
            const separator = baseUrl.includes('facebook') ? '?u=' : '?url=';
            const currentUrl = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this article by Nicholas F. Palomba!');
            const shareUrl = `${baseUrl}${separator}${currentUrl}&text=${text}`;
            window.open(shareUrl, '_blank');
        });
    });
});

// Function to check if a font is available on the user's system
function isFontAvailable(fontName, fallback) {
    const testString = "abcdefghijklmnopqrstuvwxyz0123456789";
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.left = "-9999px"; // Hide the element off-screen
    span.style.fontSize = "72px"; // Large font size for measurable differences
    span.style.fontFamily = `${fontName}, ${fallback}`;
    span.textContent = testString;
    document.body.appendChild(span);
    const width1 = span.offsetWidth; // Width with desired font + fallback
    span.style.fontFamily = fallback;
    const width2 = span.offsetWidth; // Width with only fallback
    document.body.removeChild(span);
    return width1 !== width2; // Different widths mean the font is available
}

// Function to load fonts conditionally
function loadFonts() {
    const fontsToCheck = [
        { name: "Liberation Sans", fallback: "sans-serif" },
        { name: "Liberation Serif", fallback: "serif" },
        { name: "Liberation Mono", fallback: "monospace" }
    ];
    // Check if any font is not available
    const anyMissing = fontsToCheck.some(font => !isFontAvailable(font.name, font.fallback));
    if (anyMissing) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Liberation+Sans&family=Liberation+Serif&family=Liberation+Mono&display=swap";
        document.head.appendChild(link);
    }
}

// Load fonts after the page has fully loaded
window.addEventListener("load", loadFonts);

// Load and display a list of articles from the manifest
function listArticles(initialCount) {
    const ARTICLES_PER_LOAD = 10;
    let currentIndex = 0;
    let articles = [];
    const articlesList = document.getElementById('articles-list');
    const loadMoreBtn = document.getElementById('load-more');

    // Fetch the manifest
    fetch('articles/manifest.json')
        .then(response => response.json())
        .then(data => {
            articles = data;
            displayArticles(initialCount);
        })
        .catch(error => console.error('Error fetching manifest:', error));

    // Display a set number of articles from the current index
    function displayArticles(count) {
        const end = Math.min(currentIndex + count, articles.length);
        for (let i = currentIndex; i < end; i++) {
            const article = articles[i];
            const listItem = document.createElement('li');
            const heading = document.createElement('h3');
            const anchor = document.createElement('a');
            anchor.href = article.url;
            anchor.textContent = article.title;
            heading.appendChild(anchor);
            listItem.appendChild(heading);
            const bylineP = document.createElement('p');
            bylineP.textContent = `by ${article.author} on ${article.publishedDate}`;
            listItem.appendChild(bylineP);
            const excerptP = document.createElement('p');
            excerptP.textContent = article.excerpt;
            listItem.appendChild(excerptP);
            articlesList.appendChild(listItem);
        }
        currentIndex = end;
        if (currentIndex >= articles.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Hook up the Load More button
    loadMoreBtn.addEventListener('click', () => displayArticles(ARTICLES_PER_LOAD));
}
