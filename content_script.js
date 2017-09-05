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
    return split[0]+split[1]+split[2];
}

function addModalIfNotExist() {
    var modal = document.getElementById('myModal');
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

function addHistoryButtonIfNotExist() {

    var historyButton = document.getElementById("history_actions_toggle")
    if (historyButton != null) {
        return;
    }

    var menuItems = document.getElementsByClassName("channel_title_info")[0];
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", chrome.extension.getURL("inject.html"), false);
    xmlHttp.send(null);

    var inject = document.createElement("div");
    inject.innerHTML = xmlHttp.responseText;
    menuItems.appendChild(inject);


    setTimeout(function () {
        document.getElementById("history_actions_toggle").onclick =function () {
            console.log("ssss");
            document.getElementById('myModal').style.display = "block";
            var divHistory = document.getElementById('historyContentDiv');
            var messages = JSON.parse(localStorage.getItem(getChannelId()));

            for (var key in messages) {
                var message = messages[key];
                var divMessage = document.createElement("div");
                divMessage.innerHTML = "<b>"+message.userName+"</b> <sup>"+message.timestamp+"</sup> <br/>"+message.messageText;
                divHistory.appendChild(divMessage);
            }

        };

        document.getElementsByClassName("close")[0].onclick = function(){
            console.log("dup");
            document.getElementById('myModal').style.display = "none";
            while (divHistory.hasChildNodes()) {
                divHistory.removeChild(divHistory.lastChild);
            }


           //
           // message.innerHTML =

        };
    },1000);

}