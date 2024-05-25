const olTarefas = document.getElementById("olTarefas");
const btCarregar = document.getElementById("btCarregar");
const inputTarefa = document.getElementById("inputTarefa");
const btAdicionar = document.getElementById("btAdicionar");
const cbNaoConcluidas = document.getElementById("cbNaoConcluidas");

// canvas para o Chart.js
const ctx = document.getElementById("myChart");

const tarefaURL = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR",
  "X-Parse-REST-API-Key": "2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

const getTarefas = async (naoConcluidas) => {
  let url = tarefaURL;
  if (naoConcluidas) {
    const whereClause = JSON.stringify({ concluida: false });
    url = `${url}?where=${whereClause}`;
    url = encodeURI(url);
    console.log("url", url);
  }
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  return data.results;
};

const listarTarefas = async () => {
  const listaTarefas = await getTarefas(cbNaoConcluidas.checked);
  listaTarefas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  olTarefas.innerHTML = "";
  for (let i = 0; i < listaTarefas.length; ++i) {
    const tarefa = listaTarefas[i];
    const li = document.createElement("li");
    const text = document.createTextNode(`${tarefa.descricao}`);
    const cb = document.createElement("input");
    configurarCB(cb, tarefa);
    const button = document.createElement("button");
    configurarBtRemover(button, tarefa);
    li.appendChild(text);
    li.appendChild(cb);
    li.appendChild(button);
    olTarefas.appendChild(li);
  }
};

const configurarCB = (cb, tarefa) => {
  cb.name = tarefa.objectId;
  cb.type = "checkbox";
  cb.checked = tarefa.concluida;
  cb.onchange = async () => {
    cb.disabled = true;
    await fetch(`${tarefaURL}/${tarefa.objectId}`, {
      method: "PUT",
      headers: headersJson,
      body: JSON.stringify({ concluida: !tarefa.concluida }),
    });
    listarTarefas();
  };
};

// Exemplo de como utilizar function, ao invés de arrow function
// No seu código, dê preferência em utilizar apenas uma das duas formas
function configurarBtRemover(button, tarefa) {
  button.innerHTML = "X";
  button.onclick = async () => {
    button.disabled = true;
    await fetch(`${tarefaURL}/${tarefa.objectId}`, {
      method: "DELETE",
      headers: headers,
    });
    listarTarefas();
  };
}

const adicionarTarefa = async () => {
  const descricao = inputTarefa.value;
  if (!descricao) {
    alert("Precisa digitar uma tarefa!");
    return;
  }
  btAdicionar.disabled = true;
  const response = await fetch(tarefaURL, {
    method: "POST",
    headers: headersJson,
    body: JSON.stringify({ descricao }),
  });
  btAdicionar.disabled = false;
  inputTarefa.value = "";
  inputTarefa.focus();
};

const getCountTarefas = async (concluida) => {
  let url = tarefaURL;
  const whereClause = JSON.stringify({ concluida: concluida });
  url = `${url}?count=1&where=${whereClause}`;
  url = encodeURI(url);
  console.log("url", url);
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  console.log("data count", data);
  return data.count;
};

const desenharGraficoPizza = async () => {
  const countTarefasConcluidas = await getCountTarefas(true);
  const countTarefasAFazer = await getCountTarefas(false);
  const tarefasData = [countTarefasConcluidas, countTarefasAFazer];
  console.log("tarefasData", tarefasData);
  const data = {
    labels: ["concluída", "a fazer"],
    datasets: [
      {
        label: "Acompanhamento Tarefas",
        data: tarefasData,
        backgroundColor: ["rgb(0, 128, 0)", "rgb(255, 87, 51)"],
      },
    ],
    hoverOffset: 4,
  };
  console.log("data", data);
  const config = {
    type: "pie",
    data: data,
  };
  new Chart(ctx, config);
};

btCarregar.onclick = listarTarefas;
btAdicionar.onclick = adicionarTarefa;
cbNaoConcluidas.onchange = listarTarefas;
window.onload = () => {
  listarTarefas();
  desenharGraficoPizza();
};
