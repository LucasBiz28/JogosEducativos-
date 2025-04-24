//  Palavras divididas por fases do jogo
const fases = [
  ["gato", "casa", "bola", "pato", "luz"], // Fase 1
  ["festa", "nuvem", "livro", "parque", "verão"], // Fase 2
  ["brinquedo", "computador", "escorrega", "pipoca", "gelatina"], // Fase 3
  ["aventura", "bicicleta", "escola", "elefante", "camiseta"], // Fase 4
  ["helicoptero", "cachoeira", "enciclopedia", "experimento", "matematica"] // Fase 5
];

//  Variáveis para controlar o estado atual do jogo
let faseAtual = 0;
let palavraIndex = 0;
let pontuacao = 0;

//  Elementos do HTML usados no jogo
const letterBank = document.getElementById("letter-bank");
const wordSlot = document.getElementById("word-slot");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const progressDisplay = document.getElementById("progress");
const modalFase = document.getElementById("fase-concluida");
const fimJogo = document.getElementById("fim-jogo");
const pontuacaoFinal = document.getElementById("pontuacao-final");
const gameContainer = document.getElementById("game-container");

let palavraAtual = "";
let letrasOriginais = [];

// Função para embaralhar letras de uma palavra
function embaralhar(letras) {
  let embaralhadas;
  do {
    embaralhadas = [...letras].sort(() => Math.random() - 0.5);
  } while (embaralhadas.join("") === letras.join(""));
  return embaralhadas;
}

//  Carrega uma nova palavra da fase atual
function carregarFase() {
  feedback.textContent = "";
  letterBank.innerHTML = "";
  wordSlot.innerHTML = "";
  scoreDisplay.textContent = `Pontuação: ${pontuacao}`;
  progressDisplay.textContent = `Fase ${faseAtual + 1} - Palavra ${palavraIndex + 1}/${fases[faseAtual].length}`;

  palavraAtual = fases[faseAtual][palavraIndex];
  letrasOriginais = palavraAtual.split("");

  exibirLetras(embaralhar(letrasOriginais));

  // Cria os espaços para o jogador soltar as letras
  letrasOriginais.forEach(() => {
    const slot = document.createElement("div");
    slot.className = "drop-slot";
    slot.ondragover = (event) => event.preventDefault();
    slot.ondrop = (event) => {
      const id = event.dataTransfer.getData("text");
      const letra = document.getElementById(id);

      // Se já tiver uma letra, ela volta pro letter bank
      if (slot.firstChild) {
        letterBank.appendChild(slot.firstChild);
      }

      slot.appendChild(letra);
    };
    wordSlot.appendChild(slot);
  });
}

//  Exibe as letras embaralhadas no letter bank
function exibirLetras(letras) {
  letterBank.innerHTML = "";
  letras.forEach((letra, index) => {
    const card = document.createElement("div");
    card.textContent = letra;
    card.className = "letter-card";
    card.draggable = true;
    card.id = `card-${index}`;
    card.ondragstart = (event) => {
      event.dataTransfer.setData("text", event.target.id);
    };
    letterBank.appendChild(card);
  });
}

//  Embaralha novamente as letras soltas
function reembaralharLetras() {
  const cartasSoltas = Array.from(letterBank.querySelectorAll(".letter-card"))
    .map(card => card.textContent);

  const novasLetras = embaralhar(cartasSoltas);
  exibirLetras(novasLetras);
}

//  Verifica se o jogador montou a palavra corretamente
function checkAnswer() {
  const slots = wordSlot.children;
  let resposta = "";
  for (let slot of slots) {
    if (slot.firstChild) {
      resposta += slot.firstChild.textContent;
    }
  }

  if (resposta === palavraAtual) {
    document.getElementById("correct-sound").play(); // Som de acerto
    feedback.textContent = "Muito bem!";
    pontuacao += 10;
    palavraIndex++;

    if (palavraIndex < fases[faseAtual].length) {
      setTimeout(() => {
        carregarFase();
      }, 1500);
    } else {
      faseAtual++;
      palavraIndex = 0;

      if (faseAtual < fases.length) {
        modalFase.style.display = "flex";
        document.getElementById("next-sound").play(); // Som de transição de fase
        setTimeout(() => {
          modalFase.style.display = "none";
          carregarFase();
        }, 2500);
      } else {
        document.getElementById("win-sound").play(); // Som de vitória
        gameContainer.style.display = "none";
        fimJogo.style.display = "flex";
        pontuacaoFinal.textContent = `Sua pontuação final foi: ${pontuacao} pontos.`;
      }
    }
  } else {
    document.getElementById("error-sound").play(); // Som de erro
    feedback.textContent = "Tente novamente!";
  }
}

//  Reinicia o jogo do começo
function reiniciarJogo() {
  faseAtual = 0;
  palavraIndex = 0;
  pontuacao = 0;
  gameContainer.style.display = "block";
  fimJogo.style.display = "none";
  carregarFase();
}

//  Permite checar a resposta pressionando "Enter"
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

//  Botão que embaralha novamente todas as letras
function embaralharNovamente() {
  const slots = Array.from(wordSlot.children);
  slots.forEach(slot => {
    if (slot.firstChild) {
      letterBank.appendChild(slot.firstChild);
    }
  });

  const cartas = Array.from(letterBank.querySelectorAll(".letter-card"));
  const letras = cartas.map(card => card.textContent);
  const embaralhadas = embaralhar(letras);
  exibirLetras(embaralhadas);
}

//  Inicia o jogo carregando a primeira palavra
carregarFase();

//  Ativa o botão de embaralhar letras
document.getElementById("embaralhar-btn").addEventListener("click", embaralharNovamente);
