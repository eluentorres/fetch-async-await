const API_URL = "https://pokeapi.co/api/v2/pokemon";

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const resetBtn = document.getElementById("resetBtn");

let offset = 0;
const limit = 10;


// OBTENER FAVORITOS


function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}


// AÑADIR / QUITAR FAVORITO


function toggleFavorite(pokemon) {
  let favorites = getFavorites();

  const exists = favorites.find((p) => p.id === pokemon.id);

  if (exists) {
    favorites = favorites.filter((p) => p.id !== pokemon.id);
  } else {
    favorites.push({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default,
    });
  }

  saveFavorites(favorites);
}


// FETCH POKEMONS


async function getPokemons() {
  try {
    app.innerHTML = "";

    const res = await fetch(
      `${API_URL}?limit=${limit}&offset=${offset}`
    );

    const data = await res.json();

    for (const pokemon of data.results) {
      const resPokemon = await fetch(pokemon.url);
      const dataPokemon = await resPokemon.json();

      renderPokemon(dataPokemon);
    }

  } catch (error) {
    showError("Error cargando Pokémon");
  }
}


// RENDER POKEMON


function renderPokemon(pokemon) {
  const card = document.createElement("div");

  card.classList.add("pokemon-card");

  const favorites = getFavorites();

  const isFavorite = favorites.some(
    (p) => p.id === pokemon.id
  );

  card.innerHTML = `
    <h3>${pokemon.name}</h3>

    <img 
      src="${pokemon.sprites.front_default}" 
      alt="${pokemon.name}"
    />

    <p>#${pokemon.id}</p>

    <button class="fav-btn">
      ${isFavorite ? "💔 Quitar" : "❤️ Favorito"}
    </button>
  `;


  // FAVORITOS


  card
    .querySelector(".fav-btn")
    .addEventListener("click", (e) => {

      e.stopPropagation();

      toggleFavorite(pokemon);

      getPokemons();
    });

  app.appendChild(card);
}


// BUSCAR POKEMON


async function searchPokemon() {
  const name = searchInput.value
    .toLowerCase()
    .trim();

  if (!name) return;

  try {
    app.innerHTML = "";

    const res = await fetch(
      `${API_URL}/${name}`
    );

    if (!res.ok) {
      throw new Error("Pokemon no encontrado");
    }

    const data = await res.json();

    renderPokemon(data);

  } catch (error) {
    showError("Pokemon no encontrado");
  }
}


// ERROR


function showError(message) {
  app.innerHTML = `
    <p class="error-message">
      ${message}
    </p>
  `;
}


// BOTONES


searchBtn.addEventListener(
  "click",
  searchPokemon
);

nextBtn.addEventListener("click", () => {
  offset += limit;

  getPokemons();
});

prevBtn.addEventListener("click", () => {
  if (offset > 0) {
    offset -= limit;

    getPokemons();
  }
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";

  offset = 0;

  getPokemons();
});




// ENTER SEARCH


searchInput.addEventListener(
  "keypress",
  (e) => {
    if (e.key === "Enter") {
      searchPokemon();
    }
  }
);


// INICIO APP


getPokemons();