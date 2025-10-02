const typesObj = {
    normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6, bug: 7, ghost: 8, steel: 9,
    fire: 10, water: 11, grass: 12, electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18
};
const placeholder = ['min 3 character - Search', 'min 3 character - Name', 'min 3 character - Type']
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokemon = 'pokemon/'; // max count 1302 / 0-1025 + 10000-10277 (2025.09)
const pokeSpecies = 'pokemon-species/';
const pokeEvoChain = 'evolution-chain/'; // max count 541 (2025.09)
let from = 0;
let to = 20;
let pokedex = [];
let species = [];
let evoChain = [];

let spinnerRef = document.getElementById('spinner');
let mainCardsRef = document.getElementById('mainCards');
let dialogRef = document.getElementById('dialog');
let impressumRef = document.getElementById('impressum');

async function init() {
    toggleLoadingSpinner();
    disableButtons()
    await fetchPokemonJson(0, 20);
    toggleLoadingSpinner();
    renderPokemon(0, 20);
    enableButtons();
    changeSearchPlaceholder();
}

function toggleLoadingSpinner() {
    document.getElementById('spinner').classList.toggle('d_none');
}

// #region search

function searchPokemon() {
    let input = document.getElementById('searchInput').value.trim().toLowerCase();
    if (input.length === 0) {
        mainCardsRef.innerHTML = '';
        renderPokemon(0, 20);
    }
    if (input.length < 3) { return; }
    let filteredPokedex = pokedex.filter(item => {
        if (item.name.toLowerCase().includes(input) || item.types.find(item => item.type.name.includes(input))) {
            return item;
        }
    });
    renderSearch(filteredPokedex, input);
}

function changeSearchPlaceholder() {
    let input = document.getElementById('searchInput');
    let index = 0;
    setInterval(() => {
        input.setAttribute('placeholder', placeholder[index]);
        index = (index + 1) % placeholder.length;
    }, 2000);
}

function enter(event) {
    if (event.key === 'Enter') {
        searchPokemon();
        document.getElementById('searchInput').value = '';
    }
}

function clearAndSearch() {
    searchPokemon();
    document.getElementById('searchInput').value = '';
}

// #endregion

// #region buttons

function showPrevTwenty() {
    document.getElementById('searchInput').value = '';
    let firstId = parseInt(PokeIdOnScreen('first'))
    mainCardsRef.innerHTML = '';
    if (firstId >= 10000 && firstId < 10021) {
        renderPokemon(1006, 1025);
    } else if (firstId <= 21) {
        document.getElementById('btn_prev').disabled = true;
        renderPokemon(0, 20);
    } else {
        renderPokemon(firstId - 21, firstId - 1)
    }
}

async function showNextTwentyAndMoreTwenty(elem = null) {
    document.getElementById('searchInput').value = '';
    if (mainCardsRef.innerText.startsWith("No result")) {
        mainCardsRef.innerHTML = '';
        renderPokemon(0, 20);
    } else if (parseInt(PokeIdOnScreen('last')) % 20 !== 0) {
        await roundToLastTwentyAndRender();
    } else {
        await findLastIdOnScreenAndRenderNextTwenty(elem);
    }
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

// #endregion

// #region Dialog functions

async function openDialog(id, event, toggleStyling = null) {
    event.stopPropagation();
    document.getElementById('searchInput').value = '';
    await fetchSpecies(id);
    rebuildPokedex(id);
    await fetchEvoChainJson(id);
    dialogRef.showModal();
    let index = pokedex.indexOf(pokedex.find(i => i.id === id));
    dialogRef.innerHTML = getDialogCardHtml(index);
    if (toggleStyling === 'yes') {
        toggleDialogStyling('hidden');
    }
}

function toggleDialogStyling(scrollBehaviour) {
    dialogRef.classList.toggle('opened');
    impressumRef.classList.toggle('opened')
    document.body.style.overflowY = scrollBehaviour;
    dialogRef.querySelectorAll('.pokeType').forEach(img => { img.classList.toggle('pokeTypeModal') })
}

async function prevNextPokemonDialog(id, event) {
    event.stopPropagation();
    if (id > pokedex[pokedex.length - 1].id - 1) {
        id = 1;
    } else if (id < 1) {
        id = pokedex[pokedex.length - 1].id;
    }
    await openDialog(id, event);
}

function closeDialog() {
    dialogRef.close();
    impressumRef.close();
    toggleDialogStyling('scroll');
}

function showTab(name) {
    let tab = document.getElementsByClassName('tab');
    for (let i = 0; i < tab.length; i++) {
        tab[i].style.display = "none";
        tab[i].ariaSelected = "false";
    }
    document.getElementById(name).style.display = "block";
    document.getElementById(name).ariaSelected = "true";
}

function openImpressum() {
    impressumRef.showModal();
    impressumRef.innerHTML = getImpressumHtml();
    toggleDialogStyling('hidden');
}

// #endregion

// #region fetches

async function fetchPokemonJson(from, to) {
    try {
        for (let i = from; i < to; i++) {   // i auf Array.Länge
            let id = i + 1;
            let pokemonRes = await fetch(BASE_URL + pokemon + id);
            let pokemonJson = await pokemonRes.json();
            jsonToPokedex(pokemonJson)
        }

    } catch (error) {
        console.error("fetch Pokemon + Species:", error)
    }
    return pokedex;
}

function jsonToPokedex(pokemonJson) {
    pokedex.push({
        id: pokemonJson.id,
        name: pokemonJson.name,
        sprites: pokemonJson.sprites.other["official-artwork"].front_default,
        abilities: pokemonJson.abilities,
        types: pokemonJson.types,
        stats: pokemonJson.stats,
        weight: pokemonJson.weight,
        height: pokemonJson.height,
    });
}

async function fetchSpecies(id) {
    let speciesRes = await fetch(BASE_URL + pokeSpecies + id);
    let speciesJson = await speciesRes.json();
    species.push({
        id: speciesJson.id,
        evoChainId: parseInt(speciesJson.evolution_chain.url.slice(42)),
        description: speciesJson.flavor_text_entries.find(item => item.language.name === "en").flavor_text.replace(/[\n\f]/g, " "),
        evoChainLink: speciesJson.evolution_chain.url
    })
    return species
}

function rebuildPokedex(id) {
    let pokedexId = pokedex.find(i => i.id === id);
    let speciesId = species.find(i => i.id === id);
    let newPokedexEntry = {};
    if (speciesId && pokedexId) {
        newPokedexEntry = combineSpeciesToPokedex(newPokedexEntry, pokedexId, speciesId);
        combinePokedex(newPokedexEntry)
    } else {
        console.error('Error at speciesId creation.')
    }
}

function combineSpeciesToPokedex(newPokedexEntry, pokedexId, speciesId) {
    newPokedexEntry = {
        id: pokedexId.id,
        name: pokedexId.name,
        sprites: pokedexId.sprites,
        abilities: pokedexId.abilities,
        types: pokedexId.types,
        stats: pokedexId.stats,
        weight: pokedexId.weight,
        height: pokedexId.height,
        evoChainId: speciesId.evoChainId,
        description: speciesId.description,
        evoLink: speciesId.evoChainLink,
    };
    return newPokedexEntry;
}

function combinePokedex(newPokedexEntry) {
    let pokemon = pokedex.find(p => p.id === newPokedexEntry.id);
    let pokedexPos = pokedex.indexOf(pokemon);
    pokedex[pokedexPos] = newPokedexEntry;
    return pokedex;
}

async function fetchEvoChainJson(id) {
    try {
        let speciesId = species.find(i => i.id === id);
        let evoChainId = speciesId.evoChainId;
        let evoRes = await fetch(BASE_URL + pokeEvoChain + evoChainId);
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