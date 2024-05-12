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

// 이미지 캐시 클래스
class ImageCache {
  constructor() {
    this.cache = new Map();
  }

  async getImage(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      this.cache.set(url, objectURL);
      return objectURL;
    }
  }
}

const imageCache = new ImageCache();

// 포켓몬 이미지 URL을 가져오는 함수
async function getPokemonImageUrl(pokemonName) {
  if (!pokemonName) {
    return ''; // 포켓몬 이름이 없는 경우 빈 문자열 반환
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    return data.sprites.front_default;
  } catch (error) {
    console.error(`Failed to fetch image for ${pokemonName}:`, error);
    return ''; // 이미지 가져오기 실패 시 빈 문자열 반환
  }
}

// 포켓몬의 한글 이름을 영어 이름으로 변환하는 함수
async function getEnglishName(koreanName) {
  const pokemon = pokemons.find(p => p.name === koreanName);
  return pokemon ? pokemon.englishName : koreanName; // 포켓몬을 찾지 못한 경우 한글 이름 그대로 반환
}

async function displayPokemonData(pokemon) {
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

  const englishName = await getEnglishName(pokemon.name);
  const imageUrl = await getPokemonImageUrl(englishName);

  let resultHtml = `
    <div class="card mb-3">
      <div class="card-header">
        <h2>${pokemon.name} (#${pokemon.number})</h2>
      </div>
      <div class="card-body">
        <div class="text-left mb-4">
          <img src="${imageUrl}" alt="${pokemon.name}" class="img-fluid" style="max-width: 200px;">
        </div>
        <p><strong>타입:</strong> ${pokemon.type}</p>
        <div><strong>종족값:</strong></div>
        <div class="stat-container">
        ${Object.keys(pokemon.baseStats).map(stat => {
          const statValue = pokemon.baseStats[stat];
          const widthPercent = Math.min(statValue / MAX_STAT_VALUE * 100, 100);
          const translatedStat = statTranslations[stat] || stat;
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