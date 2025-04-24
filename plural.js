// Lista de fases com palavras, plurais e imagens
const fases = [
    [
        { word: "Gato", plural: "Gatos", image: "imagens/gato.png" },
        { word: "Laranja", plural: "Laranjas", image: "imagens/laranja.png" },
        { word: "Celular", plural: "Celulares", image: "imagens/celular.png" },
        { word: "Flor", plural: "Flores", image: "imagens/flor.png" },
        { word: "Monitor", plural: "Monitores", image: "imagens/monitor.png" }
    ],
    [
        { word: "Sol", plural: "Sóis", image: "imagens/sol.png" },
        { word: "Pão", plural: "Pães", image: "imagens/pao.png" },
        { word: "Cão", plural: "Cães", image: "imagens/dog.png" },
        { word: "Rei", plural: "Reis", image: "imagens/rei.png" },
        { word: "Leão", plural: "Leões", image: "imagens/leão.png" }
    ],
    [
        { word: "Coração", plural: "Corações", image: "imagens/coração.png" },
        { word: "Árvore", plural: "Árvores", image: "imagens/arvore.png" },
        { word: "Barril", plural: "Barris", image: "imagens/barril.png" },
        { word: "Cisne", plural: "Cisnes", image: "imagens/cisne.png" },
        { word: "Jardim", plural: "Jardins", image: "imagens/jardim.png" }
    ],
    [
        { word: "Pastel", plural: "Pasteis", image: "imagens/pastel.png" },
        { word: "Índio", plural: "Índios", image: "imagens/indio.png" },
        { word: "Funil", plural: "Funis", image: "imagens/funil.png" },
        { word: "Capitão", plural: "Capitães", image: "imagens/capitao.png" },
        { word: "Anzol", plural: "Anzois", image: "imagens/anzol.png" }
    ],
    [
        { word: "Fóssil", plural: "Fósseis", image: "imagens/fossil.png" },
        { word: "Mão", plural: "Mãos", image: "imagens/mao.png" },
        { word: "Óculos", plural: "Óculos", image: "imagens/oculos.png" },
        { word: "Javali", plural: "Javalis", image: "imagens/javali.png" },
        { word: "Lápis", plural: "Lápis", image: "imagens/lapis.png" }
    ]
];

// Variáveis de controle
let faseAtual = 0;
let indiceAtual = 0;
let pontuacao = 0;

// Sons do jogo
const somAcerto = new Audio("sons/acerto.mp3");
const somErro = new Audio("sons/erro.mp3");
const somFim = new Audio("sons/fim.mp3");

// Carrega uma palavra da fase atual
function carregarPalavra() {
    const palavraAtual = fases[faseAtual][indiceAtual];
    const container = document.getElementById("image-container");
    container.innerHTML = `<img id="word-image" src="${palavraAtual.image}" alt="Imagem da palavra">`;
    container.classList.remove("dupla");
    document.getElementById("word-text").textContent = palavraAtual.word;
    document.getElementById("feedback").textContent = "";
    const input = document.getElementById("answer-input");
    input.value = "";
    input.disabled = false;
    input.focus();
    document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao;
    document.getElementById("fase").textContent = "Fase: " + (faseAtual + 1);
}

// Verifica a resposta do jogador
function verificarResposta() {
    const input = document.getElementById("answer-input");
    const resposta = input.value.trim();
    const palavraAtual = fases[faseAtual][indiceAtual];
    const imagem = document.getElementById("word-image");
    const feedback = document.getElementById("feedback");
    const container = document.getElementById("image-container");

    if (resposta.toLowerCase() === palavraAtual.plural.toLowerCase()) {
        feedback.textContent = "Muito bem!";
        document.getElementById("word-text").textContent = palavraAtual.plural;
        somAcerto.play();
        pontuacao += 10;
        input.disabled = true;

        // Efeito visual com clones da imagem
        for (let i = 0; i < 30; i++) {
            const clone = imagem.cloneNode();
            clone.classList.add("explosao-clone");
            const rect = imagem.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            clone.style.left = `${rect.left - containerRect.left}px`;
            clone.style.top = `${rect.top - containerRect.top}px`;
            clone.style.setProperty("--x", (Math.random() - 0.5) * 800 + "px");
            clone.style.setProperty("--y", (Math.random() - 0.5) * 600 + "px");
            container.appendChild(clone);
        }

        // Espera antes de seguir para próxima
        setTimeout(() => {
            document.querySelectorAll(".explosao-clone").forEach(clone => clone.remove());
            container.innerHTML = `
          <img src="${palavraAtual.image}" style="width: 150px;">
          <img src="${palavraAtual.image}" style="width: 150px;">
        `;
            container.classList.add("dupla");
            const palavraElement = document.createElement("p");
            palavraElement.textContent = palavraAtual.plural;
            container.appendChild(palavraElement);
            document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao;

            setTimeout(() => {
                indiceAtual++;
                if (indiceAtual < fases[faseAtual].length) {
                    carregarPalavra();
                } else {
                    const transicao = document.getElementById("fase-transition");
                    const numeroFaseAnterior = faseAtual + 1;
                    faseAtual++;
                    indiceAtual = 0;
                    if (faseAtual < fases.length) {
                        document.getElementById("numero-fase").textContent = `${numeroFaseAnterior}`;
                        transicao.classList.remove("hidden");
                        transicao.classList.add("show");
                        const somTransicao = new Audio("sons/fase.mp3");
                        somTransicao.play();
                        setTimeout(() => {
                            transicao.classList.remove("show");
                            setTimeout(() => {
                                transicao.classList.add("hidden");
                                carregarPalavra();
                            }, 500);
                        }, 2000);
                    } else {
                        somFim.play();
                        document.querySelector(".game-container").innerHTML = `
                <h1>Você concluiu todas as fases! 🎉</h1>
                <p>Sua pontuação final: ${pontuacao}</p>
              `;
                    }
                }
            }, 1500);
        }, 600);
    } else {
        feedback.textContent = "Tente novamente!";
        somErro.play();
    }
}

// Pressionar Enter também verifica a resposta
document.getElementById("answer-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        verificarResposta();
    }
});

// Dá foco ao input ao clicar em qualquer parte da tela
document.addEventListener("click", function (e) {
    const input = document.getElementById("answer-input");
    if (!input.disabled) {
        input.focus();
    }
});

// Função que inicia o jogo ao clicar no botão
function iniciarJogo() {
    document.getElementById("start-card").style.display = "none";// esconde o card
    document.querySelector(".game-container").style.display = "block";// mostra o jogo
    carregarPalavra(); // começa o jogo
}

// NÃO iniciar o jogo automaticamente com window.onload
window.onload = () => {
    carregarPalavra();
};
