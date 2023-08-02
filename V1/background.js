chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      var urlDesejadaRegex = /^https:\/\/www\.google\.com\/.*/; // Expressão regular para bloquear a URL
  
      if (urlDesejadaRegex.test(details.url)) {
        // Redirecionar para teste.html
        chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('teste.html') });
  
        // Cancelar a solicitação original
        return { cancel: true };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
  