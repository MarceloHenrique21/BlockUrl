document.addEventListener("DOMContentLoaded", function () {
    const contatoSelect = document.getElementById("contatoSelect");
    const campoContato = document.getElementById("campoContato");
    const campoEmail = document.getElementById("campoEmail");
    const contatoInput = document.getElementById("contato");
    const emailInput = document.getElementById("email");
    const idadeInput = document.getElementById("idade");
    const senhaInput = document.getElementById("senha");

    contatoSelect.addEventListener("change", function () {
        if (contatoSelect.value === "Telefone") {
            campoContato.style.display = "block";
            campoEmail.style.display = "none";
            contatoInput.placeholder = "(00) 0 0000 0000";
        } else if (contatoSelect.value === "Email") {
            campoContato.style.display = "none";
            campoEmail.style.display = "block";
            emailInput.placeholder = "Digite o email";
        } else {
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

        const data = {
            contato: contatoSelect.value === "Email" ? emailInput.value : contatoInput.value,
            idade: idadeInput.value,
            senha: senhaInput.value
        };

        // Mostrar o JSON no console
        console.log("JSON gerado:", JSON.stringify(data, null, 2));
    });
});
