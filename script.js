// =============================
// LISTA DOS 20 TIMES EM ORDEM ALFABÉTICA
// =============================
let adminLogado = false;
let historicoCampeoes = [];
const SENHA_ADMIN = "1234"; // depois você muda

const times = [
  "Athletico-PR",
  "Atlético-GO",
  "Atlético-MG",
  "Bahia",
  "Botafogo",
  "Bragantino",
  "Corinthians",
  "Cruzeiro",
  "Cuiabá",
  "Flamengo",
  "Fluminense",
  "Fortaleza",
  "Grêmio",
  "Internacional",
  "Juventude",
  "Palmeiras",
  "Santos",
  "São Paulo",
  "Vasco",
  "Vitória"
];

// Array que guarda os times ainda disponíveis
let timesDisponiveis = [...times];

// Array que guarda os jogadores cadastrados
let jogadores = [];

let campeonato = {
  faseAtual: 0,
  fases: []
};

// =============================
// FUNÇÃO PARA MONTAR A TABELA INICIAL
// =============================
function montarTabela() {
  const tabela = document.getElementById("tabelaTimes");
  tabela.innerHTML = "";

  times.forEach(time => {
    const linha = document.createElement("tr");

    const colunaNome = document.createElement("td");
    colunaNome.textContent = time;

    const colunaStatus = document.createElement("td");

    // Verifica se o time já foi sorteado
    if (!timesDisponiveis.includes(time)) {
      colunaStatus.textContent = "Selecionado";
      linha.classList.add("selecionado");
    } else {
      colunaStatus.textContent = "Disponível";
    }

    linha.appendChild(colunaNome);
    linha.appendChild(colunaStatus);
    tabela.appendChild(linha);
  });
}

// =============================
// FUNÇÃO PARA CADASTRAR JOGADOR
// JÁ FAZ O SORTEIO AUTOMATICAMENTE
// =============================
function cadastrarJogador() {
  const input = document.getElementById("nomeJogador");
  const nome = input.value.trim();
  // Verifica se o nome está vazio
  if (nome === "") {
    alert("Digite um nome válido!");
    return;
  }

  // Verifica se já tem 20 jogadores
  if (jogadores.length >= 20) {
    alert("Todos os times já foram sorteados!");
    return;
  }

  // Verifica se jogador já existe
  const jogadorExiste = jogadores.find(j => j.nome === nome);
  if (jogadorExiste) {
    alert("Esse jogador já foi cadastrado!");
    return;
  }

  // =============================
  // SORTEIO AUTOMÁTICO
  // =============================

  // Gera índice aleatório
  const indice = Math.floor(Math.random() * timesDisponiveis.length);

  // Remove o time sorteado do array
  const timeSorteado = timesDisponiveis.splice(indice, 1)[0];

  // Adiciona jogador no array
  jogadores.push({
    nome: nome,
    time: timeSorteado
  });

  // Atualiza lista visual
  atualizarListaJogadores();

  // Atualiza tabela de times
  montarTabela();

  // Limpa input
  input.value = "";
  salvarNoLocalStorage();
}

// =============================
// FUNÇÃO PARA ATUALIZAR LISTA DE JOGADORES
// =============================
function atualizarListaJogadores() {
  const lista = document.getElementById("listaJogadores");
  lista.innerHTML = "";

  jogadores.forEach(jogador => {
    const item = document.createElement("li");
    item.textContent = `${jogador.nome} → ${jogador.time}`;
    lista.appendChild(item);
  });
}

// =============================
// INICIALIZA A TABELA AO ABRIR O SITE
// =============================
montarTabela();

function ehPotenciaDeDois(numero) {
  return (numero & (numero - 1)) === 0 && numero !== 0;
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function iniciarMataMata() {

  if (!ehPotenciaDeDois(jogadores.length)) {
    alert("Número de jogadores deve ser 4, 8 ou 16!");
    return;
  }

  if (jogadores.length < 4) {
    alert("Mínimo de 4 jogadores!");
    return;
  }

  campeonato.fases = [];
  campeonato.faseAtual = 0;

  let jogadoresEmbaralhados = embaralhar([...jogadores]);

  let fase = {
    nome: definirNomeFase(jogadores.length),
    confrontos: []
  };

  for (let i = 0; i < jogadoresEmbaralhados.length; i += 2) {

    fase.confrontos.push({
      timeA: jogadoresEmbaralhados[i],
      timeB: jogadoresEmbaralhados[i + 1],
      ida: { golsA: null, golsB: null },
      volta: { golsA: null, golsB: null },
      vencedor: null
    });

  }

  campeonato.fases.push(fase);

  mostrarFaseAtual();
  salvarNoLocalStorage();
}

function definirNomeFase(qtd) {

  if (qtd === 4) return "Semifinal";
  if (qtd === 8) return "Quartas de Final";
  if (qtd === 16) return "Oitavas de Final";

  return "Fase Eliminatória";
}

function mostrarFaseAtual() {

  const area = document.getElementById("areaCampeonato");
  area.innerHTML = "";

  let fase = campeonato.fases[campeonato.faseAtual];

  let titulo = document.createElement("h2");
  titulo.textContent = fase.nome;
  area.appendChild(titulo);

  fase.confrontos.forEach((confronto, index) => {

    let div = document.createElement("div");
    div.style.marginBottom = "20px";

    div.innerHTML = `
      <strong>${confronto.timeA.nome} (${confronto.timeA.time})</strong>
      vs
      <strong>${confronto.timeB.nome} (${confronto.timeB.time})</strong>
      <br><br>

      Ida:
      <input type="number" min="0" onchange="registrarPlacar(${index}, 'ida', 'A', this.value)">
      x
      <input type="number" min="0" onchange="registrarPlacar(${index}, 'ida', 'B', this.value)">
      <br><br>

      Volta:
      <input type="number" min="0" onchange="registrarPlacar(${index}, 'volta', 'A', this.value)">
      x
      <input type="number" min="0" onchange="registrarPlacar(${index}, 'volta', 'B', this.value)">
      <br><br>
    `;

  area.appendChild(div);
  });

  // Verifica se é a final (apenas 1 confronto)
if (fase.confrontos.length === 1) {

  let botaoEncerrar = document.createElement("button");
  botaoEncerrar.textContent = "Encerrar Campeonato";
  botaoEncerrar.onclick = finalizarFase; 
  area.appendChild(botaoEncerrar);

} else {

  let botaoFinalizar = document.createElement("button");
  botaoFinalizar.textContent = "Finalizar Fase";
  botaoFinalizar.onclick = finalizarFase;
  area.appendChild(botaoFinalizar);

}
}

function registrarPlacar(index, tipo, lado, valor) {

  let fase = campeonato.fases[campeonato.faseAtual];
  let confronto = fase.confrontos[index];

  valor = parseInt(valor);

  if (lado === "A") {
    confronto[tipo].golsA = valor;
  } else {
    confronto[tipo].golsB = valor;
  }
  salvarNoLocalStorage();
}

function finalizarFase() {

  let fase = campeonato.fases[campeonato.faseAtual];
  let vencedores = [];

  for (let confronto of fase.confrontos) {

    if (
      confronto.ida.golsA === null ||
      confronto.ida.golsB === null ||
      confronto.volta.golsA === null ||
      confronto.volta.golsB === null
    ) {
      alert("Preencha todos os placares!");
      return;
    }

    let totalA = confronto.ida.golsA + confronto.volta.golsA;
    let totalB = confronto.ida.golsB + confronto.volta.golsB;

    if (totalA > totalB) {
      confronto.vencedor = confronto.timeA;
    } else if (totalB > totalA) {
      confronto.vencedor = confronto.timeB;
    } else {
      alert("Empate no agregado! Implementar pênaltis depois 😉");
      return;
    }

    vencedores.push(confronto.vencedor);
  }

  if (vencedores.length === 1) {

  let campeao = vencedores[0];

  historicoCampeoes.push(campeao);

  salvarNoLocalStorage();
  mostrarHistorico();

  alert("🏆 CAMPEÃO: " + campeao.nome);
  campeonato = { faseAtual: 0, fases: [] };
jogadores = [];
timesDisponiveis = [...times];

document.getElementById("areaCampeonato").innerHTML = "";
atualizarListaJogadores();
montarTabela();

  return;
}

  campeonato.faseAtual++;

  campeonato.fases.push({
    nome: definirNomeFase(vencedores.length),
    confrontos: gerarConfrontos(vencedores)
  });

  mostrarFaseAtual();
  salvarNoLocalStorage();
}

function gerarConfrontos(lista) {

  let confrontos = [];

  for (let i = 0; i < lista.length; i += 2) {
    confrontos.push({
      timeA: lista[i],
      timeB: lista[i + 1],
      ida: { golsA: null, golsB: null },
      volta: { golsA: null, golsB: null },
      vencedor: null
    });
  }

  return confrontos;
}

function loginAdmin() {

  const senha = document.getElementById("senhaAdmin").value;

  if (senha === SENHA_ADMIN) {
    adminLogado = true;
    alert("Admin autenticado!");

    document.getElementById("btnIniciar").style.display = "inline-block";
  } else {
    alert("Senha incorreta!");
  }
 
}

function salvarNoLocalStorage() {

  const dados = {
    jogadores: jogadores,
    campeonato: campeonato,
    historicoCampeoes: historicoCampeoes
  };

  localStorage.setItem("copaBR", JSON.stringify(dados));

}

function carregarDoLocalStorage() {

  const dadosSalvos = localStorage.getItem("copaBR");

  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos);

    jogadores = dados.jogadores || [];
    campeonato = dados.campeonato || { faseAtual: 0, fases: [] };
    historicoCampeoes = dados.historicoCampeoes || [];

    atualizarListaJogadores();
    montarTabela();
    mostrarHistorico();

    if (campeonato.fases.length > 0) {
      mostrarFaseAtual();
    }
  }
}

function mostrarHistorico() {

  const lista = document.getElementById("listaHistorico");
  lista.innerHTML = "";

  historicoCampeoes.forEach((campeao, index) => {

    const item = document.createElement("li");
    item.textContent = `${index + 1}º - ${campeao.nome} (${campeao.time})`;

    lista.appendChild(item);
  });

}
function encerrarCampeonato() {

  if (!adminLogado) {
    alert("Apenas admin pode encerrar!");
    return;
  }

  if (campeonato.fases.length === 0) {
    alert("Nenhum campeonato em andamento!");
    return;
  }

  campeonato = { faseAtual: 0, fases: [] };
  jogadores = [];
  timesDisponiveis = [...times];

  document.getElementById("areaCampeonato").innerHTML = "";

  atualizarListaJogadores();
  montarTabela();
  carregarDoLocalStorage();

  salvarNoLocalStorage();

  alert("Campeonato encerrado!");
}