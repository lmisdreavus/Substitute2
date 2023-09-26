document.addEventListener('DOMContentLoaded', function() {
    let search = document.getElementById('search');
    let pokemonInfo = document.getElementById('pokemonInfo');
    
let pokemons = [
    {
        name: '파이리',
        number: '004',
        type: '불꽃',
        baseStats: '39.52.43.60.50.65',
        abilities: '맹화(1) | 맹화(2) | 선파워(H)',
        levelUpSkills: [
            '[01] 할퀴기',
            '[01] 울음소리',
            '[04] 불꽃세례',
            '[08] 연막',
            '[12] 용의숨결',
            '[17] 불꽃엄니',
            '[20] 베어가르기',
            '[24] 화염방사',
            '[28] 겁나는얼굴',
            '[32] 회오리불꽃',
            '[36] 연옥',
            '[40] 플레어드라이브',
        ],
        machineSkills: [
            '[TM001] 돌진',
            // ... 다른 기술머신 기술
            '[TM193] 웨더볼',
        ],
        eggSkills: [
            '물기',
            // ... 다른 알 부화 기술
            '드래곤테일',
        ],
    },
    // ... 다른 포켓몬 정보
];
    
    search.addEventListener('input', function() {
        showPokemonInfo(search.value);
    });
    
    function showPokemonInfo(name) {
    let pokemon = pokemons.find(p => p.name === name);
    
    if(pokemon) {
        let levelUpSkills = pokemon.levelUpSkills.join('<br>');
        let machineSkills = pokemon.machineSkills.join('<br>');
        let eggSkills = pokemon.eggSkills.join('<br>');
        
        pokemonInfo.innerHTML = `
            <h2>${pokemon.number} - ${pokemon.name}</h2>
            <p>타입: ${pokemon.type}</p>
            <p>종족값: ${pokemon.baseStats}</p>
            <p>특성: ${pokemon.abilities}</p>
            <p>레벨 업으로 배우는 기술:<br>${levelUpSkills}</p>
            <p>기술머신으로 배우는 기술:<br>${machineSkills}</p>
            <p>알 부화로 배우는 기술:<br>${eggSkills}</p>
        `;
    } else {
        pokemonInfo.innerHTML = `<p>일치하는 포켓몬이 없습니다.</p>`;
    }
}
});
