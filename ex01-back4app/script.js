const olTarefas = document.getElementById("olTarefas");
const btCarregar = document.getElementById("btCarregar");
const inputTarefa = document.getElementById("inputTarefa");
const btAdicionar = document.getElementById("btAdicionar");

const getTarefas = async () => {
  const response = await fetch("https://parseapi.back4app.com/classes/Tarefa", {
    method: "GET",
    headers: {
      "X-Parse-Application-Id": "LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR",
      "X-Parse-REST-API-Key": "2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k",
    },
  });
  const data = await response.json();
  return data.results;
};

const listarTarefas = async () => {
  const listaTarefas = await getTarefas();
  listaTarefas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  olTarefas.innerHTML = "";
  for (let i = 0; i < listaTarefas.length; ++i) {
    const tarefa = listaTarefas[i];
    const li = document.createElement("li");
    const text = document.createTextNode(`${tarefa.descricao} - concluída: `);
    const cb = document.createElement("input");
    cb.name = tarefa.objectId;
    cb.type = "checkbox";
    cb.checked = tarefa.concluida;
    cb.onchange = async () => {
      cb.disabled = true;
      await fetch(
        `https://parseapi.back4app.com/classes/Tarefa/${tarefa.objectId}`,
        {
          method: "PUT",
          headers: {
            "X-Parse-Application-Id":
              "LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR",
            "X-Parse-REST-API-Key": "2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ concluida: !tarefa.concluida }),
        }
      );
      cb.disabled = false;
      listarTarefas();
    };
    li.appendChild(text);
    li.appendChild(cb);
    olTarefas.appendChild(li);
  }
};

/*
curl -X POST \
-H "X-Parse-Application-Id: LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR" \
-H "X-Parse-REST-API-Key: 2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k" \
-H "Content-Type: application/json" \
-d "{ \"concluida\":true,\"descricao\":\"A string\" }" \
https://parseapi.back4app.com/classes/Tarefa
*/
const adicionarTarefa = async () => {
  const descricao = inputTarefa.value;
  if (!descricao) {
    alert("Precisa digitar uma tarefa!");
    return;
  }
  btAdicionar.disabled = true;
  const response = await fetch("https://parseapi.back4app.com/classes/Tarefa", {
    method: "POST",
    headers: {
      "X-Parse-Application-Id": "LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR",
      "X-Parse-REST-API-Key": "2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ descricao }),
  });
  btAdicionar.disabled = false;
  inputTarefa.value = "";
  inputTarefa.focus();
};

btCarregar.onclick = listarTarefas;
btAdicionar.onclick = adicionarTarefa;
