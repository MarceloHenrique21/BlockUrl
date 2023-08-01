
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var urlAtual = tabs[0].url;
        var urlFim = 'https://www.kabum.com.br/';
        var urlOI = 'https://www.netflix.com/br/'
        console.log(urlAtual);
        console.log(urlFim);

        if (urlAtual === urlFim || urlAtual === urlOI) {
            chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL('pagina2.html') });

        } else {
            console.log('Não é igual');
        }
    });
});
