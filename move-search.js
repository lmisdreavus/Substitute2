// 이미지 프리로딩 함수
async function preloadImages() {
  const response = await fetch('pokemon.json');
  const pokemons = await response.json();

  const imagePromises = pokemons.map(async pokemon => {
    const englishName = pokemon.englishName;
    const imageUrl = await getPokemonImageUrl(englishName);
    return imageCache.getImage(imageUrl);
  });

  await Promise.all(imagePromises);
}

// 페이지 로드 시 이미지 프리로딩 수행
window.addEventListener('load', preloadImages);

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
  const response = await fetch('pokemon.json');
  const pokemons = await response.json();

  const pokemon = pokemons.find(p => p.name === koreanName);
  return pokemon ? pokemon.englishName : koreanName; // 포켓몬을 찾지 못한 경우 한글 이름 그대로 반환
}

// 검색 결과를 보여줄 HTML 요소를 선택합니다.
const resultsContainer = document.getElementById('search-results');

// 이 함수는 사용자가 기술을 검색할 때 호출됩니다.
function searchMove() {
  // 사용자가 입력한 검색어를 가져옵니다.
  const moveName = document.getElementById('move-name-input').value.trim().toLowerCase();

  // pokemon.json 파일에서 데이터를 가져옵니다.
  fetch('pokemon.json')
    .then(response => response.json())
    .then(pokemons => {
      // 검색 결과를 담을 배열입니다.
      let searchResults = [];

      // 모든 포켓몬을 순회하며 해당 기술을 찾습니다.
      pokemons.forEach(pokemon => {
        let {
          name,
          levelUpSkills = [],
          machineSkills = [],
          eggSkills = [],
          RelearnSkills = []
        } = pokemon;

        // 기술 유형별로 처리하고 결과를 searchResults 배열에 추가합니다.
        levelUpSkills.forEach(skill => {
          if (skill.toLowerCase().includes(moveName.toLowerCase())) {
            let level = skill.match(/\[([0-9]+)\]/); // 숫자를 찾습니다.
            searchResults.push(`${name} - Lv ${level ? level[1] : ''}`);
          }
        });

        machineSkills.forEach(skill => {
          if (skill.toLowerCase().includes(moveName.toLowerCase())) {
            let tm = skill.match(/\[TM([0-9]+)\]/); // TM 번호를 찾습니다.
            searchResults.push(`${name} - [TM${tm ? tm[1] : ''}]`);
          }
        });

        eggSkills.forEach(skill => {
          if (skill.toLowerCase().includes(moveName.toLowerCase())) {
            searchResults.push(`${name} - 유전기`);
          }
        });

        RelearnSkills.forEach(skill => {
          if (skill.toLowerCase().includes(moveName.toLowerCase())) {
            searchResults.push(`${name} - 떠올리기`);
          }
        });
      });

      // 결과를 화면에 출력합니다.
      displayResults(searchResults);
    })
    .catch(error => console.error('Error loading or processing JSON Data: ', error));
}

// 검색 결과를 화면에 출력하는 함수
async function displayResults(results) {
  const resultItemsContainer = document.getElementById('result-items');
  resultItemsContainer.innerHTML = '';

  const searchResultsContainer = document.getElementById('search-results');
  const noResultsElement = document.getElementById('no-results');

  if (results.length > 0) {
    // 검색 결과가 있을 때만 검색 결과 창을 표시
    searchResultsContainer.style.display = 'block';
    noResultsElement.style.display = 'none';
    // 이미지 URL을 모아서 프리로딩
    const imagePromises = results.map(async result => {
      const [pokemonName, skillInfo] = result.split(' - ');
      const englishName = await getEnglishName(pokemonName);
      const imageUrl = await getPokemonImageUrl(englishName);
      return imageCache.getImage(imageUrl);
    });

    // 모든 이미지 로딩이 완료될 때까지 기다림
    const imageUrls = await Promise.all(imagePromises);

    // 이미지 로딩이 완료된 후 검색 결과 표시
    results.forEach((result, index) => {
      const [pokemonName, skillInfo] = result.split(' - ');
      const imageUrl = imageUrls[index];

      const resultElement = document.createElement('div');
      resultElement.classList.add('col-md-6', 'mb-3');

      const card = document.createElement('div');
      card.classList.add('card', 'h-100');

      const row = document.createElement('div');
      row.classList.add('row', 'no-gutters');

      const col1 = document.createElement('div');
      col1.classList.add('col-md-4');

      const pokemonImage = document.createElement('img');
      pokemonImage.src = imageUrl;
      pokemonImage.alt = pokemonName;
      pokemonImage.classList.add('card-img');

      col1.appendChild(pokemonImage);

      const col2 = document.createElement('div');
      col2.classList.add('col-md-8');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title');
      cardTitle.textContent = pokemonName;

      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.textContent = skillInfo;

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      col2.appendChild(cardBody);

      row.appendChild(col1);
      row.appendChild(col2);
      card.appendChild(row);
      resultElement.appendChild(card);
      resultItemsContainer.appendChild(resultElement);
    });
  } else {
    const noResultsElement = document.getElementById('no-results');
    searchResultsContainer.style.display = 'none';
    noResultsElement.style.display = 'block';
  }
}

document.getElementById('move-name-input').addEventListener('keypress', function (event) {
  // 엔터 키의 키코드는 13입니다.
  if (event.keyCode === 13) {
    event.preventDefault(); // 폼이 실제로 제출되는 것을 방지합니다.
    searchMove(); // 검색 함수를 호출합니다.
  }
});