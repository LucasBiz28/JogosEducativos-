// Lista de perguntas do quiz, cada uma com a pergunta, alternativas e a alternativa correta (índice no array de respostas)
const questions = [
    {
        question: "Qual é o resultado de 345 + 678?",
        answers: ["1090", "1.023", "987", "1200"],
        correct: 1
    },
    {
        question: "João tinha R$ 120,00. Ele comprou um brinquedo por R$ 75,00. Quanto sobrou?",
        answers: ["R$ 50,00", "R$ 45,00", "R$ 60,00", "R$ 85,00"],
        correct: 1
    },
    {
        question: " Qual é o valor de 8 x 7?",
        answers: ["36", "49", "64", "56"],
        correct: 3
    },
    {
        question: "Divida 96 por 8. Qual é o resultado??",
        answers: ["12", "5", "15", "24"],
        correct: 0
    },
    {
        question: " Maria cortou uma pizza em 8 pedaços iguais e comeu 3. Que fração da pizza ela comeu?",
        answers: ["8/80", "2/3", "3/18", "3/8"],
        correct: 3
    },
    {
        question: " Qual número completa a sequência: 2, 4, 6, ___, 10, 12?",
        answers: ["7", "8", "9", "11"],
        correct: 1
    },
    {
        question: "  Um retângulo tem 5 cm de largura e 8 cm de comprimento. Qual é a sua área?",
        answers: ["40 cm²", "60 cm²", "45 cm²", "50 cm²"],
        correct: 0
    },
    {
        question: " Escreva o número 3.457 por extenso.",
        answers: ["três mil, quatrocentos e cinquenta e sete", "trêze mil, quatrocentos e cinquenta e sete", "três milhões quatrocentos e cinquenta e sete mil ", "trezentos e quarenta e cinco"],
        correct: 0
    },
    {
        question: " Se um quilo de maçã custa R$ 6,00, quanto custam 3 quilos?",
        answers: ["R$ 30,00", "R$ 49,00", "R$ 18,00", "R$ 20,00"],
        correct: 2
    },
    {
        question: " Qual é o menor número primo maior que 10?",
        answers: ["12", " 11", "9", "8"],
        correct: 1
    },
];

// Variáveis para controlar o progresso do quiz
let currentQuestion = 0; // índice da pergunta atual
let score = 0; // pontuação do usuário

// Referência aos elementos do DOM
const quiz = document.getElementById("quiz");
const questionEl = document.getElementById("question"); // elemento onde a pergunta será exibida
const answersEl = document.getElementById("answers"); // elemento onde as alternativas serão exibidas
const nextBtn = document.getElementById("next-btn"); // botão "Próxima"
const resultEl = document.getElementById("result"); // (opcional) onde o resultado poderia ser exibido

// Função para exibir a pergunta atual
function showQuestion() {
    const q = questions[currentQuestion]; // obtém a pergunta atual
    questionEl.textContent = q.question; // exibe o texto da pergunta
    answersEl.innerHTML = ""; // limpa as alternativas anteriores

    // Cria botões para cada alternativa
    q.answers.forEach((answer, index) => {
        const btn = document.createElement("button"); // cria um botão
        btn.textContent = answer; // define o texto do botão
        btn.onclick = () => selectAnswer(index); // define o que acontece ao clicar (chama selectAnswer)
        answersEl.appendChild(btn); // adiciona o botão à tela
    });

    // Esconde o botão de próxima pergunta até que uma resposta seja selecionada
    nextBtn.style.display = "none";
}

// Função chamada quando o usuário seleciona uma alternativa
function selectAnswer(index) {
    const correct = questions[currentQuestion].correct; // obtém o índice da resposta correta
    const buttons = answersEl.querySelectorAll("button"); // pega todos os botões de resposta

    // Marca os botões como certos ou errados e os desabilita
    buttons.forEach((btn, i) => {
        btn.disabled = true; // desabilita o botão
        if (i === correct) {
            btn.style.backgroundColor = "#02c40c"; // verde para a resposta correta
        } else if (i === index) {
            btn.style.backgroundColor = "#f72601"; // vermelho para a resposta errada escolhida
        }
    });

    // Se o usuário acertou, aumenta a pontuação
    if (index === correct) {
        score++;
    }

    // Mostra o botão de próxima pergunta
    nextBtn.style.display = "inline-block";
}

// Quando o botão de próxima é clicado
nextBtn.onclick = () => {
    currentQuestion++; // vai para a próxima pergunta
    if (currentQuestion < questions.length) {
        showQuestion(); // mostra a próxima
    } else {
        showResult(); // termina o quiz e mostra o resultado
    }
};

// Mostra o resultado final do quiz
function showResult() {
    quiz.innerHTML = `
      <h2>Você acertou ${score} de ${questions.length} perguntas!</h2>
      <button onclick="location.reload()">Recomeçar</button>
    `;
}

// Inicia o quiz exibindo a primeira pergunta
showQuestion();
