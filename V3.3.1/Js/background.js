var urlsBloqueadas = [
  /^https:\/\/www\.kabum\.com\.br\/.*/,
  /^https:\/\/www\.twitch\.tv\/.*/
];

var urlsBloqueioTemporario = [
  {
    urlRegex: /^https:\/\/cartolol\.com\.br\/fantasy\//,
    startHour: 10,
    endHour: 13
  },
  {
    urlRegex: /^https:\/\/www\.nike\.com\.br\/.*/,
    startHour: 10,
    endHour: 16
  }
];

var atividadesSuspeitas = {};

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.autenticado === true) {
    var tabId = sender.tab.id;
    var urlDesbloqueada = message.url;

    var guiaAutenticada = {
      autenticado: true,
      urlDesbloqueada: urlDesbloqueada
    };

    var data = {};
    data[tabId.toString()] = guiaAutenticada;

    chrome.storage.sync.set(data, function () {
      chrome.tabs.update(tabId, { url: urlDesbloqueada });
    });
  } else if (message.tentativaSuspeita === true) {
    var tabId = sender.tab.id;
    var url = message.url;

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
      atividadesSuspeitas[tabId] = [];
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var tabId = details.tabId;
    var currentHour = new Date().getHours();
    var currentMinute = new Date().getMinutes();
    var currentTime = currentHour * 60 + currentMinute;

    if (urlsBloqueioTemporario.some(item => item.urlRegex.test(details.url))) {
      var blockedItem = urlsBloqueioTemporario.find(item => item.urlRegex.test(details.url));

      if (currentTime >= blockedItem.startHour * 60 && currentTime < blockedItem.endHour * 60) {
        chrome.tabs.update(tabId, {
          url: `html/BloqueioTemporario.html?url=${details.url}&targetHour=${blockedItem.endHour * 60}`,
        });

        return { cancel: true };
      }
    }

    chrome.storage.sync.get([tabId.toString()], function (result) {
      var guiaAutenticada = result[tabId];

      if (!guiaAutenticada || !guiaAutenticada.autenticado) {
        if (urlsBloqueadas.some(regex => regex.test(details.url))) {
          chrome.tabs.update(tabId, { url: 'html/autenticacao.html?url=' + details.url });
          return { cancel: true };
        }
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.tabs.onRemoved.addListener(function (tabId) {
  chrome.storage.sync.remove(tabId.toString());
});

function criarLogSuspeito(tabId) {
  var log = atividadesSuspeitas[tabId].map(function (atividade) {
    return {
      data: atividade.data,
      hora: atividade.hora,
      url: atividade.url
    };
  });

  chrome.storage.sync.get(['logs'], function (result) {
    var logs = result['logs'] || [];
    logs.push(log);
    chrome.storage.sync.set({ 'logs': logs });
  });
}

function captureAndStoreHistory() {
  chrome.history.search({ text: "", startTime: 0 }, function (historyItems) {
    const historyData = historyItems.map(function (item) {
      return {
        url: item.url,
        timestamp: item.lastVisitTime
      };
    });

    const historyJson = JSON.stringify(historyData);

    localStorage.setItem('historyJson', historyJson);
  });

  setTimeout(captureAndStoreHistory, 24 * 60 * 60 * 1000);
}

captureAndStoreHistory();
