setInterval(myFunction, 2000);

function myFunction() {
    chrome.tabs.executeScript(null, {file: "content_script.js"});
}




