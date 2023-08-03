var paginaBloqueio = 'bloqueado.html';
var urlDesbloqueada = null;
var bloqueado = true;

chrome.runtime.onMessage.addListener(function(message) {
  if (message.autenticado === true) {
    // Armazena a URL desbloqueada após a autenticação
    urlDesbloqueada = message.url;
    bloqueado = false;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (bloqueado) {
      // Verifica se a URL solicitada é diferente da URL desbloqueada
      if (details.url !== urlDesbloqueada) {
        // Redirecionar para a página de login
        chrome.windows.create({ url: 'login.html', type: 'popup', width: 400, height: 300 });
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
