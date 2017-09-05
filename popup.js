var list = ["1","2"];
chrome.storage.sync.get('chanelList', function (obj) {
    for (var prop in obj.chanelList) {
        var iDiv = document.createElement('div');
        iDiv.id = prop;
        iDiv.innerText = prop;
        var elementById = document.getElementById('aaron-family');
        elementById.appendChild(iDiv);
        iDiv.addEventListener('click', function (event) {

            var id = event.target.id;
            chrome.tabs.create({'url': chrome.extension.getURL('history.html?'+id)});
        });
        // elementById.innerHTML += '<li>' + prop + '</li>';
        console.log(prop);
    }
    console.log('myKey', obj);
});

