async function getBrasiliaTime() {
    try {
      const response = await fetch("http://worldtimeapi.org/api/timezone/America/Sao_Paulo");
      const data = await response.json();
      return new Date(data.utc_datetime);
    } catch (error) {
      console.error("Erro ao obter a hora de Brasília:", error);
      return new Date();
    }
  }
  
  // Envia o horário de Brasília para o background script
  chrome.runtime.sendMessage({ type: "brasiliaTime", brasiliaTime: await getBrasiliaTime() });
 