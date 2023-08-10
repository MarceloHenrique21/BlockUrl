document.getElementById("cadastroBtn").addEventListener("click", function() {
    const conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = '<iframe src="Telacadastro.html"></iframe>';
});

document.getElementById("loginBtn").addEventListener("click", function() {
    const conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = '<iframe src="login.html"></iframe>';
});
