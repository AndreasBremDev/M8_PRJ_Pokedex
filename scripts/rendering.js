function renderPokemon(from, to) {
    for (let i = from; i < to; i++) { // WAS: i < (curOffset + limit)
        mainCardsRef.innerHTML += getMainCardsHtml(i);
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

function renderPokeEvoChain(pokeEvoChainId) {
    let chainId = evoChain.find(item => item.id === pokeEvoChainId);
    if (!chainId) {
        return getPokeChainLoading();
    }
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