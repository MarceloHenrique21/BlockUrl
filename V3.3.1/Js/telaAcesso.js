document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", function () {
        const senha = document.getElementById("senha").value;
        
        // Verifique as credenciais (substitua isso com sua lógica real)
        if (senha === "senha_correta") {
            // Defina um sinalizador no localStorage para indicar que o usuário está autenticado
            localStorage.setItem("autenticado", "true");
            
            // Redirecione a pessoa de volta para a página "telaAcesso.html"
            window.location.href = "telaAcesso.html";
        } else {
            alert("Senha incorreta. Tente novamente.");
        }
    });

    // Verifique se a pessoa está autenticada (pode ser verificado em outras páginas também)
    const autenticado = localStorage.getItem("autenticado");

    if (autenticado === "true") {
        // A pessoa está autenticada, não é necessário fazer nada especial aqui
        console.log("Usuário autenticado.");
    }
});
