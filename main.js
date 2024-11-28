// afficher les 20permier pokemon 20/page
//ajoute un bouton suivant et precedant pour navigué entre les differente page pokemon
// losr d'un click de pokemon faire une fiche detaillé de
// son nom, son image, ses type et ces carateristique
// faire une barre de recherche qui permet de recherché un pokemon en particulier
// si le pokemon existe affiché qui lui sur la page, si il n'existe pas afficher un message d'erreur clair
// Ajouter un bouton de favoris sur chaque fiche pokemon de pouvoir l'ajouter et de le supprimer
// retourné un message d'erreur si un probleme de connexion avec l'api occure
// gerer les requetes incorrect ou pokemon non existant
// les contraintes utiliser fetch pour gerer les requetes avec async/await et capturer les erreurs via try/catch
// concevoir une intervace simple et fonctionnelle avec grid (5x4)
// enregister les favoris dans le localStorage pour persister aprés un rechargement de la page
// tous ça avec seulement 1page 
// afficher/masquer dynamiquement les sections avec JS



const pokemonList = document.querySelector('.pokemon-list');
const pokemonPerPage = 20;
let currentPage = 1;
const searchInput = document.querySelector("#search-input");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
let totalPages = 45;

async function fetchPokemon(page = 1) {
    try {
        const offset = (page -1) * pokemonPerPage; // formule qui calcule par ou il faut commencer a generer les pokemons dans la page
        const response = await fetch (`https://pokebuildapi.fr/api/v1/pokemon`);

       if (!response.ok) {
            throw new error ('Erreur de connexion a l\'API');
       }
       const allPokemons = await response.json(); //converti en JSON
       console.log(allPokemons)
       const pokemonsForCurrentPage = allPokemons.slice(offset, offset + pokemonPerPage); // selectionne uniquement les pokemons sur la page selectionner
       displayPokemons(pokemonsForCurrentPage); // affiche les pokemons actuel dans la page
       updatePaginationButtons(allPokemons.length); // mise a jour des boutons de navigation en fonction du nombre total de pokemon
    } catch (error) {
        displayError("Erreur lost du chargement des pokemons");
    }
}

function displayPokemons(pokemons) {
    pokemonList.innerHTML = '';
    
    pokemons.forEach(pokemon => {
        const pokemonCard = document.createElement('div'); //pour chaque pokemon crée une carte (div)
        pokemonCard.classList.add('pokemon-card');
        
        pokemonCard.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <button class="favorite-btn">❤️</button>
        `;
        
        pokemonList.appendChild(pokemonCard); //ajoute chaque carte dans la liste
    });
}

function displayError(message) {
    pokemonList.innerHTML = `
        <div class="error-message">${message}</div>
    `;
}

function updatePaginationButtons(totalPokemons) {
    const totalPages = Math.ceil(totalPokemons / pokemonPerPage); // calcule le nombre de page total necessaire pour afficher tous les pokemons si il y a 151 pokemon et 20 par pages cela donne 151/20 = 7.55 donc 8pages
    prevButton.disabled = currentPage === 1; // desactive le bouton precedent si on est sur la page 1
    nextButton.disabled = currentPage === totalPages; // desactive le bouton suivant si on est sur la derniere page
}
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemon(currentPage);
    }
});
nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchPokemon(currentPage);
    }
});
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim(); // recupere le texte saisie le met en minuscule et supprime les espaces au debut et a la fin
    if (searchTerm === '') { // verifie si la barre de recherche est vide
        fetchPokemon(currentPage); // pour retourner a la page 1 si la barre de recherche est vide
        return;
    }
    searchPokemon(searchTerm);
});

async function searchPokemon(searchTerm) {
    try {
        const response = await fetch (`https://pokebuildapi.fr/api/v1/pokemon`);
        if (!response.ok) {
            throw new Error('Erreur de connexion de l\'API');
        }
        const allPokemons = await response.json(); // converti en JSON
        const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm) // crée un filtre pour trouver le pokemon avec le nom saisie
    );
    if (filteredPokemons.length === 0) { // verifie si il n'y a pas de pokemon avec le nom saisie
        displayError('Aucun pokemon trouvé avec ce nom');
    } else {
        displayPokemons(filteredPokemons); // affiche les pokemon trouvé
    }
    } catch (error) {
        displayError('Erreur lors de la recherche du pokemon');
    }
}
fetchPokemon();
