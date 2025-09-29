const typesObj = {
    normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6, bug: 7, ghost: 8, steel: 9,
    fire: 10, water: 11, grass: 12, electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18
};
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/'; // max count 1302 / 0-1025 + 10000-10277 (2025.09)
const pokeSpecies = 'pokemon-species/';
const pokeEvoChain = 'evolution-chain/'; // max count 541 (2025.09)
let from = 0;
let to = 20;
let pokedex = [];
let evoChain = [];

let spinnerRef = document.getElementById('spinner');
let mainCardsRef = document.getElementById('mainCards');
let dialogRef = document.getElementById('dialog');
let impressumRef = document.getElementById('impressum');

let myInterval;

async function init() {
    checkLengthAndRender(); // set interval()
    await fetchPokemonJson(0, 40);
}

function toggleLoadingSpinner() {
    document.getElementById('spinner').classList.toggle('d_none');
}

function checkLengthAndRender() {
    mainCardsRef.innerHTML = '';
    toggleLoadingSpinner();
    myInterval = setInterval(() => {
        if (pokedex.length >= 20) {
            toggleLoadingSpinner();
            renderPokemon(0, 20);
            stopInterval();
        }
    }, 100)
}

function stopInterval() {
    clearInterval(myInterval);
}

function showPrevTwenty() {
    let firstId = parseInt(PokeIdOnScreen('first'))
    if (firstId <= 21 || firstId === 10021) {
        document.getElementById('btn_prev').disabled = true;
    }
    mainCardsRef.innerHTML = '';
    renderPokemon(firstId - 21, firstId - 1)
}

async function showNextTwentyAndMoreTwenty(elem = null) {
    disableButtons();
    let lastId = parseInt(PokeIdOnScreen('last'));
    from = lastId;
    to = lastId + 20;
    if (elem === 'next') { mainCardsRef.innerHTML = ''; }
    renderPokemon(from, to);
    if (to === pokedex.length) {
        await fetchPokemonJson(pokedex.length, pokedex.length + 40)
    }
    enableButtons();
}

function disableButtons() {
    document.getElementById(`btn_next`).disabled = document.getElementById(`btn_more`).disabled = true;
    for (let n = 1; n <= 2; n++) {
        document.getElementById(`smallSpinner${n}`).style.display = "flex";
    }
}

function enableButtons() {
    document.getElementById(`btn_next`).disabled = document.getElementById(`btn_more`).disabled = false;
    for (let n = 1; n <= 2; n++) {
        document.getElementById(`smallSpinner${n}`).style.display = "none";
    }
    let firstId = parseInt(PokeIdOnScreen('first'))
    if (firstId < 21 || firstId === 10021) {
        document.getElementById('btn_prev').disabled = true;
    } else {
        document.getElementById('btn_prev').disabled = false;
    }
}

function PokeIdOnScreen(firstLast) {
    let lastCard = document.querySelector(`#mainCards > div:${firstLast}-child`);
    let Id = lastCard.getAttribute('data-pokeId');
    return Id
}

async function openDialog(i, event) {
    event.stopPropagation();
    await fetchEvoChainJson(i);
    dialogRef.showModal();
    dialogRef.innerHTML = getDialogCardHtml(i);

}

async function prevNextPokemon(i, event) {
    event.stopPropagation();
    let lastId = parseInt(PokeIdOnScreen('last'));
    if (i > lastId - 1) {
        i = 0;
    } else if (i < 0) {
        i = lastId - 1;
    }
    await openDialog(i, event)
}

function closeDialog() {
    dialogRef.close();
    impressumRef.close();
    toggleDialogStyling('scroll');
}

function toggleDialogStyling(scrollBehaviour) {
    dialogRef.classList.toggle('opened');
    impressumRef.classList.toggle('opened')
    document.body.style.overflowY = scrollBehaviour;
    dialogRef.querySelectorAll('.pokeType').forEach(img => { img.classList.toggle('pokeTypeModal') })
}

function openImpressum() {
    impressumRef.showModal();
    impressumRef.innerHTML = getImpressumHtml();
}

function getCurRenderedCount() {
    return document.getElementsByClassName('mainCard').length;
}


/**** FETCHes to ARRAYs ****/

async function fetchPokemonJson(from, to) {
    try {
        for (let i = from; i < to; i++) {   // i auf Array.Länge
            let id = i + 1;
            await fetchAndPushToArr(id);
        }
    } catch (error) {
        console.error("fetch Pokemon + Species:", error)
    }
    return pokedex;
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
    jsonToPokedex(pokemonJson, speciesJson)
}

function jsonToPokedex(pokemonJson, speciesJson) {
    pokedex.push({
        id: pokemonJson.id,
        name: pokemonJson.name,
        allNames: speciesJson.names,
        sprites: pokemonJson.sprites.other["official-artwork"].front_default,
        abilities: pokemonJson.abilities,
        types: pokemonJson.types,
        stats: pokemonJson.stats,
        weight: pokemonJson.weight,
        height: pokemonJson.height,
        description: speciesJson.flavor_text_entries.find(item => item.language.name === "en").flavor_text.replace(/[\n\f]/g, " "),
        evoChainLink: speciesJson.evolution_chain.url,
        evoChainId: parseInt(speciesJson.evolution_chain.url.slice(42))
    });
}

async function fetchEvoChainJson(i) {
    try {
        let evoRes = await fetch(BASE_URL + pokeEvoChain + pokedex[i].evoChainId);
        let evoResJson = await evoRes.json()
        evoChain.push(await jsonToEvoChain(evoResJson))
    } catch (error) {
        console.error("fetch evoChain:", error)
    }
    return evoChain;
}

async function jsonToEvoChain(evoResJson) {
    let evoChainObj = { id: evoResJson.id };
    let current = evoResJson.chain;
    let index = 0;

    while (current) {
        evoChainObj[`lv${index}`] = current.evolution_details?.[0]?.min_level ?? null
        evoChainObj[`name${index}`] = current.species.name;
        evoChainObj[`name${index}Url`] = await namesToImageUrl(current.species.name);
        current.evolves_to && current.evolves_to.length > 0 ? current = current.evolves_to[0] : current = null;
        index++;
    }
    return evoChainObj;
}

async function namesToImageUrl(name) {
    let foundName = pokedex.find(item => item.name === name)
    if (foundName) {
        return foundName.sprites;
    } else {
        return await fetchPokemonImageByNameOrId(name);
    }
}

async function fetchPokemonImageByNameOrId(nameOrId) {
    let spriteUrl;
    try {
        let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        let resJson = await res.json();
        spriteUrl = resJson.sprites.other["official-artwork"].front_default
    } catch (error) {
        console.error("fetch sprite url:", error)
    }
    return spriteUrl;
}

function enter(event) {
    if (event.key === 'Enter') {
        searchPokemon()
    }
}


// SUCHE
// entweder: in API daten (fetch, über alle Pokemon, nur einen Wert)
// for (i = 0; i 1800, statt 1302, i++)
//let xyRes = await fetch(BASE_URL + pokeEvoChain + id);
// if ("xyRes" = null) {return}
// vergleich Input mit fetchJson.XXX.name
// push in z.B. SearchResultsArray

// DECISION: in Array
// Vergleich input mit Array (filter())


function searchPokemon() {
    let input = document.getElementById('searchInput').value.trim().toLowerCase();
    if (input.length === 0) {window.location.reload();}
    if (input.length < 3) {return;}
    let filteredPokedex = pokedex.filter(item => {
        if (item.allNames.some(entry=>entry.name.toLowerCase().includes(input))) {
            return item;
        }
    })
    renderSearch(filteredPokedex, input);
    // document.getElementById('searchInput').value = '';
}

function renderSearch(filteredPokedex, input) {
    mainCardsRef.innerHTML = '';
    if (filteredPokedex.length === 0) {
        mainCardsRef.innerHTML = getSearchErrorHtml(input);
    }
    for (let k = 0; k < filteredPokedex.length; k++) {
        let id = filteredPokedex[k].id
        let i = pokeIdToPokeIndex(id)
        mainCardsRef.innerHTML += getMainCardsHtml(i, filteredPokedex);
    }
}

function pokeIdToPokeIndex(id) {
    let i = pokedex.findIndex(item => item.id === id);
    return i;
}



