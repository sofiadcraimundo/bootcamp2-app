// script.js
// Consome a API pública TheMealDB (não exige chave/autenticação)

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const area = document.getElementById("resultado");

async function buscarReceita(termo) {
  area.innerHTML = `<p class="carregando">Buscando receita...</p>`;

  try {
    const resposta = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termo)}`
    );

    if (!resposta.ok) {
      throw new Error("A API não respondeu corretamente.");
    }

    const dados = await resposta.json();

    if (!dados.meals) {
      area.innerHTML = `
        <p class="erro">😕 Nenhuma receita encontrada para "${termo}". Tente outro termo, como "chicken" ou "cake".</p>
      `;
      return;
    }

    const receita = dados.meals[0];
    exibirReceita(receita);

  } catch (erro) {
    area.innerHTML = `
      <p class="erro">⚠️ Não foi possível buscar a receita agora. Verifique sua conexão e tente novamente.</p>
    `;
    console.error("Erro ao buscar receita:", erro);
  }
}

function montarIngredientes(receita) {
  let itens = "";
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receita[`strIngredient${i}`];
    const medida = receita[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim() !== "") {
      itens += `<li>${medida ? medida.trim() : ""} ${ingrediente.trim()}</li>`;
    }
  }
  return itens;
}

function exibirReceita(receita) {
  const ingredientesHtml = montarIngredientes(receita);

  area.innerHTML = `
    <div class="card">
      <img src="${receita.strMealThumb}" alt="${receita.strMeal}">
      <div class="card-conteudo">
        <h2>${receita.strMeal}</h2>
        <div class="tags">
          <span class="tag">${receita.strCategory || "—"}</span>
          <span class="tag">${receita.strArea || "—"}</span>
        </div>

        <h3>Ingredientes</h3>
        <ul class="ingredientes">${ingredientesHtml}</ul>

        <h3>Modo de preparo</h3>
        <p class="instrucoes">${receita.strInstructions}</p>

        ${
          receita.strYoutube
            ? `<a class="video-link" href="${receita.strYoutube}" target="_blank">▶ Ver vídeo no YouTube</a>`
            : ""
        }
      </div>
    </div>
  `;
}

botaoBuscar.addEventListener("click", () => {
  const termo = campoBusca.value.trim();
  if (termo) {
    buscarReceita(termo);
  } else {
    area.innerHTML = `<p class="erro">Digite o nome de um prato para buscar.</p>`;
  }
});

campoBusca.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    botaoBuscar.click();
  }
});
