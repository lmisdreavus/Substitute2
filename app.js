let pokemons = [];
let timeoutId;  // 타임아웃을 관리할 변수를 선언합니다.

// JSON 데이터 불러오기
fetch('pokemon.json')
  .then(response => response.json())
  .then(data => {
    pokemons = data;
    console.log(data);
  })
  .catch(error => console.error('Error loading JSON Data: ', error));

const searchInput = document.getElementById('search');
const pokemonListDatalist = document.getElementById('pokemon-list');
const resultDiv = document.getElementById('result');

searchInput.addEventListener('input', function () {
  clearTimeout(timeoutId); // 기존 타임아웃을 초기화합니다.
  timeoutId = setTimeout(() => {
    // 이 부분에 기존의 입력 이벤트 핸들러 로직을 넣습니다.
  const searchText = searchInput.value;
  pokemonListDatalist.innerHTML = ''; // Clear existing options
  
  if(searchText !== '') {
    for (let pokemon of pokemons) {
      if (pokemon.name.includes(searchText)) {
        let option = document.createElement('option');
        option.value = pokemon.name;
        pokemonListDatalist.appendChild(option);
      }
    }
  }

  // 포켓몬 데이터 검색
  const matchedPokemon = pokemons.find(p => p.name === searchText);
  
  // 결과 출력
  if (matchedPokemon) {
    displayPokemonData(matchedPokemon);
  }
}, 150);
});

function displayPokemonData(pokemon) {
  let eggSkills = pokemon.eggSkills ? pokemon.eggSkills.join('<br>') : 'None';
  let levelUpSkills = pokemon.levelUpSkills ? pokemon.levelUpSkills.join('<br>') : 'None';
  let machineSkills = pokemon.machineSkills ? pokemon.machineSkills.join('<br>') : 'None';
  
 
    let resultHtml = `
      <div class="card mb-3">
        <div class="card-header">
          <h2>${pokemon.name} (#${pokemon.number})</h2>
        </div>
        <div class="card-body">
          <p><strong>타입:</strong> ${pokemon.type}</p>
          <div><strong>종족값:</strong></div>
          <div class="stat-container">
            <div class="stat-bar" style="width: ${pokemon.baseStats.hp}%;">체력: ${pokemon.baseStats.hp}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.attack}%;">공격: ${pokemon.baseStats.attack}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.defense}%;">방어: ${pokemon.baseStats.defense}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.spAttack}%;">특수공격: ${pokemon.baseStats.spAttack}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.spDefense}%;">특수방어: ${pokemon.baseStats.spDefense}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.speed}%;">스피드: ${pokemon.baseStats.speed}</div>
          </div>
          <br>
          <p><strong>특성:</strong> ${pokemon.abilities}</p>
          <p><strong>레벨 업으로 배우는 기술:</strong><br> ${levelUpSkills}</p>
          <p><strong>기술머신으로 배우는 기술:</strong><br> ${machineSkills}</p>
          <p><strong>알 부화로 배우는 기술:</strong><br> ${eggSkills}</p>
        </div>
      </div>
    `;
    resultDiv.innerHTML = resultHtml;
}