const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/';
const pokeSpecies = 'pokemon-species/';
const pokeEvolution = 'evolution-chain/';

let mainCardsRef = document.getElementById('mainCards');

let curOffset = 0;
let pokemonDataAsJson = {};

function init() {
    // fetchPokemonJson();
}

async function fetchPokemonJson(params = null) {
    let pokemonData = await fetch(BASE_URL + pokemon + `?offset=${curOffset}&limit=20`);
    pokemonDataAsJson = await pokemonData.json();
    console.log(pokemonDataAsJson);
    renderPokemonWithLimit(pokemonDataAsJson);
}

function renderPokemonWithLimit(pokemonDataAsJson) {
    mainCardsRef.innerHTML = '';
    for (let i = 0; i < pokemonDataAsJson.results.length; i++) {
        // console.log(pokemonDataAsJson.results[i])
        let item = pokemonDataAsJson.results[i];
        mainCardsRef.innerHTML += getMainCardsHtml(i, item);
    }
}

