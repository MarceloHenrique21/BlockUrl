document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar envio padrão do formulário

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // Verificar se o e-mail existe no localStorage
        const userData = localStorage.getItem(email);

        if (userData) {
            const userDataParsed = JSON.parse(userData);

            // Verificar se a senha corresponde à senha salva
            if (senha === userDataParsed.senha) {
                // Defina um sinalizador no localStorage para indicar que o usuário está autenticado
                localStorage.setItem("autenticado", "true");
                alert("Login bem-sucedido!");

                // Redirecionar para a página "telaAcesso.html"
                window.location.href = "/html/telaAcesso.html";
            } else {
                alert("Senha incorreta. Tente novamente.");
            }
        } else {
            alert("E-mail não encontrado. Por favor, registre-se.");
        }
    });

    // Verificar se a pessoa está autenticada (pode ser verificado em outras páginas também)
    const autenticado = localStorage.getItem("autenticado");

    if (autenticado === "true") {
        // A pessoa está autenticada, não é necessário fazer nada especial aqui
        console.log("Usuário autenticado.");
    }
});
