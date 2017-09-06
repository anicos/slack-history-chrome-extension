if (window.location.hostname.endsWith('slack.com') && window.location.pathname.search("messages")==1) {
    main();
}

function main() {
    addHistoryButtonIfNotExist();
    addModalIfNotExist();
    initLocalStorageIfNotExist();
    extractAndSaveNewMessages();
}

function initLocalStorageIfNotExist() {
    if (!localStorage.getItem(getChannelId())) {
        localStorage.setItem(getChannelId(), JSON.stringify(new Object()));
    }
}
function extractAndSaveNewMessages() {
    var messages = JSON.parse(localStorage.getItem(getChannelId()));

    var tsMessageNodes = document.getElementsByTagName("ts-message");
    for (var i = 0; i < tsMessageNodes.length; i++) {
        var message = getMessage(tsMessageNodes[i]);
        messages[message.timestamp] = message;
    }

    localStorage.setItem(getChannelId(), JSON.stringify(messages));
}

function getMessage(tsMessage){
    var timestamp = tsMessage.getAttribute("data-ts");
    var userName = tsMessage.getElementsByClassName("message_sender")[0].textContent;
    var messageText=tsMessage.getElementsByClassName("message_body")[0].textContent;

    var message = new Object();
    message.userName = userName;
    message.messageText = messageText;
    message.timestamp = timestamp;
    return message;
}

function getChannelId() {
    var split = window.location.pathname.split("/");
    return "history_"+split[0]+split[1]+split[2];
}

function addModalIfNotExist() {
    var modal = document.getElementById('historyModal');
    if (modal != null) {
        return;
    }
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", chrome.extension.getURL("historyPopup.html"), false);
    xmlHttp.send(null);

    var inject = document.createElement("historyPopup");
    inject.innerHTML = xmlHttp.responseText;
    document.body.appendChild(inject);
}

function sortAndConvertToArray(messages) {
    var arrayMessages = [];

    for (var key in messages) {
        arrayMessages.push(messages[key])
    }


    arrayMessages.sort((function (a, b) {
        if (a.timestamp < b.timestamp)
            return -1;
        if (a.timestamp > b.timestamp)
            return 1;
        return 0;
    } ))
    return arrayMessages;
}
function getDivHistory() {
    var divHistory = document.getElementById('historyContentDiv');
    return divHistory;
}
function clearHistoryView() {
    var divHistory = getDivHistory();
    while (divHistory.hasChildNodes()) {
        divHistory.removeChild(divHistory.lastChild);
    }
}
function injectHistoryButton() {
    var menuItems = document.getElementsByClassName("channel_title_info")[0];
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", chrome.extension.getURL("inject.html"), false);
    xmlHttp.send(null);

    var inject = document.createElement("div");
    inject.innerHTML = xmlHttp.responseText;
    menuItems.appendChild(inject);
}
function addHistoryButtonIfNotExist() {

    var historyButton = document.getElementById("history_actions_toggle")
    if (historyButton != null) {
        return;
    }

    injectHistoryButton();


    setTimeout(function () {
        document.getElementById("history_actions_toggle").onclick =function () {
            rendererHistoryView();
            document.getElementById('historyModal').style.display = "block";
        };

        document.getElementsByClassName("close")[0].onclick = function(){
            document.getElementById('historyModal').style.display = "none";
        };
    },2000);
}

function rendererHistoryView() {
    clearHistoryView();
    var divHistory = getDivHistory();
    var messages = JSON.parse(localStorage.getItem(getChannelId()));
    var arrayMessages = sortAndConvertToArray(messages);

    for (var i in arrayMessages) {
        var message = arrayMessages[i];
        var divMessage = document.createElement("div");
        var date = timestampToDate(message.timestamp);
        divMessage.innerHTML = "<b>"+message.userName+"</b> <sup style='top: 0'>"+date+"</sup> <br/>"+"<div style='margin-top: 10px; margin-bottom: 10px;'>"+message.messageText+"</div>";
        divHistory.appendChild(divMessage);
    }
}

function timestampToDate(timestamp){
    var date = new Date(timestamp * 1000);
    return date.toGMTString();
}