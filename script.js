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
    await fetchPokemonJson(0, 100);
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

function searchPokemon() {
    let input = document.getElementById('searchInput').value.trim().toLowerCase();
    if (input.length === 0) { window.location.reload(); }
    if (input.length < 3) { return; }
    let filteredPokedex = pokedex.filter(item => {
        if (item.name.toLowerCase().includes(input)) {
            return item;
        }
    })
    renderSearch(filteredPokedex, input);
}

function enter(event) {
    if (event.key === 'Enter') {
        searchPokemon();
        document.getElementById('searchInput').value = '';
    }
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

function showPrevTwenty() {
    let firstId = parseInt(PokeIdOnScreen('first'))
    if (firstId <= 21 || firstId === 10021) {
        document.getElementById('btn_prev').disabled = true;
    }
    mainCardsRef.innerHTML = '';
    renderPokemon(firstId - 21, firstId - 1)
}

async function showNextTwentyAndMoreTwenty(elem = null) {
    document.getElementById('searchInput').value = '';
    if (mainCardsRef.innerText.startsWith("No result")) {
        mainCardsRef.innerHTML = '';
        renderPokemon(0, 20);
    } else if (parseInt(PokeIdOnScreen('last')) % 20 !== 0) {
        roundToLastTwentyAndRender();
    } else {
        findLastIdOnScreenAndRenderNextTwenty(elem);
    }
    if (parseInt(PokeIdOnScreen('last')) >= pokedex.length - 20 || parseInt(PokeIdOnScreen('last')) <= pokedex) {
        await fetchPokemonJson(pokedex.length, pokedex.length + 100)
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
        document.getElementById('btn_prev').disabled = document.getElementById('btn_prev').ariaDisabled = false;
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

/**** FETCHes to ARRAYs ****/

// #region fetches

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

// #endregion