"use strict";

/* =====================================
   CAÇAPALAVRAS — LÓGICA DO JOGO
===================================== */

const TAMANHO_PALAVRA = 5;
const MAX_TENTATIVAS = 6;

const PALAVRAS = [
  { palavra: "TIGRE", dica: "Um felino selvagem." },
  { palavra: "LIVRO", dica: "Tem páginas e pode contar histórias." },
  { palavra: "PRATO", dica: "Usamos para servir comida." },
  { palavra: "NUVEM", dica: "Pode aparecer no céu." },
  { palavra: "FESTA", dica: "Uma comemoração especial." },
  { palavra: "PEDRA", dica: "É encontrada na natureza." },
  { palavra: "FRUTA", dica: "Pode ser doce e nasce de uma planta." },
  { palavra: "PLANO", dica: "Uma ideia organizada para atingir um objetivo." },
  { palavra: "LAPIS", dica: "Usado para escrever e desenhar." },
  { palavra: "MUNDO", dica: "O planeta em que vivemos." },
  { palavra: "BARCO", dica: "Pode navegar pelos rios e mares." },
  { palavra: "FOLHA", dica: "Pode nascer em uma árvore." },
  { palavra: "PRAIA", dica: "Lugar com areia e mar." },
  { palavra: "NOITE", dica: "Período em que o céu costuma ficar escuro." },
  { palavra: "LUGAR", dica: "Um espaço ou uma localização." },
  { palavra: "CAMPO", dica: "Área aberta, muitas vezes com plantações." },
  { palavra: "SONHO", dica: "Pode acontecer enquanto dormimos." },
  { palavra: "CHUVA", dica: "Água que cai das nuvens." },
  { palavra: "VERDE", dica: "Cor comum nas folhas." },
  { palavra: "CARRO", dica: "Veículo usado para transporte." },
  { palavra: "PONTO", dica: "Pode marcar o final de uma frase." },
  { palavra: "PORTA", dica: "Permite entrar e sair de um ambiente." },
  { palavra: "LENTE", dica: "Pode fazer parte de óculos ou câmeras." },
  { palavra: "DENTE", dica: "Ajuda a mastigar os alimentos." },
  { palavra: "BOLSA", dica: "Pode guardar objetos pessoais." },
  {
    palavra: "FAROL",
    dica: "Pode orientar embarcações ou iluminar a estrada.",
  },
  { palavra: "TECLA", dica: "Faz parte de um teclado." },
  { palavra: "JOGOS", dica: "Podem ser digitais, de tabuleiro ou de cartas." },
  { palavra: "AMIGO", dica: "Pessoa com quem temos uma amizade." },
  { palavra: "TEMPO", dica: "Pode ser medido em segundos, minutos e horas." },
];

const LINHAS_TECLADO = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const elementos = {
  tabuleiro: document.getElementById("board"),
  teclado: document.getElementById("keyboard"),
  mensagem: document.getElementById("message"),
  enviar: document.getElementById("submit-button"),
  apagar: document.getElementById("delete-button"),
  reiniciar: document.getElementById("restart-button"),
  dica: document.querySelector("#game > p:not(#message)"),
};

let palavraSecreta = "";
let dicaAtual = "";
let tentativaAtual = "";
let tentativas = [];
let jogoEncerrado = false;
let teclas = {};
let historicoTeclas = {};

/* =====================================
   INICIALIZAÇÃO
===================================== */

function iniciarJogo() {
  const escolha = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];

  palavraSecreta = escolha.palavra;
  dicaAtual = escolha.dica;
  tentativaAtual = "";
  tentativas = [];
  jogoEncerrado = false;
  teclas = {};
  historicoTeclas = {};

  elementos.tabuleiro.innerHTML = "";
  elementos.teclado.innerHTML = "";

  elementos.reiniciar.hidden = true;
  elementos.enviar.disabled = false;
  elementos.apagar.disabled = false;

  mostrarMensagem("Boa sorte! Descubra a palavra secreta.");
  criarTabuleiro();
  criarTeclado();
  atualizarTabuleiro();

  if (elementos.dica) {
    elementos.dica.textContent =
      "Descubra a palavra de cinco letras em até seis tentativas.";
  }
}

/* =====================================
   TABULEIRO
===================================== */

function criarTabuleiro() {
  for (let linha = 0; linha < MAX_TENTATIVAS; linha++) {
    for (let coluna = 0; coluna < TAMANHO_PALAVRA; coluna++) {
      const celula = document.createElement("div");

      celula.classList.add("celula");
      celula.setAttribute("aria-label", "Casa vazia");

      elementos.tabuleiro.appendChild(celula);
    }
  }
}

function atualizarTabuleiro() {
  const celulas = elementos.tabuleiro.children;

  for (let linha = 0; linha < MAX_TENTATIVAS; linha++) {
    for (let coluna = 0; coluna < TAMANHO_PALAVRA; coluna++) {
      const indice = linha * TAMANHO_PALAVRA + coluna;
      const celula = celulas[indice];

      celula.textContent = "";
      celula.classList.remove("correta", "presente", "ausente");

      if (tentativas[linha]) {
        const letra = tentativas[linha].palavra[coluna];

        celula.textContent = letra;
        celula.classList.add(tentativas[linha].resultado[coluna]);
        celula.setAttribute("aria-label", letra);
      } else if (linha === tentativas.length && tentativaAtual[coluna]) {
        celula.textContent = tentativaAtual[coluna];
        celula.setAttribute("aria-label", tentativaAtual[coluna]);
      } else {
        celula.setAttribute("aria-label", "Casa vazia");
      }
    }
  }
}

/* =====================================
   TECLADO VIRTUAL
===================================== */

function criarTeclado() {
  LINHAS_TECLADO.forEach((linha) => {
    const grupo = document.createElement("div");
    grupo.classList.add("linha-teclado");

    for (const letra of linha) {
      const botao = document.createElement("button");

      botao.type = "button";
      botao.textContent = letra;
      botao.dataset.letra = letra;
      botao.setAttribute("aria-label", `Letra ${letra}`);

      botao.addEventListener("click", () => adicionarLetra(letra));

      grupo.appendChild(botao);
      teclas[letra] = botao;
    }

    if (linha === "ZXCVBNM") {
      const apagar = criarBotaoAcao("⌫", "Apagar última letra", apagarLetra);
      grupo.insertBefore(apagar, grupo.firstChild);
    }

    if (linha === "ZXCVBNM") {
      const enviar = criarBotaoAcao("OK", "Enviar palavra", enviarTentativa);
      grupo.appendChild(enviar);
    }

    elementos.teclado.appendChild(grupo);
  });
}

function criarBotaoAcao(texto, descricao, acao) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.classList.add("acao");
  botao.setAttribute("aria-label", descricao);
  botao.addEventListener("click", acao);

  return botao;
}

function atualizarTeclado() {
  Object.entries(historicoTeclas).forEach(([letra, estado]) => {
    const botao = teclas[letra];

    if (!botao) return;

    botao.classList.remove("correta", "presente", "ausente");
    botao.classList.add(estado);
  });
}

/* =====================================
   ENTRADA DE LETRAS
===================================== */

function adicionarLetra(letra) {
  if (jogoEncerrado) return;
  if (tentativaAtual.length >= TAMANHO_PALAVRA) return;

  tentativaAtual += letra.toUpperCase();

  atualizarTabuleiro();
  mostrarMensagem("Continue montando sua palavra.");
}

function apagarLetra() {
  if (jogoEncerrado) return;

  tentativaAtual = tentativaAtual.slice(0, -1);

  atualizarTabuleiro();
}

function mostrarMensagem(texto) {
  elementos.mensagem.textContent = texto;
}

/* =====================================
   VALIDAÇÃO E CORES
===================================== */

function normalizarPalavra(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function palavraExiste(palavra) {
  return PALAVRAS.some((item) => item.palavra === palavra);
}

function avaliarPalavra(palpite, resposta) {
  const resultado = Array(TAMANHO_PALAVRA).fill("ausente");
  const letrasRestantes = resposta.split("");

  // Primeiro, marca as letras na posição correta.
  for (let i = 0; i < TAMANHO_PALAVRA; i++) {
    if (palpite[i] === resposta[i]) {
      resultado[i] = "correta";
      letrasRestantes[i] = null;
    }
  }

  // Depois, marca letras existentes na posição errada.
  for (let i = 0; i < TAMANHO_PALAVRA; i++) {
    if (resultado[i] === "correta") continue;

    const posicao = letrasRestantes.indexOf(palpite[i]);

    if (posicao !== -1) {
      resultado[i] = "presente";
      letrasRestantes[posicao] = null;
    }
  }

  return resultado;
}

function atualizarHistorico(palpite, resultado) {
  for (let i = 0; i < palpite.length; i++) {
    const letra = palpite[i];
    const estado = resultado[i];
    const estadoAnterior = historicoTeclas[letra];

    const prioridade = {
      ausente: 1,
      presente: 2,
      correta: 3,
    };

    if (!estadoAnterior || prioridade[estado] > prioridade[estadoAnterior]) {
      historicoTeclas[letra] = estado;
    }
  }

  atualizarTeclado();
}

/* =====================================
   ENVIAR TENTATIVA
===================================== */

function enviarTentativa() {
  if (jogoEncerrado) return;

  if (tentativaAtual.length !== TAMANHO_PALAVRA) {
    mostrarMensagem("Digite uma palavra com cinco letras.");
    return;
  }

  const palpite = normalizarPalavra(tentativaAtual);

  if (!palavraExiste(palpite)) {
    mostrarMensagem("Essa palavra não está na lista do jogo.");
    return;
  }

  const resultado = avaliarPalavra(palpite, palavraSecreta);

  tentativas.push({
    palavra: palpite,
    resultado,
  });

  atualizarHistorico(palpite, resultado);

  tentativaAtual = "";
  atualizarTabuleiro();

  if (palpite === palavraSecreta) {
    finalizarJogo(true);
    return;
  }

  if (tentativas.length >= MAX_TENTATIVAS) {
    finalizarJogo(false);
    return;
  }

  const restantes = MAX_TENTATIVAS - tentativas.length;

  mostrarMensagem(
    `Ainda não! Você tem ${restantes} ${
      restantes === 1 ? "tentativa" : "tentativas"
    } restante${restantes === 1 ? "" : "s"}.`,
  );
}

/* =====================================
   FIM DE JOGO
===================================== */

function finalizarJogo(venceu) {
  jogoEncerrado = true;

  elementos.enviar.disabled = true;
  elementos.apagar.disabled = true;
  elementos.reiniciar.hidden = false;

  if (venceu) {
    mostrarMensagem(
      `🎉 Parabéns! Você acertou em ${tentativas.length} ${
        tentativas.length === 1 ? "tentativa" : "tentativas"
      }!`,
    );
  } else {
    mostrarMensagem(`Fim de jogo! A palavra era ${palavraSecreta}.`);
  }
}

/* =====================================
   TECLADO FÍSICO
===================================== */

document.addEventListener("keydown", (evento) => {
  if (jogoEncerrado) return;

  if (evento.ctrlKey || evento.altKey || evento.metaKey) return;

  if (/^[a-zA-Zá-úÁ-Ú]$/.test(evento.key)) {
    const letra = normalizarPalavra(evento.key);

    if (letra.length === 1 && /^[A-Z]$/.test(letra)) {
      adicionarLetra(letra);
    }

    return;
  }

  if (evento.key === "Backspace") {
    apagarLetra();
  }

  if (evento.key === "Enter") {
    enviarTentativa();
  }
});

/* =====================================
   EVENTOS DOS BOTÕES
===================================== */

elementos.enviar.addEventListener("click", enviarTentativa);
elementos.apagar.addEventListener("click", apagarLetra);
elementos.reiniciar.addEventListener("click", iniciarJogo);

/* Começa o jogo ao carregar a página. */
iniciarJogo();
