document.addEventListener('DOMContentLoaded', function() {
    let search = document.getElementById('search');
    let pokemonInfo = document.getElementById('pokemonInfo');
    
    let pokemons = [
        {
            name: '파이리',
            number: '004',
            // 다른 데이터도 추가
        },
        // 다른 포켓몬 데이터도 추가
    ];
    
    search.addEventListener('input', function() {
        showPokemonInfo(search.value);
    });
    
    function showPokemonInfo(name) {
        let pokemon = pokemons.find(p => p.name === name);
        
        if(pokemon) {
            pokemonInfo.innerHTML = `
                <h2>${pokemon.number} - ${pokemon.name}</h2>
                <!-- 여기에 다른 포켓몬 정보를 추가하십시오. -->
            `;
        } else {
            pokemonInfo.innerHTML = `<p>일치하는 포켓몬이 없습니다.</p>`;
        }
    }
});
