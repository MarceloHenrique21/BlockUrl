    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
        var urlAtual = tabs[0].url;
        var urlOI =  'https://www.youtube.com';

        console.log(urlAtual);
        console.log(urlOI);
     

        if (urlAtual == urlOI) {
            chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL('teste.html') });
        } else {
          console.log('erro')
        }
    });


//document.addEventListener('DOMContentLoaded', function () {});
