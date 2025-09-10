const typesNameNr = [
    { normal: 1 }, { fighting: 2 }, { flying: 3 }, { poison: 4 }, { ground: 5 }, { rock: 6 }, { bug: 7 }, { ghost: 8 }, { steel: 9 },
    { fire: 10 }, { water: 11 }, { grass: 12 }, { electric: 13 }, { psychic: 14 }, { ice: 15 }, { dragon: 16 }, { dark: 17 }, { fairy: 18 }
]
let pokeFetchJson = [];
let pokedex = [];
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/';
const pokeSpecies = 'pokemon-species/';
const pokeEvolution = 'evolution-chain/';
let curOffset = 0;
let limit = 20;

// let mainCardsRef = document.getElementById('mainCards');

function init() {
    fetchPokemonJson();
    pushFetchToPokedex();
}

async function fetchPokemonJson() {
    try {
        for (let i = curOffset; i < limit; i++) {
            let id = i + 1;
            let pokemonData = await fetch(BASE_URL + pokemon + id);
            pokeFetchJson.push(await pokemonData.json());
        }
    } catch (err) {
        console.error("message:", err)
    }
}

function pushFetchToPokedex() {
    for (let i = 0; i < pokeFetchJson.length; i++) {
        if (pokedex.some(item => item.name === pokeFetchJson.name)) {
            return;
        }
        pokedex.push({
            id: pokeFetchJson[i].id,
            name: pokeFetchJson[i].name,
            sprites: pokeFetchJson[i].sprites.other["official-artwork"].front_default,
            abilities: pokeFetchJson[i].abilities,
            types: pokeFetchJson[i].types,
            stats: pokeFetchJson[i].stats,
            weight: pokeFetchJson[i].weight,
        })
    }
    console.log(pokedex);
}

function renderPokemonWithLimit(pokemonDataAsJson) {
    mainCardsRef.innerHTML = '';
    for (let i = 0; i < pokemonDataAsJson.results.length; i++) {
        // console.log(pokemonDataAsJson.results[i])
        let item = pokemonDataAsJson.results[i];
        mainCardsRef.innerHTML += getMainCardsHtml(i, item);
    }
}

// pokeFetchJson[i].types -> [1]...name = nr.
// const typeIconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png`;
