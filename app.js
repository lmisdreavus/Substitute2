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
  
  const searchInput = document.getElementById('search');
  searchInput.parentNode.appendChild(suggestionBox);
  const resultDiv = document.getElementById('result');

// 입력 중 유사 결과 표시
searchInput.addEventListener('input', function () {
  const searchText = searchInput.value;
  suggestionBox.innerHTML = ''; // 기존 제안 삭제


  if (searchText.length >= 2) {
    for (let pokemon of pokemons) {
      if (pokemon.name.includes(searchText)) {
        let suggestion = document.createElement('div');
        suggestion.innerHTML = pokemon.name;
        suggestion.addEventListener('click', function() {
          searchInput.value = pokemon.name;
          displayPokemonData(pokemon);
          suggestionBox.innerHTML = ''; // 제안 선택 시 제안 삭제
        });
        suggestionBox.appendChild(suggestion);
      }
    }
  }
});
/*  if (searchText !== '') {
    for (let pokemon of pokemons) {
      if (pokemon.name.toLowerCase().startsWith(searchText.toLowerCase())) {
        let suggestion = document.createElement('div');
        suggestion.innerHTML = pokemon.name;
        suggestion.addEventListener('click', function() {
          searchInput.value = pokemon.name;
          displayPokemonData(pokemon);
          suggestionBox.innerHTML = ''; // 제안 선택 시 제안 삭제
        });
        suggestionBox.appendChild(suggestion);
      }
    }
  }
});
*/

// 엔터 키를 눌렀을 때 검색 결과 표시
searchInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    const searchText = searchInput.value;
    const matchedPokemon = pokemons.find(p => p.name.toLowerCase() === searchText.toLowerCase());
  
    if (matchedPokemon) {
      displayPokemonData(matchedPokemon);
    }
    suggestionBox.innerHTML = ''; // 검색 후 제안 삭제
  }
});
  /*
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
  */

// 버튼 클릭 이벤트 처리
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function () {
  const searchText = searchInput.value;
  const matchedPokemon = pokemons.find(p => p.name.toLowerCase() === searchText.toLowerCase());
  
  if (matchedPokemon) {
    displayPokemonData(matchedPokemon);
  }
  suggestionBox.innerHTML = ''; // 검색 후 제안 삭제
});

function displayPokemonData(pokemon) {
  let eggSkills = pokemon.eggSkills ? pokemon.eggSkills.join('<br>') : '없음';
  let levelUpSkills = pokemon.levelUpSkills ? pokemon.levelUpSkills.join('<br>') : '없음';
  let machineSkills = pokemon.machineSkills ? pokemon.machineSkills.join('<br>') : '없음';
  let RelearnSkills = pokemon.RelearnSkills ? pokemon.RelearnSkills.join('<br>') : '없음';

  const MAX_STAT_VALUE = 255; // 종족값의 최대값
  const statTranslations = {
    "hp": "체력",
    "attack": "공격",
    "defense": "방어",
    "spAttack": "특수공격",
    "spDefense": "특수방어",
    "speed": "스피드"
  };
    let resultHtml = `
      <div class="card mb-3">
        <div class="card-header">
          <h2>${pokemon.name} (#${pokemon.number})</h2>
        </div>
        <div class="card-body">
          <p><strong>타입:</strong> ${pokemon.type}</p>
          <div><strong>종족값:</strong></div>
          <div class="stat-container">
          ${Object.keys(pokemon.baseStats).map(stat => {
            const statValue = pokemon.baseStats[stat];
            const widthPercent = Math.min(statValue / MAX_STAT_VALUE * 100, 100); // 너비를 계산하고 최대 100%로 제한합니다.
            const translatedStat = statTranslations[stat] || stat; // 통계 이름을 한국어로 번역합니다.
            return `<div class="stat-bar" style="width: ${widthPercent}%;">${translatedStat}: ${statValue}</div>`;
          }).join('')}    
          </div>
          <br>
          <p><strong>특성:</strong> ${pokemon.abilities}</p>
          <p><strong>레벨 업으로 배우는 기술:</strong><br> ${levelUpSkills}</p>
          <p><strong>기술머신으로 배우는 기술:</strong><br> ${machineSkills}</p>
          <p><strong>알 부화로 배우는 기술:</strong><br> ${eggSkills}</p>
          <p><strong>떠올리기 기술:</strong><br> ${RelearnSkills}</p>
        </div>
      </div>
    `;
    resultDiv.innerHTML = resultHtml;
    
}