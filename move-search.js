// 글로벌 캘린더 변수 (단 1번만 파싱)
let uniqueMovesSet = [];
let globalPokemonsData = [];

// 이미지 및 기술 사전 프리로딩 함수
async function preloadData() {
  const response = await fetch('pokemon.json');
  globalPokemonsData = await response.json();

  // 기술 이름 전처리 및 중복제거 Set
  const moveSet = new Set();

  globalPokemonsData.forEach(p => {
    // 모든 배열 병합 및 undefined 방지
    const allSkills = [
      ...(p.levelUpSkills || []),
      ...(p.machineSkills || []),
      ...(p.eggSkills || []),
      ...(p.RelearnSkills || [])
    ];

    // "- [Lv 20] 지진" 이나 "- 지진" 같은 문자열에서 하이픈 기호와 괄호를 완전히 제거합니다.
    allSkills.forEach(skill => {
      const cleanSkillName = skill.trim().replace(/^-/, '').replace(/\[.*?\]/g, '').trim();
      if (cleanSkillName) {
        moveSet.add(cleanSkillName);
      }
    });
  });

  // 배열로 변환해서 캐시에 저장 (이후 실시간 검색 속도 극대화)
  uniqueMovesSet = Array.from(moveSet).sort();

  const imagePromises = globalPokemonsData.map(async pokemon => {
    const englishName = pokemon.englishName;
    const imageUrl = await getPokemonImageUrl(englishName);
    return imageCache.getImage(imageUrl);
  });

  await Promise.all(imagePromises);
}

// 페이지 로드 시 데이터 및 이미지 프리로딩 수행
window.addEventListener('load', preloadData);

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

  // 이미 로드된 글로벌 데이터를 사용합니다 (재요청 방지)
  const pokemons = globalPokemonsData;
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

  // 동적 범용 기술 필터링 (80% 이상)
  const threshold = pokemons.length * 0.8;
  if (searchResults.length >= threshold) {
    displayUniversalMoveMessage(searchResults.length, pokemons.length);
  } else {
    // 결과를 화면에 출력합니다.
    displayResults(searchResults);
  }
}

// 범용 기술 차단 메시지 출력 함수
function displayUniversalMoveMessage(count, total) {
  const resultItemsContainer = document.getElementById('result-items');
  resultItemsContainer.innerHTML = '';

  const searchResultsContainer = document.getElementById('search-results');
  const noResultsElement = document.getElementById('no-results');

  searchResultsContainer.style.display = 'block';
  noResultsElement.style.display = 'none';

  resultItemsContainer.innerHTML = `
    <div class="col-12 text-center my-5">
      <i class="fas fa-shield-alt fa-3x mb-3" style="color: var(--primary-color);"></i>
      <h4 class="font-weight-bold">너무 많은 포켓몬이 배우는 범용 기술입니다!</h4>
      <p class="text-muted mt-2">검색된 개체 수: <strong>${count}마리</strong> (전체 ${total}마리의 약 80% 이상)</p>
      <p>방어, 대타출동 등은 대부분의 포켓몬이 공통으로 배우므로 검색 결과 노출을 제한합니다.</p>
    </div>
  `;
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

    // 성능 최적화: 청크(Chunk) 비동기 렌더링
    // 한 번에 화면을 멈추게 만들지 않도록 50개씩 나눠서 그립니다.
    const CHUNK_SIZE = 50;

    // 내부 렌더링 함수
    async function renderChunk(startIndex) {
      if (startIndex >= results.length) return; // 모든 렌더링 완료

      const endIndex = Math.min(startIndex + CHUNK_SIZE, results.length);
      const chunk = results.slice(startIndex, endIndex);

      // DocumentFragment를 사용한 DOM 렌더링 최적화
      const fragment = document.createDocumentFragment();

      // 현재 청크의 이미지 URL을 모아서 프리로딩
      const imagePromises = chunk.map(async result => {
        const [pokemonName, skillInfo] = result.split(' - ');
        const englishName = await getEnglishName(pokemonName);
        const imageUrl = await getPokemonImageUrl(englishName);
        return imageCache.getImage(imageUrl);
      });

      // 현재 청크의 모든 이미지 로딩 대기
      const imageUrls = await Promise.all(imagePromises);

      // DOM 요소 생성 및 조립
      chunk.forEach((result, index) => {
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
        fragment.appendChild(resultElement);
      });

      // 조립 완료된 파편(Fragment)을 실 화면에 부착
      resultItemsContainer.appendChild(fragment);

      // **핵심**: 다음 청크를 렌더링하기 전에 브라우저 UI 스레드에 휴식 시간을 양보(yield)
      // 화면 렉(Lag)을 방지하고 유저가 스크롤할 수 있도록 해줍니다.
      if (endIndex < results.length) {
        setTimeout(() => {
          renderChunk(endIndex);
        }, 0); // 0ms 지연이지만 호출 스택을 비워 UI 페인팅을 허용함
      }
    }

    // 첫 번째 청크부터 렌더링 시작
    renderChunk(0);

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
    document.getElementById('move-search-results').style.display = 'none'; // 엔터 검색 시 리스트 숨김
    searchMove(); // 검색 함수를 호출합니다.
  }
});

// ==========================================
// Phase 8: Move Search Autocomplete (Dropdown)
// ==========================================

// 자동완성을 렌더링할 컨테이너 구축
const moveSearchInput = document.getElementById('move-name-input');
let suggestionBox = document.createElement('div');
suggestionBox.setAttribute('id', 'move-search-results');
suggestionBox.setAttribute('class', 'suggestion-box list-group shadow-sm mt-1');
suggestionBox.style.display = 'none';

// 인풋창 DOM 부모에 부착 (상대 위치 기반 앱솔루트 드롭다운)
moveSearchInput.parentNode.appendChild(suggestionBox);

moveSearchInput.addEventListener('input', function () {
  const searchText = this.value.trim().toLowerCase();
  suggestionBox.innerHTML = ''; // 문자 입력마다 초기화

  if (searchText.length >= 1 && uniqueMovesSet.length > 0) {
    // 프리로드 해둔 800+ 개의 단어 사전을 필터링
    const filteredMoves = uniqueMovesSet.filter(move => move.toLowerCase().includes(searchText)).slice(0, 10); // 최대 10개만 추천

    if (filteredMoves.length > 0) {
      suggestionBox.style.display = 'block';

      filteredMoves.forEach(move => {
        let suggestionBtn = document.createElement('a');
        suggestionBtn.href = "javascript:void(0);";
        suggestionBtn.setAttribute('class', 'list-group-item list-group-item-action border-0 px-4 py-3 font-weight-bold');
        suggestionBtn.textContent = move;

        // 기술명 클릭 시 행동
        suggestionBtn.addEventListener('click', function () {
          moveSearchInput.value = move; // 텍스트 덮어쓰기
          suggestionBox.style.display = 'none'; // 드롭다운 숨기기
          searchMove(); // 즉시 검색 트리거!
        });

        suggestionBox.appendChild(suggestionBtn);
      });
    } else {
      suggestionBox.style.display = 'none';
    }
  } else {
    suggestionBox.style.display = 'none';
  }
});

// 바탕화면 클릭 시 검색 리스트를 졉리합니다.
document.addEventListener('click', function (event) {
  if (!moveSearchInput.contains(event.target) && !suggestionBox.contains(event.target)) {
    suggestionBox.style.display = 'none';
  }
});