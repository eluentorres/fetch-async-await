const container = document.getElementById("favoritesApp");

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function renderFavorites() {
  const favorites = getFavorites();

  container.innerHTML = "";
   if (favorites.length === 0) {
container.innerHTML = `
  <div class="empty-state">
    <img src="./assets/img/pokeball.png" alt="Poké Ball" class="empty-pokeball">
    <p class="pokemon-message">
      No tienes Pokémon favoritos aún???
    </p>
  </div>
`;


    return;
  }

  favorites.forEach(pokemon => {
    const card = document.createElement("div");

    card.style.background = "white";
    card.style.padding = "10px";
    card.style.borderRadius = "10px";
    card.style.width = "150px";
    card.style.textAlign = "center";
    card.style.margin = "10px";

    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.image}" />
      <p>#${pokemon.id}</p>
      <button class="remove-btn">❌ Eliminar</button>
    `;

    // ❌ eliminar favorito
    card.querySelector(".remove-btn").addEventListener("click", () => {
      let updated = favorites.filter(p => p.id !== pokemon.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      renderFavorites();
    });

    container.appendChild(card);
  });
}

renderFavorites();