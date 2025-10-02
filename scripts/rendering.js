function renderPokemon(from, to) {
    for (let i = from; i < to; i++) {
        mainCardsRef.innerHTML += getMainCardsHtml(i);
    }
}

async function roundToLastTwentyAndRender() {
    let lastId = parseInt(PokeIdOnScreen('last'));
    from = (Math.ceil(lastId / 20) * 20) - 20;
    to = from + 20;
    mainCardsRef.innerHTML = '';
    await fetchAndRenderPlusButtons();
}

async function fetchAndRenderPlusButtons() {
    disableButtons();
    if (pokedex.find(i => i.id === from && pokedex.find(j => j.id === to))) {
        renderPokemon(from, to);
    } else {
        await fetchPokemonJson(from, to);
        renderPokemon(from, to);
    }
    enableButtons();
}

async function findLastIdOnScreenAndRenderNextTwenty(elem) {
    let lastId = parseInt(PokeIdOnScreen('last'));
    from = lastId;
    to = lastId + 20;
    if (elem === 'next') { mainCardsRef.innerHTML = ''; }
    await fetchAndRenderPlusButtons();
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

function renderPokeEvoChain(evoChainId) {
    let chainId = evoChain.find(item => item.id === evoChainId);
    if (!chainId) {
        return getPokeChainLoading();
    }
    let evoChainHtml = "<tr>";
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            for (let i in chainId) {
                switch (i) {
                    case "name0":
                        evoChainHtml += getEvoImageOne(chainId);
                        break;
                    case "lv1":
                        evoChainHtml += getEvoNextArrow();
                        break;
                    case "name1":
                        evoChainHtml += getEvoImageTwo(chainId);
                        break;
                    case "lv2":
                        evoChainHtml += getEvoNextArrow();
                        break;
                    case "name2":
                        evoChainHtml += getEvoImageThree(chainId);
                        break;
                    default:
                        break;
                }
            }
            evoChainHtml += `</tr>`
        }
        if (i === 1) {
            evoChainHtml += `<tr>`
            for (let i in chainId) {
                switch (i) {
                    case "name0":
                        evoChainHtml += getEvoNameOne(chainId);
                        break;
                    case "lv1":
                        evoChainHtml += getEvoNextArrow();
                        break;
                    case "name1":
                        evoChainHtml += getEvoNameTwo(chainId);
                        break;
                    case "lv2":
                        evoChainHtml += getEvoNextArrow();
                        break;
                    case "name2":
                        evoChainHtml += getEvoNameThree(chainId);
                        break;
                    default:
                        break;
                }
            }
            evoChainHtml += `</tr>`

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

function renderSearch(filteredPokedex, input) {
    mainCardsRef.innerHTML = '';
    if (filteredPokedex.length === 0) {
        displaySearchErrorMsg(input);
    }
    for (let k = 0; k < filteredPokedex.length; k++) {
        let id = filteredPokedex[k].id
        let i = pokeIdToPokeIndex(id)
        mainCardsRef.innerHTML += getMainCardsHtml(i, filteredPokedex);
    }
}

function displaySearchErrorMsg(input) {
    let randomOne = Math.floor(Math.random() * pokedex.length);
    mainCardsRef.innerHTML = getSearchErrorHtml(input, randomOne);
}

function pokeIdToPokeIndex(id) {
    let i = pokedex.findIndex(item => item.id === id);
    return i;
}