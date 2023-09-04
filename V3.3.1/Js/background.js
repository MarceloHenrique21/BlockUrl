var urlsBloqueioPermanente = [
  {
    urlRegex: /^https:\/\/www\.kabum\.com\.br\/.*/,
    startHour: null,
    endHour: null
  },
  {
    urlRegex: /^https:\/\/www\.twitch\.tv\/.*/,
    startHour: null,
    endHour: null
  }
];

var urlsBloqueioTemporario = [
  {
    urlRegex: /^https:\/\/cartolol\.com\.br\/fantasy\//,
    startHour: 7,
    endHour: 13
  },
  {
    urlRegex: /^https:\/\/www\.nike\.com\.br\/.*/,
    startHour: 18,
    endHour: 23
  }
];

var atividadesSuspeitas = {};

// Função para atualizar o horário de Brasília
async function updateBrasiliaTime() {
  const storedBrasiliaTime = localStorage.getItem('brasiliaTime');
  if (storedBrasiliaTime) {
    brasiliaTime = new Date(storedBrasiliaTime);
  }

  try {
    console.log("Fetching Brasília time...");
    const response = await fetch("http://worldtimeapi.org/api/timezone/America/Sao_Paulo");

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    brasiliaTime = new Date(data.utc_datetime);
    console.log("Brasília time updated:", brasiliaTime);
    localStorage.setItem('brasiliaTime', brasiliaTime.toString()); // Armazena localmente
  } catch (error) {
    console.error("Error updating Brasília time:", error);
  }
}

// Inicializa o horário de Brasília e agendamento de atualizações periódicas
var brasiliaTime = new Date();
updateBrasiliaTime();
setInterval(updateBrasiliaTime, 24 * 60 * 60 * 1000); // Atualiza a cada 24 horas

// Função para obter o horário de Brasília
function getBrasiliaTime() {
  return brasiliaTime;
}

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.type === "brasiliaTime") {
    brasiliaTime = new Date(message.brasiliaTime);
    console.log("Received Brasília time from content script:", brasiliaTime);
  } else if (message.autenticado === true) {
    var tabId = sender.tab.id;
    var urlDesbloqueada = message.url;

    var guiaAutenticada = {
      autenticado: true,
      urlDesbloqueada: urlDesbloqueada
    };

    var data = {};
    data[tabId.toString()] = guiaAutenticada;

    chrome.storage.sync.set(data, function () {
      console.log("Tab authenticated:", tabId);
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
      console.log("Creating suspicious log for tab:", tabId);
      criarLogSuspeito(tabId);
      atividadesSuspeitas[tabId] = [];
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var tabId = details.tabId;

    chrome.storage.sync.get([tabId.toString()], async function (result) {
      var guiaAutenticada = result[tabId];

      if (!guiaAutenticada || !guiaAutenticada.autenticado) {
        const currentHour = getBrasiliaTime().getHours();
        const currentMinute = getBrasiliaTime().getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        if (urlsBloqueioTemporario.some(item => item.urlRegex.test(details.url))) {
          var blockedItem = urlsBloqueioTemporario.find(item => item.urlRegex.test(details.url));

          if (currentTime >= blockedItem.startHour * 60 && currentTime < blockedItem.endHour * 60) {
            console.log(`Blocking temporarily: ${details.url}`);
            chrome.tabs.update(tabId, {
              url: `html/BloqueioTemporario.html?url=${details.url}&targetHour=${blockedItem.endHour * 60}`,
            });
            return { cancel: true };
          }
        } else if (urlsBloqueioPermanente.some(item => item.urlRegex.test(details.url))) {
          console.log(`Blocking permanently: ${details.url}`);
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
  console.log("Tab removed:", tabId);
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
    console.log("Adding suspicious log:", log);
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

  console.log("History captured and stored.");
  setTimeout(captureAndStoreHistory, 24 * 60 * 60 * 1000);
}

captureAndStoreHistory();

// Função para bloquear um site permanentemente
function adicionarUrlBloqueioPermanente(url) {
  // Verifique se a URL já está na lista de bloqueio permanente
  const existente = urlsBloqueioPermanente.some(item => item.urlRegex.test(url));

  if (!existente) {
    // Adicione a URL à lista de bloqueio permanente
    urlsBloqueioPermanente.push({
      urlRegex: new RegExp(`^${url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`),
      startHour: null,
      endHour: null
    });
    console.log(`Site bloqueado permanentemente: ${url}`);
  }
}

// Função para perguntar ao usuário se deseja bloquear o site permanentemente
function perguntarBloqueioPermanente(url) {
  if (confirm(`Deseja bloquear permanentemente o site:\n${url}`)) {
    adicionarUrlBloqueioPermanente(url);
  }
}

// Evento que é acionado sempre que uma guia é atualizada
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    // Quando a página estiver completamente carregada, pergunte ao usuário sobre o bloqueio permanente
    perguntarBloqueioPermanente(tab.url);
  }
});
