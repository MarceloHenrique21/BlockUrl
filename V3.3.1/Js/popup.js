document.addEventListener("DOMContentLoaded", function () {
    // Verifique se o usuário está autenticado (usando o localStorage)
    const autenticado = localStorage.getItem("autenticado");

    if (autenticado === "true") {
        // O usuário está autenticado, redirecione para a telaAcesso.html
        window.location.href = "/html/telaAcesso.html";
    } else {
        // O usuário não está autenticado, redirecione para TelaInicial.html
        window.location.href = "/html/TelaInicial.html";
    }
});
