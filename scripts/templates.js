function getMainCardsHtml(i) {
    return `
        <div class="container" onclick="openDialog(${i})" data-id="${i + 1}">
            <img src="${pokedex[i].sprites}" alt="Pokemon ${pokedex[i].name}" class="pokeImg">
            <article class="mainCard">
                <div class="flex_col">
                    <h3>No. ${curOffset + i + 1}</h3>
                    <h2>${renderPokeName(i)}</h2>
                    <div id="pokeType">${renderTypeImg(i)}</div>
                </div>
            </article>
        </div>
    `
}

function getPokeTypeHtml(key, i, k) {
    return `<img src="./assets/types/${typesNameNr[key]}.png" 
    alt="pokemon 
    type ${pokedex[i].types[k].type.name}" 
    class="pokeType">`;
}

function getDialogCardHtml(i) {
    return `                
        <img src="${pokedex[i].sprites}" alt="Pokemon ${pokedex[i].name}" class="pokeImg">
        <article class="mainCard">
            <div class="flex_col">
                <h3>No. ${curOffset + i + 1}</h3>
                <h2>${renderPokeName(i)}</h2>
                <div id="pokeType">${renderTypeImg(i)}</div>
            </div>
        </article>`
}
