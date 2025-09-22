const typesObj = {
    normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6, bug: 7, ghost: 8, steel: 9,
    fire: 10, water: 11, grass: 12, electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18
};
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/'; // max count 1302 (2025.09)
const pokeSpecies = 'pokemon-species/';
const pokeEvoChain = 'evolution-chain/'; // max count 541 (2025.09)
let curOffset = 0;
let evoOffset = 0;
let limit = 20;
let pokeFetchJson = [];
let pokedex = [];
let tempPokeEvoChainNr = [];
let pokeEvoChainFetchJson = [];
let evoChain = [];

let dialogRef = document.getElementById('dialog');
let spinnerRef = document.getElementById('spinner')
let mainCardsRef = document.getElementById('mainCards');


async function init(curOffset) {
    mainCardsRef.innerHTML = '';
    toggleLoadingSpinner();
    await fetchPokemonJson(curOffset);
    pushJsonToArray(curOffset, pokeFetchJson, pokedex);
    toggleLoadingSpinner();
    renderPokemon(curOffset);
    createTempPokeEvoChainNr(curOffset);
    await fetchEvoChainJson(evoOffset);
    pushJsonToArray(evoOffset, pokeEvoChainFetchJson, evoChain);
    evoOffset = tempPokeEvoChainNr.length;
}


// ---Prio1--- //
// add next + prev Button in Modal
//      based of the PokeNumber


// ---Prio2--- //
// save to local storage
// // check, if pokemon @pokedex + @evoChain / localStorage (save to localStorage) -> before fetch new


function toggleLoadingSpinner() {
    document.getElementById('spinner').classList.toggle('d_none');
}

async function fetchPokemonJson(curOffset) {
    try {
        for (let i = curOffset; i < (curOffset + limit); i++) {
            let id = i + 1;
            await fetchAndPushToArr(id);
        }
    } catch (error) {
        console.error("fetch Pokemon + Species:", error)
    }
    return pokeFetchJson;
}

async function fetchEvoChainJson() {
    try {
        for (let i = 0; i < tempPokeEvoChainNr.length; i++) {
            let id = tempPokeEvoChainNr[i];
            let evoChainRes = await fetch(BASE_URL + pokeEvoChain + id);
            let evoChainJson = await evoChainRes.json()
            pokeEvoChainFetchJson.push({ evoChain: evoChainJson })
        }
    } catch (error) {
        console.error("fetch evoChain:", error)
    }
    return pokeEvoChainFetchJson;
}

async function fetchAndPushToArr(id) {
    let [pokemonRes, speciesRes] = await Promise.all([
        fetch(BASE_URL + pokemon + id),
        fetch(BASE_URL + pokeSpecies + id)
    ]);
    let [pokemonJson, speciesJson] = await Promise.all([
        pokemonRes.json(),
        speciesRes.json()
    ]);
    pushRawDataToJsonArr(pokemonJson, speciesJson);
}

function pushRawDataToJsonArr(pokemonJson, speciesJson) {
    pokeFetchJson.push({
        pokemon: pokemonJson,
        species: speciesJson
    });
}

function pushJsonToArray(offset, origin, destination) {
    for (let i = offset; i < origin.length; i++) {
        if (destination === pokedex) {
            if (destination.some(item => item.name === origin[i].pokemon.name)) {
                continue;
            }
            destination.push(jsonToPokedexData(origin[i]))
        } else if (destination === evoChain) {
            if (destination.some(item => item.name0 === origin[i].evoChain.chain.species.name)) {
                continue;
            }
            destination.push(pushEvoChainFetchToEvoChain(origin[i]))
        }
    }
    return destination;
}

function jsonToPokedexData(pokeFetchJson) {
    return {
        id: pokeFetchJson.pokemon.id,
        name: pokeFetchJson.pokemon.name,
        sprites: pokeFetchJson.pokemon.sprites.other["official-artwork"].front_default,
        abilities: pokeFetchJson.pokemon.abilities,
        types: pokeFetchJson.pokemon.types,
        stats: pokeFetchJson.pokemon.stats,
        weight: pokeFetchJson.pokemon.weight,
        height: pokeFetchJson.pokemon.height,
        descr_EN: pokeFetchJson.species.flavor_text_entries.find(item => item.language.name === "en").flavor_text.replace(/[\n\f]/g, " "),
        evoChainLink: pokeFetchJson.species.evolution_chain.url,
        allNames: pokeFetchJson.species.names
    };
}

function createTempPokeEvoChainNr(curOffset) {
    let array = [];
    for (let i = curOffset; i < (curOffset + limit); i++) {
        array.push(parseInt(pokedex[i].evoChainLink.slice(42)));
    }
    let identSet = new Set(array);
    tempPokeEvoChainNr = [...identSet];
    return tempPokeEvoChainNr;
}

function pushEvoChainFetchToEvoChain(pokeEvoChainFetchJson) {
    let evoChainObj = { id: pokeEvoChainFetchJson.evoChain.id };
    let current = pokeEvoChainFetchJson.evoChain.chain;
    let index = 0;

    while (current) {
        evoChainObj[`lv${index}`] = current.evolution_details?.[0]?.min_level ?? null
        evoChainObj[`name${index}`] = current.species.name;
        evoChainObj[`name${index}Url`] = namesToImageUrl(current.species.name);
        current.evolves_to && current.evolves_to.length > 0 ? current = current.evolves_to[0] : current = null;
        index++;
    }
    return evoChainObj;
}

function namesToImageUrl(name) {
    for (let j = 0; j < pokedex.length; j++) {
        if (pokedex[j].name === name) {
            return pokedex[j].sprites;
        }
    }
}

function nextSetOfPokemon(offset) {
    curOffset += offset;
    document.getElementById('btn_prev').disabled = false;
    init(curOffset)                                         // TO BE UPDATED (!) // ATTENTION: when previous + next: double fetch
}

function prevSetOfPokemon(offset){
    curOffset -= offset;
    if (curOffset === 0) {
        document.getElementById('btn_prev').disabled = true;
    }
    if (curOffset < 0){
        curOffset = 0;
        return;
    }
    mainCardsRef.innerHTML = '';
    renderPokemon(curOffset)
}

function renderPokemon(curOffset) {
    for (let i = curOffset; i < (curOffset + limit); i++) { 
        let pokeEvoChainNr = parseInt(pokedex[i].evoChainLink.slice(42))
        mainCardsRef.innerHTML += getMainCardsHtml(i, pokeEvoChainNr);
    }
}

function renderPokeName(i) {
    return pokedex[i].name.charAt(0).toUpperCase() + pokedex[i].name.slice(1)
}

function renderPokeAbilities(i) {
    let abilities = '';
    let length = pokedex[i].abilities.length
    if (length > 2) {
        for (let k = 0; k < 2; k++) {
            abilities += getPokeAbilities(i, k);
        }
    } else {
        for (let k = 0; k < length; k++) {
            abilities += getPokeAbilities(i, k);
        }
    }
    return abilities
}

function renderPokeEvoChain(pokeEvoChainNr) {
    let chainId = evoChain.find(item => item.id === pokeEvoChainNr);
    let evoChainHtml = "";
    for (let i in chainId) {
        switch (i) {
            case "name0":
                evoChainHtml += getPokeEvoChainNameOne(chainId);
                break;
            case "lv1":
                evoChainHtml += getPokeEvoChainLevelOne(chainId);
                break;
            case "name1":
                evoChainHtml += getPokeEvoChainNameTwo(chainId);
                break;
            case "lv2":
                evoChainHtml += getPokeEvoChainLevelTwo(chainId);
                break;
            case "name2":
                evoChainHtml += getPokeEvoChainNameThree(chainId);
                break;

            default:
                break;
        }
    }
    return evoChainHtml;
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

async function openDialog(i, pokeEvoChainNr) {
    dialogRef.showModal();
    dialogRef.innerHTML = getDialogCardHtml(i, pokeEvoChainNr);
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
// function saveToLocalStorage() {
//     localStorage.setItem('pokedex', JSON.stringify(pokedex))
// }

// function loadFromLocalStorage() {
//     let pokedexLoadFromLocal = JSON.parse(localStorage.getItem('pokedex'))
//     if (pokedexLoadFromLocal !== null) {
//         pokedex = pokedexLoadFromLocal;
//     }
// }


