function calcularNota() {

    var nome = document.getElementById("nome").value;
    var materia = document.getElementById("materia").value;

    var peso = Number(document.getElementById("peso").value);
    var total = Number(document.getElementById("total").value);
    var prova = Number(document.getElementById("prova").value);

    if (nome === "" || materia === "" || peso === "" || total === "" || prova === "") {

        alert("Por favor, preencha todos os campos.");

    } else {

        var nota = (total * peso) / prova;

        if (total === prova) {

            alert("Olá " + nome + ", sua nota na matéria de " + materia + " é: " + nota.toFixed(2) + ". Parabéns! Você alcançou a nota máxima!");

        } else if (total < prova) {

            alert("Olá " + nome + ", sua nota na matéria de " + materia + " é: " + nota.toFixed(2) + ". Você precisa estudar mais para alcançar a nota máxima.");

        }
    }
}