document.addEventListener("DOMContentLoaded", function () {

    const contatoSelect = document.getElementById("contatoSelect");
    const campoContato = document.getElementById("campoContato");
    const campoEmail = document.getElementById("campoEmail");
    const contatoInput = document.getElementById("contato");
    const emailInput = document.getElementById("email");
    const dataNascimentoInput = document.getElementById("dataNascimento");
    const senhaInput = document.getElementById("senha");

    contatoSelect.addEventListener("change", function () {
        console.log("Contato selecionado:", contatoSelect.value);

        if (contatoSelect.value === "Telefone") {
            campoContato.style.display = "block";
            campoEmail.style.display = "none";
            contatoInput.placeholder = "(00) 0 0000 0000";

        } 
            else if (contatoSelect.value === "Email") {
                campoContato.style.display = "none";
                campoEmail.style.display = "block";
                emailInput.placeholder = "Digite o email";
        } 
            else {
                campoContato.style.display = "none";
                campoEmail.style.display = "none";
        }
    });

    contatoInput.addEventListener("input", function () {
        if (contatoSelect.value === "Telefone") {
            const value = contatoInput.value.replace(/\D/g, "");
            if (value.length <= 11) {
                const formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)} ${value.slice(7)}`;
                contatoInput.value = formattedValue;
            }
        }
    });

    const form = document.getElementById("cadastroForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar envio padrão do formulário

        // Calcular a idade a partir da data de nascimento
        const dataNascimento = new Date(dataNascimentoInput.value);
        // Incrementar 1 dia na data de nascimento
        dataNascimento.setDate(dataNascimento.getDate() + 1);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNascimento.getFullYear();

        // Verificar se a pessoa tem pelo menos 18 anos
        if (idade >= 18) {
            alert("A criança deve ser menor de idade");
        } else {
            const data = {
                contato: contatoSelect.value === "Email" ? emailInput.value : contatoInput.value,
                dataNascimento: dataNascimento.toLocaleDateString(), // Armazenar a data de nascimento
                senha: senhaInput.value
            };


// Salvar os dados no localStorage com um identificador único (por exemplo, o email)
localStorage.setItem(emailInput.value, JSON.stringify(data));
// ...

            // Mostrar mensagem de sucesso
            alert("Cadastro realizado com sucesso!");

            // Redirecionar para a página de login
            window.location.href = "/html/Login.html";
        }
    });
});
