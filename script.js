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

// FETCHEN
// done: beim ersten Mal bis z.B. i < 40 Laden
// done: if (i <20) fetch + push array
// neu: wenn (i>=20), dann fetch + push array + render (setInterval) + fetch weitere 20.
// was passiert, wenn weitere 20 geladen, bzw. was wenn next-btn / more-btn, -> z.B. weitere 20 Laden
// ODER ALTERNATIV: 40 fetchen, aber nur 20 anzeigen

async function init() {
    mainCardsRef.innerHTML = ''; // Anfang egal. Optional weg lassen? // ACHTUNG: bei more()
    checkLengthAndRender(); // set interval()
    // toggleLoadingSpinner(); // zeig an, wenn i < 20 bzw. bei more, wenn nötig? (DA)
    await fetchPokemonJson(0, 40);
}

// showMore()
// Loading()
// render()
// loading()

// ---Prio1--- //
// add next + prev Button in Modal
//      based of the PokeNumber
// more button // ADJUSTMENT needed (!)


// Start
// Laden wir 40 Pokemon
//  -> Schleife immer 1 api.json => array.push
// speichern wir die lokal im array = (roh)pokeFetchJson
// 20 anzeigen 

function toggleLoadingSpinner() {
    document.getElementById('spinner').classList.toggle('d_none');
}

function checkLengthAndRender() { // läuft im Hintergrun kontinuierlich // muss beginnen vor Fetch
    toggleLoadingSpinner();
    myInterval = setInterval(() => {
        if (pokedex.length >= 20) {
            // pushJsonToArray(pokeFetchJson, pokedex);
            toggleLoadingSpinner();
            renderPokemon(0, 20);
            stopInterval();
        }
    }, 100)
}

function stopInterval() {
    clearInterval(myInterval);
}

async function nextSetOfPokemon() {
    let lastId = parseInt(PokeIdOnScreen('last'));
    console.log('from: ', lastId);
    to = lastId + 20;
    console.log('to: ', to);
    document.getElementById('btn_prev').disabled = false;
    mainCardsRef.innerHTML = '';
    renderPokemon(lastId, to);
    console.log('Pokedex.length: ', pokedex.length);
    if (to === pokedex.length) {
        await fetchPokemonJson(pokedex.length, pokedex.length + 40)
    }// TO BE UPDATED (!) // ATTENTION: when next + previous + next: double fetch
}

function prevSetOfPokemon() {
    let firstId = parseInt(PokeIdOnScreen('first'))
    if (firstId === 21 || firstId === 10021) {
        document.getElementById('btn_prev').disabled = true;
    }
    mainCardsRef.innerHTML = '';

    renderPokemon(firstId - 21, firstId - 1)
}

function PokeIdOnScreen(firstLast) {
    let lastCard = document.querySelector(`#mainCards > div:${firstLast}-child`);
    let Id = lastCard.getAttribute('data-pokeId');
    return Id
}

async function showPlusTwentyMore() {
    // let firstId = parseInt(PokeIdOnScreen('first'))
    let lastId = parseInt(PokeIdOnScreen('last'));
    from = lastId
    to = lastId + 20;
        console.log('from: ', from);
    console.log('to: ', to);
    console.log('Pokedex.length: ', pokedex.length);
    // no emptying: mainCardsRef.innerHTML = '';
    renderPokemon(from, to);
    if (to === pokedex.length) {
        await fetchPokemonJson(pokedex.length, pokedex.length + 40)
    }
}

async function prevNextPokemon(i, event) {
    if (i > pokedex.length - 1) {
        i = 0;
    } else if (i < 0) {
        i = pokedex.length - 1;
    }
    await openDialog(i, event)
}

async function openDialog(i, event) {
    event.stopPropagation();
    await fetchEvoChainJson(i);
    dialogRef.showModal();
    dialogRef.innerHTML = getDialogCardHtml(i);

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

function comparePokedexWithPokeFetchJson() {

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
    pokedex.push({ //was: return `
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




// SUCHE
// entweder: in API daten (fetch, über alle Pokemon, nur einen Wert)
// for (i = 0; i 1800, statt 1302, i++)
//let xyRes = await fetch(BASE_URL + pokeEvoChain + id);
// if ("xyRes" = null) {return}
// vergleich Input mit fetchJson.XXX.name
// push in z.B. SearchResultsArray
// oder: in Array
// Vergleich input mit Array (filter())



// ---OPTIONAL--- //
// save to local storage // eher nicht.
// // check, if pokemon @pokedex + @evoChain / localStorage (save to localStorage) -> before fetch new

// function saveToLocalStorage() {
//     localStorage.setItem('pokedex', JSON.stringify(pokedex))
// }

// function loadFromLocalStorage() {
//     let pokedexLoadFromLocal = JSON.parse(localStorage.getItem('pokedex'))
//     if (pokedexLoadFromLocal !== null) {
//         pokedex = pokedexLoadFromLocal;
//     }
// }


