// Função para obter o histórico salvo do Local Storage
function obterHistoricoSalvo() {
    const historyJson = localStorage.getItem('historyJson');
    return historyJson ? JSON.parse(historyJson) : [];
}

const historicoSalvo = obterHistoricoSalvo();
const historicoList = document.getElementById('historicoList');

if (historicoSalvo && historicoSalvo.length > 0) {
    historicoSalvo.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.url;

        const timestamp = new Date(item.timestamp);
        const dataHora = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;

        const info = document.createElement('span');
        info.textContent = `Acessado em: ${dataHora}`;

        listItem.appendChild(link);
        listItem.appendChild(info);
        historicoList.appendChild(listItem);
    });
} else {
    const noDataMessage = document.createElement('p');
    noDataMessage.textContent = 'Nenhum dado de histórico salvo encontrado.';
    historicoList.appendChild(noDataMessage);
}
