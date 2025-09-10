function getMainCardsHtml(i, item) {
    return `
        <div class="container">
            <img src="./assets/img/2_Ivysaur.png" alt="Pokemon Name" class="pokeImg">
            <article class="mainCard">
                <div class="flex_col">
                    <h3>No. ${curOffset + i + 1}</h3>
                    <h2>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h2>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png"
                        alt="Pokemon Type" class="pokeType">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/4.png"
                        alt="Pokemon Type" class="pokeType">
                </div>
            </article>
        </div>
    `
}
