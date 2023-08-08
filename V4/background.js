var urlsBloqueadas = [
  /^https:\/\/www\.youtube\.com\/.*/,
  /^https:\/\/www\.kabum\.com\.br\/.*/,
  /^https:\/\/www\.twitch\.tv\/.*/
];

var guiasAutenticadas = JSON.parse(localStorage.getItem('guiasAutenticadas')) || {};

chrome.runtime.onMessage.addListener(function(message, sender) {
  if (message.autenticado === true) {
    var tabId = sender.tab.id;
    var urlDesbloqueada = message.url;

    console.log("Recebida mensagem de autenticação. Tab ID:", tabId);

    guiasAutenticadas[tabId] = {
      autenticado: true,
      urlDesbloqueada: urlDesbloqueada
    };

    localStorage.setItem('guiasAutenticadas', JSON.stringify(guiasAutenticadas));

    console.log("Estado de autenticação armazenado. Tab ID:", tabId);

    // Recarregue a guia para desbloquear a página
    chrome.tabs.update(tabId, { url: urlDesbloqueada }, function(updatedTab) {
      console.log("Guia recarregada para desbloquear. Tab ID:", tabId);
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var tabId = details.tabId;

    var guiaAutenticada = guiasAutenticadas[tabId];
    if (!guiaAutenticada || !guiaAutenticada.autenticado) {
      if (urlsBloqueadas.some(regex => regex.test(details.url))) {
        chrome.tabs.update(tabId, { url: 'autenticacao/autenticacao.html?url=' + details.url }, function(updatedTab) {
          console.log("Tela de autenticação aberta. Tab ID:", tabId);
        });
        
        console.log("Solicitação bloqueada. Tab ID:", tabId);
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.tabs.onRemoved.addListener(function(tabId) {
  delete guiasAutenticadas[tabId];
  localStorage.setItem('guiasAutenticadas', JSON.stringify(guiasAutenticadas));
});
