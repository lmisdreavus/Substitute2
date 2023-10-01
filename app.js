let pokemons = [];

// JSON 데이터 불러오기
fetch('pokemon.json')
  .then(response => response.json())
  .then(data => {
    pokemons = data;
    console.log(data);
  })
  .catch(error => console.error('Error loading JSON Data: ', error));

  let suggestionBox = document.createElement('div');
  suggestionBox.setAttribute('class', 'suggestion-box');

  let suggestionItem = document.createElement('a');
  suggestionItem.href = "#";
  //suggestionItem.textContent = "제안된 아이템";
  suggestionBox.appendChild(suggestionItem);

  

  
  const searchInput = document.getElementById('search');

  // suggestionBox의 너비를 searchInput의 너비와 동일하게 설정
  suggestionBox.style.width = `${searchInput.offsetWidth}px`;

  searchInput.parentNode.appendChild(suggestionBox); // searchInput이 있는 후에 suggestionBox를 추가해야 합니다.
  const resultDiv = document.getElementById('result');

  
  // 윈도우 크기가 변경될 때 suggestionBox의 너비를 업데이트
  window.addEventListener('resize', function() {
    suggestionBox.style.width = `${searchInput.offsetWidth}px`;
  });

searchInput.addEventListener('input', function () {
  const searchText = searchInput.value;
  suggestionBox.innerHTML = ''; // Clear existing suggestions
  
  if(searchText !== '') {
    for (let pokemon of pokemons) {
      if (pokemon.name.startsWith(searchText)) {
        let suggestion = document.createElement('div');
        suggestion.innerHTML = pokemon.name;
        suggestion.addEventListener('click', function() {
          searchInput.value = pokemon.name;
          displayPokemonData(pokemon);
          suggestionBox.innerHTML = ''; // Clear suggestions when one is clicked
        });
        suggestionBox.appendChild(suggestion);
      }
    }
  }

  // 포켓몬 데이터 검색
  const matchedPokemon = pokemons.find(p => p.name === searchText);
  
  // 결과 출력
  if (matchedPokemon) {
    displayPokemonData(matchedPokemon);
  }
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