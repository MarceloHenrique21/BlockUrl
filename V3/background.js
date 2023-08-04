var bloqueado = true;
var urlsBloqueadas = [
  /^https:\/\/www\.youtube\.com\/.*/,
  /^https:\/\/www\.kabum\.com\.br\/.*/,
  /^https:\/\/www\.twitch\.tv\/.*/,
];
var urlDesbloqueada = null;

// Verificar se já existe um estado de autenticação armazenado
chrome.storage.local.get(['autenticado', 'urlDesbloqueada'], function(data) {
  var estadoAutenticacao = data.autenticado;
  urlDesbloqueada = data.urlDesbloqueada;

  if (estadoAutenticacao && urlDesbloqueada) {
    // Se o usuário já está autenticado, atualize o estado de bloqueio com false
    bloqueado = false;
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
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (bloqueado) {
      for (var i = 0; i < urlsBloqueadas.length; i++) {
        if (urlsBloqueadas[i].test(details.url)) {
          // Redirecionar para a página de login
          console.log("block")
          chrome.windows.create({ url: 'login/login.html?url=' + details.url, type: 'popup', width: 500, height: 700 });
          return { cancel: true };
         
        }
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);