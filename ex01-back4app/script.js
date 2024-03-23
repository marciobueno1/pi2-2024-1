const olTarefas = document.getElementById("olTarefas");
const btCarregar = document.getElementById("btCarregar");

/*
curl -X GET \
-H "X-Parse-Application-Id: LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR" \
-H "X-Parse-REST-API-Key: 2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k" \
-G \
--data-urlencode "where={ \"concluida\":true,\"descricao\":\"A string\" }" \
https://parseapi.back4app.com/classes/Tarefa
*/
const getTarefas = async () => {
  const response = await fetch("https://parseapi.back4app.com/classes/Tarefa", {
    method: "GET",
    headers: {
      "X-Parse-Application-Id": "LXzh7fjlzQIIkqUCzg4zl7yfttXtgsOofUqeVpZR",
      "X-Parse-REST-API-Key": "2P5KVRTih4tegOxlzCPXbxUk1TMCKi932c4b6F6k",
    },
  });
  console.log("response", response);

  const data = await response.json();
  console.log("data", data);

  return data.results;
};

const listarTarefas = async () => {
  const listaTarefas = await getTarefas();
  olTarefas.innerHTML = "";
  for (let i = 0; i < listaTarefas.length; ++i) {
    const tarefa = listaTarefas[i];
    const li = document.createElement("li");
    const text = document.createTextNode(
      `${tarefa.descricao} - ${tarefa.concluida}`
    );
    li.appendChild(text);
    olTarefas.appendChild(li);
  }
};

btCarregar.onclick = () => {
  listarTarefas();
};
