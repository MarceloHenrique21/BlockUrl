document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var senha = document.getElementById('senha').value;
    // Faça aqui a validação da senha e, se estiver correta, enviar a mensagem de autenticação com a URL
    // Para este exemplo, vamos simular que a senha é "senha123"
    if (senha === "123") {
      // Envia uma mensagem de autenticação para o script de plano de fundo, incluindo a URL desbloqueada
      var urlDesbloqueada = window.location.search.replace('?url=', ''); // Obtém a URL da query string
      chrome.runtime.sendMessage({ autenticado: true, url: urlDesbloqueada });
      // Fecha a janela de login
      window.close();
    } else {
      alert('Senha incorreta. Tente novamente.');
    }
  });


