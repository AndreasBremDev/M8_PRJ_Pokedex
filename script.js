const typesNameNr = {
    normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6, bug: 7, ghost: 8, steel: 9,
    fire: 10, water: 11, grass: 12, electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18
};
let dialogRef = document.getElementById('dialog');
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/';
// const pokeSpecies = 'pokemon-species/';
// const pokeEvolution = 'evolution-chain/';

// "next": "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20",
// "first/current": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
// "previous": "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",

let curOffset = 0;
let limit = 20;
let pokeFetchJson = [];
let pokeFetchJsonData2 = []
let pokedex = [];
let pokeEvoChainAndText = [];

let spinnerRef = document.getElementById('spinner')
let mainCardsRef = document.getElementById('mainCards');



// Möglichkeit 1: globale Library, alle Daten rein fetch'n
// Moglichkeit 2: nur fetchen, wenn benötigt wird
// wenn Modal öffnen, dann Daten g'fetch'd


async function init() {
    toggleLoadingSpinner();
    await fetchPokemonJson();
    pushFetchToPokedex();
    toggleLoadingSpinner();
    renderPokemon();

    
}

function toggleLoadingSpinner(){
    document.getElementById('spinner').classList.toggle('d_none');
}

async function fetchPokemonJson() {
    try {
        for (let i = curOffset; i < limit; i++) {
            let id = i + 1;
            let pokemonData = await fetch(BASE_URL + pokemon + id); // pokemonInformation() {fetch(1, 2, 3)}) -> ACHTUNG Format
            pokeFetchJson.push(await pokemonData.json());
        }
    } catch (err) {
        console.error("message:", err)
    }
    return pokeFetchJson;
}

function pushFetchToPokedex() {
    for (let i = 0; i < pokeFetchJson.length; i++) {
        if (pokedex.some(item => item.name === pokeFetchJson.name)) {
            return;
        }
        pokedex.push(jsonToPokedexData(i))
    }
    return pokedex;
}

function jsonToPokedexData(i) {
    return {
        id: pokeFetchJson[i].id,
        name: pokeFetchJson[i].name,
        sprites: pokeFetchJson[i].sprites.other["official-artwork"].front_default,
        abilities: pokeFetchJson[i].abilities,
        types: pokeFetchJson[i].types,
        stats: pokeFetchJson[i].stats,
        weight: pokeFetchJson[i].weight,
    };
}

function renderPokemon() {
    mainCardsRef.innerHTML = '';
    for (let i = 0; i < pokedex.length; i++) {
        mainCardsRef.innerHTML += getMainCardsHtml(i);
    }
}

function renderPokeName(i) {
    return pokedex[i].name.charAt(0).toUpperCase() + pokedex[i].name.slice(1)
}

function openDialog(i){
    dialogRef.showModal();
    dialogRef.innerHTML = getDialogCardHtml(i);
    toggleDialogStyling('hidden')
}
function closeDialog(){
    dialogRef.close();
    toggleDialogStyling('scroll')
}

function toggleDialogStyling(scrollBehaviour){
    dialogRef.classList.toggle('opened');
    document.body.style.overflowY = scrollBehaviour;
    dialogRef.querySelectorAll('.pokeType').forEach(img => { img.classList.toggle('pokeTypeModal')})
}

function renderTypeImg(i){
    // console.log(pokedex[i].types[0].length);
    let pokeTypeImg = "";
    for (let k = 0; k < pokedex[i].types.length; k++) {
        for (const key in typesNameNr) {
            if (key === pokedex[i].types[k].type.name) {
                pokeTypeImg += getPokeTypeHtml(key, i, k)
            }
        }  
    }
    return pokeTypeImg;
}




// pokeFetchJson[i].types -> [1]...name = nr.
// const typeIconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png`;



    // await fetchEvoChainAndText();
    // console.log("pokeFetchJsonData2: ", pokeFetchJsonData2);
    
// const fetchArray = [
//     fetch('https://pokeapi.co/api/v2/pokemon-species/'),
//     fetch('https://pokeapi.co/api/v2/evolution-chain/'),
// ]

// async function fetchEvoChainAndText() {
//     try {
//         const res = await Promise.allSettled(fetchArray);
//         const fetchSuccessArray = [];
//         res.map(obj => {
//             checkStatusIsFulfilled(obj, fetchSuccessArray);
//         });
//         checkLength(fetchSuccessArray);

//         const data = await Promise.all(fetchSuccessArray.map((item) => {
//             return item.json();
//         }));
//         pokeFetchJsonData2.push(data)
//         // console.log(data);
        
//     } catch (err) {
//         console.error("message:", err)
//     }
//     return pokeFetchJsonData2
// }

// function checkStatusIsFulfilled(obj, fetchSuccessArray) {
//     if (obj.status === 'fulfilled') {
//         fetchSuccessArray.push(obj.value);
//     }
// }

// function checkLength(fetchSuccessArray) {
//     if (fetchSuccessArray.length === 0) {
//         throw new Error("All fetches failes.");
//     }
// }