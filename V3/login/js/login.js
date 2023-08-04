document.getElementById('loginForm').addEventListener('submit', function(event) {
 
  event.preventDefault();
  var senha = document.getElementById('senha').value;
  
  if (senha === "123") {

    // Envia uma mensagem de autenticação para o script de plano de fundo, incluindo a URL desbloqueada
    
    var urlDesbloqueada = window.location.search.replace('?url=', ''); // Obtém a URL da query string
    chrome.runtime.sendMessage({ autenticado: true, url: urlDesbloqueada });
    
    
    // Fecha a janela de login
    window.close();
    window.location.reload(true);
  } else {
    alert('Senha incorreta. Tente novamente.');
  }
});