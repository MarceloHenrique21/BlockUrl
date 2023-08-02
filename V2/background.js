chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      var urlsBloqueadasRegex = [
        /^https:\/\/www\.google\.com\/.*/,
        /^https:\/\/www\.youtube\.com\/.*/,
        /^https:\/\/www\.kabum\.com\.br\/.*/,
        /^https:\/\/www\.twitch\.tv\/.*/
      ];
  
      for (var i = 0; i < urlsBloqueadasRegex.length; i++) {
        if (urlsBloqueadasRegex[i].test(details.url)) {
          // Redirecionar para teste.html
          chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('teste.html') });
  
          // Cancelar a solicitação original
          return { cancel: true };
        }
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
  