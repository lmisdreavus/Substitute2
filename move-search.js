(() => {
  // 글로벌 캘린더 변수 (단 1번만 파싱)
  let uniqueMovesSet = [];
  let globalPokemonsData = []; // SV
  let globalPokemonsDataUSUM = []; // USUM
  let globalMovesData = []; // 기술 스펙 DB 추가

  // 이미지 및 기술 사전 프리로딩 함수
  async function preloadData() {
    const svRes = await fetch('pokemon.json');
    globalPokemonsData = await svRes.json();

    const usumRes = await fetch('pokemon_usum.json');
    globalPokemonsDataUSUM = await usumRes.json();

    try {
      const movesRes = await fetch('moves.json');
      globalMovesData = await movesRes.json();
    } catch (e) { console.error("moves.json 로드 실패", e); }

    // 기술 이름 전처리 및 중복제거 Set
    const moveSet = new Set();

    // 두 버전의 모든 포켓몬 기술 합치기 (자동완성용)
    const allPokes = globalPokemonsData.concat(globalPokemonsDataUSUM);

    allPokes.forEach(p => {
      // 모든 배열 병합 및 undefined 방지
      const allSkills = [
        ...(p.levelUpSkills || []),
        ...(p.machineSkills || []),
        ...(p.eggSkills || []),
        ...(p.RelearnSkills || [])
      ];

      // "- [Lv 20] 지진" 이나 "- 지진" 같은 문자열에서 하이픈 기호와 괄호를 완전히 제거합니다.
      allSkills.forEach(skill => {
        const cleanSkillName = skill.trim().replace(/^[-*\s]+/, '').replace(/\[.*?\]/g, '').trim();
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

  // 외부(도감 등)에서 해시 라우팅을 통해 호출할 수 있는 검색 트리거
  window.searchMoveByName = function (moveName, version = 'sv') {
    // 혹시 데이터가 아직 로드되지 않은 상태라면 지연 실행
    if (!globalPokemonsData || globalPokemonsData.length === 0 || !globalPokemonsDataUSUM || globalPokemonsDataUSUM.length === 0) {
      setTimeout(() => window.searchMoveByName(moveName, version), 100);
      return;
    }

    // 버전에 맞는 라디오 버튼 자동 체크
    if (version === 'usum') {
      document.getElementById('moveSearchUSUM').click();
    } else {
      document.getElementById('moveSearchSV').click();
    }

    document.getElementById('move-name-input').value = moveName;
    window.searchMove();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      const formMapping = {
        'aegislash': 'aegislash-shield',
        'giratina': 'giratina-altered',
        'deoxys': 'deoxys-normal',
        'shaymin': 'shaymin-land',
        'tornadus': 'tornadus-incarnate',
        'thundurus': 'thundurus-incarnate',
        'landorus': 'landorus-incarnate',
        'meloetta': 'meloetta-aria',
        'kyurem': 'kyurem',
        'keldeo': 'keldeo-ordinary',
        'darmanitan': 'darmanitan-standard',
        'wormadam': 'wormadam-plant',
        'cherrim': 'cherrim',
        'basculin': 'basculin-red-striped',
        'meowstic': 'meowstic-male',
        'pumpkaboo': 'pumpkaboo-average',
        'gourgeist': 'gourgeist-average',
        'oricorio': 'oricorio-baile',
        'lycanroc': 'lycanroc-midday',
        'wishiwashi': 'wishiwashi-solo',
        'minior': 'minior-red-meteor',
        'mimikyu': 'mimikyu-disguised',
        'toxtricity': 'toxtricity-amped',
        'eiscue': 'eiscue-ice',
        'indeedee': 'indeedee-male',
        'morpeko': 'morpeko-full-belly',
        'urshifu': 'urshifu-single-strike',
        'calyrex': 'calyrex',
        'basculegion': 'basculegion-male',
        'oinkologne': 'oinkologne-male',
        'maushold': 'maushold-family-of-four',
        'squawkabilly': 'squawkabilly-green-plumage',
        'palafin': 'palafin-zero',
        'tatsugiri': 'tatsugiri-curly',
        'zachar-unbound': 'hoopa-unbound', // Hoopa exception if needed
        // User's specific mentions (symbol parsing edge cases)
        'farfetchd': 'farfetchd', // Often hyphenated or apostrophed wrongly, pure alpha is best for pokeapi
        'sirfetchd': 'sirfetchd',
        'mr-mime': 'mr-mime',
        'mr-rime': 'mr-rime',
        'mime-jr': 'mime-jr',
        'type-null': 'type-null',
        'tapu-koko': 'tapu-koko',
        'tapu-lele': 'tapu-lele',
        'tapu-bulu': 'tapu-bulu',
        'tapu-fini': 'tapu-fini',
        'zygarde': 'zygarde-50' // 50% form is default
      };

      let apiName = formMapping[pokemonName.toLowerCase()] || pokemonName.toLowerCase();

      // Remove any punctuation remaining (like '.' or ''') just in case, but keep hyphens
      apiName = apiName.replace(/['.]/g, '');

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiName}`);
      const data = await response.json();
      return data.sprites.front_default;
    } catch (error) {
      console.error(`Failed to fetch image for ${pokemonName}:`, error);
      return ''; // 이미지 가져오기 실패 시 빈 문자열 반환
    }
  }

  // 포켓몬의 한글 이름을 영어 이름으로 변환하는 함수
  async function getEnglishName(koreanName) {
    let pokemon = globalPokemonsData.find(p => p.name === koreanName);
    if (!pokemon) {
      pokemon = globalPokemonsDataUSUM.find(p => p.name === koreanName);
    }
    return pokemon ? pokemon.englishName : koreanName; // 포켓몬을 찾지 못한 경우 한글 이름 그대로 반환
  }

  // 검색 결과를 보여줄 HTML 요소를 선택합니다.
  const resultsContainer = document.getElementById('search-results');

  let currentRenderId = 0; // 추가

  // 이 함수는 사용자가 기술을 검색할 때 호출됩니다.
  window.searchMove = function searchMove() {
    const renderId = ++currentRenderId; // 추가
    // 사용자가 입력한 검색어를 가져옵니다 (비교용). 원본 보존.
    const originalSearchQuery = document.getElementById('move-name-input').value.trim();
    const moveName = originalSearchQuery.toLowerCase();

    // 입력 버전 선택 확인 (SV vs USUM)
    const isSV = document.getElementById('moveSearchSV').checked;

    // 이미 로드된 글로벌 데이터를 사용합니다 (재요청 방지)
    // USUM(7세대)의 경우 전국도감 번호가 807번(제라오라) 윗세대 포켓몬이 노출되지 않도록 필터링합니다.
    const pokemons = isSV ? globalPokemonsData : globalPokemonsDataUSUM.filter(p => p.number && parseInt(p.number) <= 807);

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
    // moves.json에 명시된 주요 기술이면서 범용기로 잡혔다면 그냥 출력 허용 (예외 처리)
    let isDetailedMove = false;
    if (globalMovesData && globalMovesData.some(m => m.name === originalSearchQuery)) {
      isDetailedMove = true;
    }

    if (searchResults.length >= threshold && !isDetailedMove) {
      displayUniversalMoveMessage(searchResults.length, pokemons.length, originalSearchQuery);
    } else {
      // 결과를 화면에 출력합니다.
      displayResults(searchResults, renderId, originalSearchQuery);
    }
  }

  // 범용 기술 차단 메시지 출력 함수
  function displayUniversalMoveMessage(count, total, moveName) {
    const resultItemsContainer = document.getElementById('result-items');
    resultItemsContainer.innerHTML = '';

    const searchResultsContainer = document.getElementById('search-results');
    const noResultsElement = document.getElementById('no-results');

    searchResultsContainer.style.display = 'block';
    noResultsElement.style.display = 'none';
    const countElement = document.getElementById('move-search-count');
    if (countElement) { countElement.style.display = 'none'; }

    // 기술 상세 스펙 카드 렌더링 (통합)
    let moveDetailHtml = '';
    if (globalMovesData) {
      const moveData = globalMovesData.find(m => m.name === moveName);
      if (moveData) moveDetailHtml = generateMoveCardHtml(moveData);
    }

    resultItemsContainer.innerHTML = moveDetailHtml + `
    <div class="col-12 text-center my-5">
      <i class="fas fa-shield-alt fa-3x mb-3" style="color: var(--primary-color);"></i>
      <h4 class="font-weight-bold">너무 많은 포켓몬이 배우는 범용 기술입니다!</h4>
      <p class="text-muted mt-2">검색된 개체 수: <strong>${count}마리</strong> (전체 ${total}마리의 약 80% 이상)</p>
      <p>방어, 대타출동 등은 대부분의 포켓몬이 공통으로 배우므로 검색 결과 노출을 제한합니다.</p>
    </div>
  `;
  }

  // 검색 결과를 화면에 출력하는 함수
  async function displayResults(results, renderId, moveName) {
    const resultItemsContainer = document.getElementById('result-items');
    resultItemsContainer.innerHTML = '';

    const searchResultsContainer = document.getElementById('search-results');
    const noResultsElement = document.getElementById('no-results');
    const countElement = document.getElementById('move-search-count');

    // 1. 기술 상세 스펙 카드 렌더링 (병합)
    let moveDetailHtml = '';
    if (globalMovesData && globalMovesData.length > 0) {
      const moveData = globalMovesData.find(m => m.name === moveName);
      if (moveData) moveDetailHtml = generateMoveCardHtml(moveData);
    }

    // 카드 컨테이너 주입
    if (moveDetailHtml) {
      const detailDiv = document.createElement('div');
      detailDiv.className = 'col-12 w-100 mb-2'; // 100% 가로 너비 확보
      detailDiv.innerHTML = moveDetailHtml;
      resultItemsContainer.appendChild(detailDiv);
    }

    if (results.length > 0) {
      // 검색 결과가 있을 때만 검색 결과 창을 표시
      searchResultsContainer.style.display = 'block';
      noResultsElement.style.display = 'none';
      if (countElement) {
        countElement.textContent = `${results.length}마리`;
        countElement.style.display = 'inline-block';
      }

      // 스켈레톤 UI 생성 (초기 대기 화면)
      const skeletonFragment = document.createDocumentFragment();
      for (let i = 0; i < Math.min(results.length, 12); i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.classList.add('col-4', 'col-sm-3', 'col-md-2', 'mb-3', 'px-1', 'px-md-2');
        skeletonCard.innerHTML = `
          <div class="card h-100 text-center p-1 p-md-2 shadow-sm skeleton-card" style="border-radius: 12px; background: #e0e0e0; animation: pulse 1.5s infinite;">
            <div style="width: 70%; padding-top: 70%; margin: 10px auto; background: #d0d0d0; border-radius: 50%;"></div>
            <div style="height: 12px; background: #d0d0d0; margin: 10px 10%; border-radius: 4px;"></div>
            <div style="height: 10px; background: #d0d0d0; margin: 5px 20%; border-radius: 4px;"></div>
          </div>
        `;
        skeletonFragment.appendChild(skeletonCard);
      }
      resultItemsContainer.appendChild(skeletonFragment);

      // 성능 최적화: 청크(Chunk) 비동기 렌더링
      // 한 번에 화면을 멈추게 만들지 않도록 50개씩 나눠서 그립니다.
      const CHUNK_SIZE = 50;

      // 내부 렌더링 함수
      async function renderChunk(startIndex) {
        if (currentRenderId !== renderId) return; // 이전 검색 결과면 렌더링 중지!

        // 첫 렌더링 시 스켈레톤 UI 제거 (상태 카드 보존)
        if (startIndex === 0) {
          const skeletons = resultItemsContainer.querySelectorAll('.skeleton-card');
          skeletons.forEach(el => {
            if (el.parentElement) el.parentElement.remove();
          });
        }

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

        if (currentRenderId !== renderId) return; // await 중 변경되었을 수 있으므로 다시 체크

        // DOM 요소 생성 및 조립
        chunk.forEach((result, index) => {
          const [pokemonName, skillInfo] = result.split(' - ');
          const imageUrl = imageUrls[index];

          const resultElement = document.createElement('div');
          resultElement.classList.add('col-4', 'col-sm-3', 'col-md-2', 'mb-3', 'px-1', 'px-md-2');

          const card = document.createElement('div');
          card.classList.add('card', 'h-100', 'text-center', 'p-1', 'p-md-2', 'shadow-sm', 'fade-in');
          card.style.borderRadius = '12px';
          card.style.cursor = 'pointer'; // 클릭 가능하게 마우스 포인터 변경

          // 추가 기능: 포켓몬 클릭 시 교차 검색 네비게이션
          card.addEventListener('click', () => {
            const isSV = document.getElementById('moveSearchSV').checked;
            if (isSV) {
              window.location.hash = '#sv';
              if (typeof window.searchPokemonSV === 'function') {
                window.searchPokemonSV(pokemonName);
              }
            } else {
              window.location.hash = '#usum';
              if (typeof window.searchPokemonUSUM === 'function') {
                window.searchPokemonUSUM(pokemonName);
              }
            }
          });

          const pokemonImage = document.createElement('img');
          pokemonImage.src = imageUrl;
          pokemonImage.alt = pokemonName;
          pokemonImage.classList.add('card-img-top', 'mx-auto', 'mt-1');
          pokemonImage.style.width = '100%';
          pokemonImage.style.maxWidth = '70px';
          pokemonImage.style.height = 'auto';

          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body', 'p-1', 'd-flex', 'flex-column', 'justify-content-center');

          const cardTitle = document.createElement('div');
          cardTitle.classList.add('font-weight-bold');
          cardTitle.style.fontSize = '0.8rem';
          cardTitle.style.lineHeight = '1.2';
          cardTitle.style.wordBreak = 'keep-all';
          cardTitle.textContent = pokemonName;

          const cardText = document.createElement('div');
          cardText.classList.add('text-muted', 'mt-1');
          cardText.style.fontSize = '0.7rem';
          cardText.style.lineHeight = '1.2';
          cardText.style.wordBreak = 'keep-all';
          cardText.textContent = skillInfo;

          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardText);

          card.appendChild(pokemonImage);
          card.appendChild(cardBody);
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
      if (countElement) { countElement.style.display = 'none'; }
    }
  }

  document.getElementById('move-name-input').addEventListener('keypress', function (event) {
    // 엔터 키의 키코드는 13입니다.
    if (event.keyCode === 13) {
      event.preventDefault(); // 폼이 실제로 제출되는 것을 방지합니다.
      document.getElementById('search-results').style.display = 'none'; // 엔터 검색 시 리스트 숨김
      searchMove(); // 검색 함수를 호출합니다.
    }
  });

  // 라디오 버튼 변경 시 즉시 재검색 트리거
  const radioButtons = document.querySelectorAll('input[name="moveSearchVersion"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', function () {
      if (document.getElementById('move-name-input').value.trim() !== '') {
        searchMove();
      }
    });
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

    if (searchText.length >= 1) {
      let filteredMoves = [];

      // 1. globalMovesData에서 스펙 DB 기반 검색 (타입 뱃지 포함)
      if (globalMovesData && globalMovesData.length > 0) {
        const detailMatches = globalMovesData.filter(m => m.name.includes(searchText)).slice(0, 10);
        filteredMoves = detailMatches.map(m => ({ name: m.name, type: m.type }));
      }

      // 2. 만약 moves.json에 없는(누락된) 기술이라면 기존 포켓몬 DB의 Set에서 보충
      if (filteredMoves.length < 10 && uniqueMovesSet.length > 0) {
        const textMatches = uniqueMovesSet
          .filter(move => move.toLowerCase().includes(searchText) && !filteredMoves.some(m => m.name === move))
          .slice(0, 10 - filteredMoves.length)
          .map(name => ({ name, type: '알수없음' }));
        filteredMoves = filteredMoves.concat(textMatches);
      }

      if (filteredMoves.length > 0) {
        suggestionBox.style.display = 'block';

        filteredMoves.forEach(match => {
          let suggestionBtn = document.createElement('a');
          suggestionBtn.href = "javascript:void(0);";

          if (match.type !== '알수없음') {
            suggestionBtn.setAttribute('class', 'list-group-item list-group-item-action border-0 px-4 py-3 d-flex justify-content-between align-items-center');
            suggestionBtn.innerHTML = `<strong>${match.name}</strong> <span class="badge ${getTypeClass(match.type)}" style="font-size:0.8rem;">${match.type}</span>`;
          } else {
            suggestionBtn.setAttribute('class', 'list-group-item list-group-item-action border-0 px-4 py-3 font-weight-bold');
            suggestionBtn.textContent = match.name;
          }

          // 기술명 클릭 시 행동
          suggestionBtn.addEventListener('click', function () {
            moveSearchInput.value = match.name; // 텍스트 덮어쓰기
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

  // --- 추가된 기술 스펙 카드 렌더링 헬퍼 함수 ---
  function getTypeClass(koType) {
    const typeMap = {
      "노말": "type-normal", "불꽃": "type-fire", "물": "type-water",
      "풀": "type-grass", "전기": "type-electric", "얼음": "type-ice",
      "격투": "type-fighting", "독": "type-poison", "땅": "type-ground",
      "비행": "type-flying", "에스퍼": "type-psychic", "벌레": "type-bug",
      "바위": "type-rock", "고스트": "type-ghost", "드래곤": "type-dragon",
      "악": "type-dark", "강철": "type-steel", "페어리": "type-fairy"
    };
    return typeMap[koType] || "type-normal";
  }

  function getCategoryColor(cat) {
    if (cat === "물리") return "#E62829"; // Red
    if (cat === "특수") return "#203B6D"; // Blue
    return "#8A8A8A"; // Gray Status
  }

  function generateMoveCardHtml(move) {
    const catColor = getCategoryColor(move.category);
    return `
      <div class="col-12 mb-4">
        <div class="card shadow-sm border-0" style="border-radius: 15px; overflow: hidden; animation: fadeIn 0.4s ease-out;">
          <div class="card-header pb-1" style="background-color: transparent; border-bottom: 2px solid #f1f3f5;">
              <div class="d-flex justify-content-between align-items-center mb-2 mt-2">
                  <h2 class="mb-0 font-weight-bold" style="color: var(--primary-color); letter-spacing: -0.02em;">${move.name}</h2>
                  <div class="d-flex align-items-center">
                      <span class="type-badge ${getTypeClass(move.type)} mr-2 text-center" style="min-width: 60px;">${move.type}</span>
                      <span class="badge" style="background-color: ${catColor}; color: white; padding: 0.35rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.02em; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${move.category}</span>
                  </div>
              </div>
          </div>
          <div class="card-body px-3 px-md-4 pb-4">
              <div class="row text-center my-3">
                  <div class="col-4">
                      <div class="text-muted small font-weight-bold mb-1" style="letter-spacing: 0.05em;">위력</div>
                      <h3 class="mb-0" style="font-weight: 800; color: var(--text-main); font-size: 1.8rem;">${move.power}</h3>
                  </div>
                  <div class="col-4" style="border-left: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08);">
                      <div class="text-muted small font-weight-bold mb-1" style="letter-spacing: 0.05em;">명중률</div>
                      <h3 class="mb-0" style="font-weight: 800; color: var(--text-main); font-size: 1.8rem;">${move.accuracy === '-' ? '-' : move.accuracy + '%'}</h3>
                  </div>
                  <div class="col-4">
                      <div class="text-muted small font-weight-bold mb-1" style="letter-spacing: 0.05em;">PP</div>
                      <h3 class="mb-0" style="font-weight: 800; color: var(--text-main); font-size: 1.8rem;">${move.pp}</h3>
                  </div>
              </div>
              <div class="p-3 mt-3" style="border-radius: 12px; background-color: rgba(106, 44, 145, 0.04); border-left: 4px solid var(--primary-color);">
                  <p class="mb-0" style="font-size: 1rem; line-height: 1.5; color: var(--text-main); font-family: 'Pretendard', sans-serif;">${move.description || '효과 설명이 없습니다.'}</p>
              </div>
          </div>
        </div>
      </div>
      <!-- 포켓몬 리스트 구분선 -->
      <div class="col-12 mt-2 mb-3">
        <h5 class="font-weight-bold" style="color: #4a4a4a;"><i class="fas fa-list-ul mr-2"></i>이 기술을 배우는 포켓몬</h5>
      </div>
    `;
  }
})();