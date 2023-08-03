var bloqueado = true;
var urlsBloqueadas = [
  /^https:\/\/www\.youtube\.com\/.*/,
  /^https:\/\/www\.kabum\.com\.br\/.*/,
  /^https:\/\/www\.twitch\.tv\/.*/
];
var urlDesbloqueada = null;

// Verificar se já existe um estado de autenticação armazenado
chrome.storage.local.get(['autenticado', 'urlDesbloqueada'], function(data) {
  var estadoAutenticacao = data.autenticado;
  urlDesbloqueada = data.urlDesbloqueada;

  if (estadoAutenticacao && urlDesbloqueada) {
    // Se o usuário já está autenticado, atualize o estado de bloqueio com false
    bloqueado = false;
    // Redirecionar a guia atual para a URL desbloqueada
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabId = tabs[0].id;
      chrome.tabs.update(tabId, { url: urlDesbloqueada });
    });
  } else {
    // Se o usuário não está autenticado, manter o bloqueio
    bloqueado = true;
  }
});

chrome.runtime.onMessage.addListener(function(message) {
  if (message.autenticado === true) {
    bloqueado = false;
    urlDesbloqueada = message.url;

    // Armazena o estado de autenticação e a URL desbloqueada no chrome.storage.local
    chrome.storage.local.set({ autenticado: true, urlDesbloqueada: urlDesbloqueada });

    // Redirecionar a guia atual para a URL desbloqueada após a autenticação bem-sucedida
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabId = tabs[0].id;
      chrome.tabs.update(tabId, { url: urlDesbloqueada });
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (bloqueado) {
      for (var i = 0; i < urlsBloqueadas.length; i++) {
        if (urlsBloqueadas[i].test(details.url)) {
          // Redirecionar para a página de login
          chrome.windows.create({ url: 'login.html?url=' + details.url, type: 'popup', width: 400, height: 300 });
          return { cancel: true };
        }
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
