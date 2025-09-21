function getMainCardsHtml(i, pokeEvoChainNr) {
    return `
        <div class="container" onclick="openDialog(${i},${pokeEvoChainNr})" id="pokeId${i + 1}" data-evoChainId="${pokeEvoChainNr}">
            <img src="${pokedex[i].sprites}" alt="Pokemon ${pokedex[i].name}" class="pokeImg">
            <article class="mainCard" data-bg="${pokedex[i].types[0].type.name}-${findNumberOfTypesObj(i)}">
                <div class="flex_col">
                    <h3>No. ${pokedex[i].id}</h3>
                    <h2>${renderPokeName(i)}</h2>
                    <div id="pokeType">${renderTypeImg(i)}</div>
                </div>
            </article>
        </div>
    `
}

function getPokeTypeHtml(key, i, k) {
    return `<img src="./assets/types/${typesObj[key]}.png" alt="pokemon type ${pokedex[i].types[k].type.name}" class="pokeType">`;
}

function getPokeAbilities(i, k){
    return `<td width="50%" class="clipOther">${pokedex[i].abilities[k].ability.name.charAt(0).toUpperCase() + pokedex[i].abilities[k].ability.name.slice(1)}</td>`
}

function getDialogCardHtml(i, pokeEvoChainNr) {
    return `                
        <img src="${pokedex[i].sprites}" alt="Pokemon ${pokedex[i].name}" class="pokeImg">
        <article class="mainCard">
            <div class="flex_col">
                <h3>No. ${pokedex[i].id}</h3>
                <h2>${renderPokeName(i)}</h2>
                <div id="pokeType">${renderTypeImg(i)}</div>
                <h2>Description</h2>
                <p>${pokedex[i].descr_EN}</p>
                <div>
                    <table>
                        <tr>
                            <th width="50%">Height</th>
                            <th width="50%">Weight</th>
                        </tr>
                        <tr>
                            <td width="50%" class="clipOther">${pokedex[i].height / 10}m</td>
                            <td width="50%" class="clipOther">${pokedex[i].weight / 10}kg</td>
                        </tr>
                    </table>
                </div> 
                <div>
                    <table>
                        <tr>
                            <th colspan="2">Abilities</th>
                        </tr>
                        <tr>${renderPokeAbilities(i)}
                        </tr>
                    </table>
                </div> 
                <div>
                    <table class="large-screen">
                        <tr>
                            <th colspan="6">Stats</th>
                        </tr>
                        <tr>
                            <th width="16%" title="Health Points">HP</td>
                            <th width="16%" title="Attack">ATK</td>
                            <th width="16%" title="Defence">DEF</td>
                            <th width="16%" title="Special Attack">SpA</td>
                            <th width="16%" title="Special Defence">SpD</td>
                            <th width="16%" title="Speed">SPD</td>
                        </tr>
                        <tr>
                            <td width="16%">${pokedex[i].stats[0].base_stat}</td>
                            <td width="16%">${pokedex[i].stats[1].base_stat}</td>
                            <td width="16%">${pokedex[i].stats[2].base_stat}</td>
                            <td width="16%">${pokedex[i].stats[3].base_stat}</td>
                            <td width="16%">${pokedex[i].stats[4].base_stat}</td>
                            <td width="16%">${pokedex[i].stats[5].base_stat}</td>
                        </tr>
                    </table>
                </div> 
                <div>
                    <table>
                        <tr>
                            <th colspan="5">Evolution</th>
                        </tr>
                        <tr>${renderPokeEvoChain(pokeEvoChainNr)}
                        </tr>
                    </table>
                </div> 
            </div>
        </article>`
}
