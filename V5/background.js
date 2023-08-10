var urlsBloqueadas = [
  /^https:\/\/www\.youtube\.com\/.*/,
  /^https:\/\/www\.kabum\.com\.br\/.*/,
  /^https:\/\/www\.twitch\.tv\/.*/
];

var atividadesSuspeitas = {};

chrome.runtime.onMessage.addListener(function(message, sender) {
  if (message.autenticado === true) {
    var tabId = sender.tab.id;
    var urlDesbloqueada = message.url;

    console.log("Recebida mensagem de autenticação. Tab ID:", tabId);

    var guiaAutenticada = {
      autenticado: true,
      urlDesbloqueada: urlDesbloqueada
    };

    var data = {};
    data[tabId.toString()] = guiaAutenticada;

    // Armazene as informações de autenticação no chrome.storage
    chrome.storage.sync.set(data, function() {
      console.log("Estado de autenticação armazenado. Tab ID:", tabId);

      // Recarregue a guia para desbloquear a página
      chrome.tabs.update(tabId, { url: urlDesbloqueada }, function(updatedTab) {
        console.log("Guia recarregada para desbloquear. Tab ID:", tabId);
      });
    });
  } else if (message.tentativaSuspeita === true) {
    var tabId = sender.tab.id;
    var url = message.url;

    console.log("Tentativa de acesso suspeita detectada. Tab ID:", tabId);

    if (!atividadesSuspeitas[tabId]) {
      atividadesSuspeitas[tabId] = [];
    }

    var dataHora = new Date();
    var atividade = {
      data: dataHora.toLocaleDateString(),
      hora: dataHora.toLocaleTimeString(),
      url: url
    };

    atividadesSuspeitas[tabId].push(atividade);

    if (atividadesSuspeitas[tabId].length >= 3) {
      criarLogSuspeito(tabId);
      atividadesSuspeitas[tabId] = []; // Limpa o histórico após criar o log
    }
  }
});

function criarLogSuspeito(tabId) {
  var log = atividadesSuspeitas[tabId].map(function(atividade) {
    return {
      data: atividade.data,
      hora: atividade.hora,
      url: atividade.url
    };
  });

  console.log("Log de atividades suspeitas:", log);

  // Armazenar o log em um JSON usando chrome.storage.sync
  chrome.storage.sync.get(['logs'], function(result) {
    var logs = result['logs'] || [];
    logs.push(log);
    chrome.storage.sync.set({ 'logs': logs }, function() {
      console.log("Log armazenado em JSON:", logs);
    });
  });

  // Se você quiser enviar o log para um servidor, faça isso aqui
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var tabId = details.tabId;

    chrome.storage.sync.get([tabId.toString()], function(result) {
      var guiaAutenticada = result[tabId];

      if (!guiaAutenticada || !guiaAutenticada.autenticado) {
        if (urlsBloqueadas.some(regex => regex.test(details.url))) {
          chrome.tabs.update(tabId, { url: 'autenticacao/autenticacao.html?url=' + details.url }, function(updatedTab) {
            console.log("Tela de autenticação aberta. Tab ID:", tabId);
          });

          console.log("Solicitação bloqueada. Tab ID:", tabId);
          return { cancel: true };
        }
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.storage.sync.remove(tabId.toString(), function() {
    console.log("Dados removidos. Tab ID:", tabId);
  });
});
