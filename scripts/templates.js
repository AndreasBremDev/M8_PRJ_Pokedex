function getMainCardsHtml(i) {
    return `
        <div class="container" onclick="openDialog(${i}, event); toggleDialogStyling('hidden')" data-pokeId="${pokedex[i].id}" data-evoChainId="${pokedex[i].evoChainId}">
            <img src="${pokedex[i].sprites}" alt="Pokemon ${pokedex[i].name}" class="pokeImg">
            <article class="mainCard" data-bg="${pokedex[i].types[0].type.name}-${findNumberOfTypesObj(i)}">
                <div class="flex flex_col">
                    <h3>No. ${pokedex[i].id}</h3>
                    <h2>${renderPokeName(i)}</h2>
                    <div id="pokeType">${renderTypeImg(i)}</div>
                </div>
            </article>
        </div>
    `
}

function getDialogCardHtml(i) {
    return `                
        <img src="${pokedex[i].sprites}" alt="Pokemon ${pokedex[i].name}" class="pokeImg">
        <article class="mainCard" class="pokeImg">
            <div class="flex flex_col">
                <div class="flex margin-and-width justify_between flex_end"class="">
                    <div class="container w16perc">
                        <button onclick="prevNextPokemon(${i - 1}, event)" class="btn-main clip9"><img src="./assets/icon/arrow_back.png" alt="back"></button>
                    </div>
                    <h3>No. ${pokedex[i].id}</h3>
                    <div class="container w16perc">
                        <button onclick="prevNextPokemon(${i + 1}, event)" class="btn-main"><img src="./assets/icon/arrow_forward.png" alt="forward"></button>
                    </div>
                </div>
                <h2>${renderPokeName(i)}</h2>
                <div id="pokeType">${renderTypeImg(i)}</div>
                <div>
                    <table>
                        <tr>
                            <th width="100%">Description</th>
                        </tr>
                        <tr>
                            <td class="no-bg clipOther line-height">${pokedex[i].description}</td>
                        </tr>
                    </table>
                </div> 
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
                        <tr>${renderPokeEvoChain(pokedex[i].evoChainId)}
                        </tr>
                    </table>
                </div> 
            </div>
        </article>`
}


function getPokeTypeHtml(key, i, k) {
    return `<img src="./assets/types/${typesObj[key]}.png" alt="pokemon type ${pokedex[i].types[k].type.name}" class="pokeType">`;
}

function getPokeAbilities(i, k) {
    return `<td width="50%" class="clipOther">${pokedex[i].abilities[k].ability.name.charAt(0).toUpperCase() + pokedex[i].abilities[k].ability.name.slice(1)}</td>`
}

function getPokeChainLoading() {
    return `<td colspan="5" class="loading">⏳ Loading evolution...</td>`
}

function getPokeEvoChainNameOne(chainId) {
    return `<th width="20%"><img src="${chainId.name0Url}" alt="${chainId.name0}" title="${chainId.name0}" style="width:60px;"></th>`;
}

function getPokeEvoChainLevelOne(chainId) {
    return `<th width="20%" class="no-bg" title="Level up at Lv.${chainId.lv1}">\></th>`;
}

function getPokeEvoChainNameTwo(chainId) {
    return `<th width="20%"><img src="${chainId.name1Url}" alt="${chainId.name1}" title="${chainId.name1}" style="width:60px;"></th>`;
}

function getPokeEvoChainLevelTwo(chainId) {
    return `<th width="20%" class="no-bg" title="Level up at Lv.${chainId.lv1}">\></th>`;
}

function getPokeEvoChainNameThree(chainId) {
    return `<th width="20%"><img src="${chainId.name2Url}" alt="${chainId.name2}" title="${chainId.name2}" style="width:60px;"></th>`;
}

function getImpressumHtml() {
    return `
    <article class="mainCard flex j_c_center">
        <div class="w80perc">
            <h1>Impressum</h1>
            <p>Angaben gemäß § 5 DDG</p>
            <p>Andreas Brem<br>
            <br> 
            Straßbergerstraße 16
            <br> 
            80809 München <br> 
            </p>
            <p><strong>Vertreten durch: </strong>
            <br>
            Andreas Brem
            <br>
            </p><p><strong>Kontakt:</strong>
            <br>
            Telefon: 089-93334141<br>
            E-Mail: <a href='mailto:andreas.brem.dev@googlemail.com'>andreas.brem.dev@googlemail.com</a></br>
            </p>
            <p><strong>Haftungsausschluss: </strong>
            <br><br><strong>Haftung für Inhalte</strong><br><br>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.<br><br><strong>Haftung für Links</strong>
            <br><br>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            <br><br>
            <strong>Urheberrecht</strong>
            <br><br>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            <br><br>
            <strong>Datenschutz</strong>
            <br><br>
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. 
            <br>
            Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
            <br>
            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.
            <br>
            </p>
            <br> 
            Erstellt mit <a href="https://impressum-generator.de" rel="dofollow">Impressum-Generator.de</a>, dem Tool für Impressum und <a href="https://impressum-generator.de/datenschutz-generator" rel="dofollow">Datenschutz-Erklärung</a>. Nach einer Vorlage der <a href="https://www.kanzlei-hasselbach.de/" rel="dofollow">Kanzlei Hasselbach</a>.
        </div>
    </article>`
}