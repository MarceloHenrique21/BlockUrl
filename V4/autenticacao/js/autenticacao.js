
document.getElementById('loginForm').addEventListener('submit', function(event) {
  
  event.preventDefault();
  var senha = document.getElementById('senha').value;

  if (senha === "123") {
    // Envia uma mensagem de autenticação para o script de plano de fundo, incluindo a URL desbloqueada
    var urlDesbloqueada = window.location.search.replace('?url=', ''); // Obtém a URL da query string
    chrome.runtime.sendMessage({ autenticado: true, url: urlDesbloqueada });

    // Não é necessário fechar a janela de login ou recarregar a página aqui
  } else {
    alert('Senha incorreta. Tente novamente.');
  }
});
