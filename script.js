const typesObj = {
    normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6, bug: 7, ghost: 8, steel: 9,
    fire: 10, water: 11, grass: 12, electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18
};
let dialogRef = document.getElementById('dialog');
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/';
const pokeSpecies = 'pokemon-species/';

let id;
let curOffset = 0;
let limit = 20;
let pokeFetchJson = [];
let pokeEvoChainFetchJson = []
let pokedex = [];
let pokedexEvoChain = [];

// const pokeEvolution = 'evolution-chain/';

// "next": "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20",
// "first/current": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
// "previous": "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
// const typeIconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png`;


let spinnerRef = document.getElementById('spinner')
let mainCardsRef = document.getElementById('mainCards');


async function init(curOffset) {
    mainCardsRef.innerHTML = '';
    toggleLoadingSpinner();
    await fetchPokemonJson(curOffset);
    pushFetchToPokedex(curOffset);
    toggleLoadingSpinner();
    renderPokemon(curOffset);

}



// Möglichkeit 1: globale Library, alle Daten rein fetch'n
// Moglichkeit 2: nur fetchen, wenn benötigt wird
//                wenn Modal öffnen, dann Daten g'fetch'd

// ---Prio1--- //
// fetch Detail for Modal view
//      save fetch'd data in pokeDetailsFetchJson 
//      save in -> pokedexDetails
// save to local storage
// check, if pokemon @pokedex + @pokedexDetails -> before fetch new
// ---Prio2--- //
// load next
// load prev
// style next/prev button
//      cursor:pointer;
// add next + prev Button in Modal
//      based of the PokeNumber

function toggleLoadingSpinner() {
    document.getElementById('spinner').classList.toggle('d_none');
}

async function fetchPokemonJson(curOffset) {
    try {
        for (let i = curOffset; i < (curOffset + limit); i++) {
            let id = i + 1;
            let [pokemonRes, speciesRes] = await Promise.all([
                fetch(BASE_URL + pokemon + id),
                fetch(BASE_URL + pokeSpecies + id)
            ]);

            let [pokemonJson, speciesJson] = await Promise.all([
                pokemonRes.json(),
                speciesRes.json()
            ]);
            pokeFetchJson.push({
                pokemon: pokemonJson,
                species: speciesJson
            });
        }
    } catch (error) {
        console.error("Console.error message:", error)
    }
    return pokeFetchJson;
}

function nextSetOfPokemon(nextOffset) {
    curOffset += nextOffset;
    init(curOffset)
}
// function prevSetOfPokemon(nextOffset){
//     if (curOffset -= nextOffset <= 0) {
//         curOffset = 0;
//         prevButton = document.getElementById('btn_prev').disabled = true;
//     } else {
//         curOffset -= nextOffset;
//     };
//     init(curOffset)
// }

function pushFetchToPokedex(curOffset) {
    for (let i = curOffset; i < pokeFetchJson.length; i++) {
        let pokeBaseData = pokeFetchJson[i];
        if (pokedex.some(item => item.name === pokeBaseData.pokemon.name)) {
            console.log(`Achtung: ${pokeBaseData.pokemon.name} ist schon im Pokedex`);
            continue;
        }
        pokedex.push(jsonToPokedexData(pokeBaseData))
    }
    return pokedex;
}

function jsonToPokedexData(pokeBaseData) {
    return {
        id: pokeBaseData.pokemon.id,
        name: pokeBaseData.pokemon.name,
        sprites: pokeBaseData.pokemon.sprites.other["official-artwork"].front_default,
        abilities: pokeBaseData.pokemon.abilities,
        types: pokeBaseData.pokemon.types,
        stats: pokeBaseData.pokemon.stats,
        weight: pokeBaseData.pokemon.weight,
        height: pokeBaseData.pokemon.height,
        descr_EN: pokeBaseData.species.flavor_text_entries[0].flavor_text.replace(/[\n\f]/g, " "),
        evoChainLink: pokeBaseData.species.evolution_chain.url,
        allNames: pokeBaseData.species.names
    };
}

function renderPokemon(curOffset) {
    for (let i = curOffset; i < pokedex.length; i++) { // works for +20,
        // but works NOT for -20
        mainCardsRef.innerHTML += getMainCardsHtml(i);
    }
}

function renderPokeName(i) {
    return pokedex[i].name.charAt(0).toUpperCase() + pokedex[i].name.slice(1)
}

function renderPokeAbilities(i, n) {
    let abilityName = pokedex[i].abilities[n].ability.name
    return abilityName.charAt(0).toUpperCase() + abilityName.slice(1)
}

function renderTypeImg(i) {
    let pokeTypeImg = "";
    for (let k = 0; k < pokedex[i].types.length; k++) {
        for (const key in typesObj) {
            if (key === pokedex[i].types[k].type.name) {
                pokeTypeImg += getPokeTypeHtml(key, i, k)
            }
        }
    }
    return pokeTypeImg;
}

function findNumberOfTypesObj(i) {
    for (const key in typesObj) {
        if (key === pokedex[i].types[0].type.name) {
            return typesObj[key]
        }
    }
}


function openDialog(i) {
    dialogRef.showModal();
    dialogRef.innerHTML = getDialogCardHtml(i);
    toggleDialogStyling('hidden');
}
function closeDialog() {
    dialogRef.close();
    toggleDialogStyling('scroll');
}

function toggleDialogStyling(scrollBehaviour) {
    dialogRef.classList.toggle('opened');
    document.body.style.overflowY = scrollBehaviour;
    dialogRef.querySelectorAll('.pokeType').forEach(img => { img.classList.toggle('pokeTypeModal') })
}

///////
function saveToLocalStorage() {
    localStorage.setItem('pokedex', JSON.stringify(pokedex))
}

function loadFromLocalStorage() {
    let pokedexLoadFromLocal = JSON.parse(localStorage.getItem('pokedex'))
    if (pokedexLoadFromLocal !== null) {
        pokedex = pokedexLoadFromLocal;
    }
}


// async function fetchPokemonDetailsJson(i) {
//     try {
//         let id = i + 1;
//         let pokemonDetailData = await fetch(BASE_URL + pokeSpecies + id)
//         pokeDetailsFetchJson.push(await pokemonDetailData.json());

//     } catch (error) {
//         console.error("Console.error fetchPokemonDetailsJson message:", error)
//     }
//     return pokeDetailsFetchJson;
// }




// async function fetchPokemonBaseData(curOffset) {
//     try {
//         let allRequests = [];

//         for (let i = 1 + curOffset; i <= 20 + curOffset; i++) {
//             const pokeFetchArr = [
//                 fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`),
//                 fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}/`)
//             ];
//             allRequests.push(Promise.allSettled(pokeFetchArr));
//         }

//         let results = await Promise.all(allRequests);
        
//         let errors =[];

//         results.forEach((res, index) => {
//             const id = index + 1 + curOffset;

//             res.forEach((r,idx) => {
//                 if (r.status === "rejected") {
//                     errors.push(`Achtung: Fehler bei ID = ${id}, Request# ${idx + 1}: ${r.reason}`);
//                 }
//             });

//             const fetchSuccessArray = res
//                 .filter(obj => obj.status === "fulfilled")
//                 .map(obj => obj.value);

//             if (fetchSuccessArray.length === 0) {
//                 console.warn(`Achtung: Keine Daten für ID = ${id}`);
//                 return;
//             }

//             Promise.all(fetchSuccessArray.map(item => item.json()))
//                 .then(data => pokeDetailsFetchJson.push(data))
//                 .catch(err => console.error(`Fehler beim JSON-Parse für ID=${id}:`, err));
//         });

//     } catch (err) {
//         console.error("message:", err);
//     }

//     console.log(pokeDetailsFetchJson);
// }


