document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var targetHour = parseInt(urlParams.get('targetHour'));
  
    var countdownElement = document.getElementById('countdown');
  
    function updateCountdown() {
      var now = new Date();
      var currentHour = now.getHours();
      var currentMinute = now.getMinutes();
      var currentTime = currentHour * 60 + currentMinute;
  
      var remainingTime = targetHour - currentTime;
      var hours = Math.floor(remainingTime / 60);
      var minutes = remainingTime % 60;
  
      countdownElement.textContent = 'Tempo restante: ' + hours + ' hora e ' + minutes + ' minutos';
  
      if (remainingTime <= 0) {
        location.reload(); // Recarrega a página para desbloquear
      }
    }
  
    updateCountdown();
    setInterval(updateCountdown, 60000); // Atualiza a cada minuto
  });
  