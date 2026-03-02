(() => {
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
  suggestionBox.setAttribute('class', 'suggestion-box list-group shadow-sm mt-1 fade-in');

  let suggestionItem = document.createElement('a');
  suggestionItem.href = "#";

  const searchInput = document.getElementById('search-sv');
  searchInput.parentNode.appendChild(suggestionBox);
  const resultDiv = document.getElementById('result-sv');

  // 입력 중 유사 결과 표시
  searchInput.addEventListener('input', function () {
    const searchText = searchInput.value;
    suggestionBox.innerHTML = ''; // 기존 제안 삭제


    if (searchText.length >= 2) {
      for (let pokemon of pokemons) {
        if (pokemon.name.includes(searchText)) {
          let suggestion = document.createElement('a');
          suggestion.href = "javascript:void(0);";
          suggestion.setAttribute('class', 'list-group-item list-group-item-action border-0');
          suggestion.innerHTML = pokemon.name;
          suggestion.addEventListener('click', function () {
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
  const searchButton = document.getElementById('search-button-sv');
  searchButton.addEventListener('click', function () {
    const searchText = searchInput.value;
    const matchedPokemon = pokemons.find(p => p.name.toLowerCase() === searchText.toLowerCase());

    if (matchedPokemon) {
      displayPokemonData(matchedPokemon);
    }
    suggestionBox.innerHTML = ''; // 검색 후 제안 삭제
  });

  // 다른 페이지(기술 검색 등)에서 포켓몬 검색을 연동하기 위한 글로벌 함수 로출
  window.searchPokemonSV = function (pokemonName) {
    if (!pokemons.length) {
      // 데이터가 아직 로드되지 않은 경우 약간 대기
      setTimeout(() => window.searchPokemonSV(pokemonName), 100);
      return;
    }
    const matchedPokemon = pokemons.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
    if (matchedPokemon) {
      searchInput.value = matchedPokemon.name;
      displayPokemonData(matchedPokemon);
      // 검색 결과 상단으로 스크롤 복귀
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 뱃지 클릭 시 기술 검색 탭으로 넘어가는 전역 함수
  window.navigateToMoveSearch = function (moveName) {
    window.location.hash = '#move';
    if (typeof window.searchMoveByName === 'function') {
      window.searchMoveByName(moveName);
    }
  };

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

      // PokeAPI에서 공식 일러스트(Official Artwork) 이미지를 가져옵니다.
      // 못 찾으면 기본 스프라이트, 그것도 없으면 pokemon-species endpoint 에서 다시 추적하거나 예외처리
      // (현재는 에러를 뱉지 않게 단순화. 추후 404 발생 시 기본 아이콘 등으로 대체 가능)
      const url = `https://pokeapi.co/api/v2/pokemon/${apiName}`;
      const response = await fetch(url);
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

  // 기술 텍스트 배열을 뱃지 UI HTML로 변환하는 유틸리티 함수
  function formatSkillListToBadges(skillsArray) {
    if (!skillsArray || skillsArray.length === 0) return '<div class="text-muted small">없음</div>';

    let badgesHtml = '<div class="skill-badge-container">';
    skillsArray.forEach(skillStr => {
      // 1. 잡다한 접두사("- ", "* " 등) 깔끔하게 제거
      const cleanSkillStr = skillStr.replace(/^[-*\s]+/, '');

      // 정규식으로 [숫자] 또는 [TM번호] 부분을 추출
      const match = cleanSkillStr.match(/^(\[[^\]]+\])\s*(.*)$/);
      if (match) {
        const prefix = match[1]; // 예: [1], [TM01]
        const skillName = match[2].replace(/'/g, "\\'"); // 예: 할퀴기 (혹시 모를 따옴표 이스케이프)
        // 나중에 클릭 이벤트를 달 수 있도록 a 태그로 렌더링
        badgesHtml += `<a href="javascript:void(0);" onclick="window.navigateToMoveSearch('${skillName}')" class="skill-badge"><span class="badge-label">${prefix}</span>${skillName}</a>`;
      } else {
        // 괄호 패턴이 없는 경우 (예: 교배기)
        const safeSkill = cleanSkillStr.replace(/'/g, "\\'");
        badgesHtml += `<a href="javascript:void(0);" onclick="window.navigateToMoveSearch('${safeSkill}')" class="skill-badge">${cleanSkillStr}</a>`;
      }
    });
    badgesHtml += '</div>';
    return badgesHtml;
  }

  // 타입 텍스트("물, 비행")를 뱃지 HTML로 변환하는 함수
  function formatTypesToBadges(typeStr) {
    if (!typeStr || typeStr === '알 수 없음') return '<span class="text-muted small">알 수 없음</span>';

    // "물, 비행" -> ["물", "비행"]
    const types = typeStr.split(',').map(t => t.trim());

    // 영어 타입명과 한국어 매핑이 필요하면 여기에 추가 하지만, 
    // 현재 포켓몬 데이터가 한국어로 바로 들어오므로 한국어 그대로 매칭.
    const typeClassMap = {
      '노말': 'type-normal', '불꽃': 'type-fire', '물': 'type-water', '풀': 'type-grass',
      '전기': 'type-electric', '얼음': 'type-ice', '격투': 'type-fighting', '독': 'type-poison',
      '땅': 'type-ground', '비행': 'type-flying', '에스퍼': 'type-psychic', '벌레': 'type-bug',
      '바위': 'type-rock', '고스트': 'type-ghost', '드래곤': 'type-dragon', '악': 'type-dark',
      '강철': 'type-steel', '페어리': 'type-fairy'
    };

    let badgesHtml = '<div class="type-badge-container">';
    types.forEach(type => {
      const typeClass = typeClassMap[type] || 'bg-secondary'; // 매칭 안되면 기본 회색
      badgesHtml += `<span class="type-badge ${typeClass}">${type}</span>`;
    });
    badgesHtml += '</div>';
    return badgesHtml;
  }

  // 특성 텍스트("심록 (1) | 엽록소(숨특)")를 태그 HTML로 변환하는 함수
  function formatAbilitiesToTags(abilityStr) {
    if (!abilityStr || abilityStr === '알 수 없음') return '<span class="text-muted small">알 수 없음</span>';

    // 파이프(|) 또는 쉼표(,) 단위로 분리
    const abilities = abilityStr.split(/[|,]/).map(a => a.trim());

    let tagsHtml = '<div class="ability-container">';
    abilities.forEach(ability => {
      // 리자몽의 "맹화 (1)", "선파워(숨특)" 처럼 뒤에 괄호가 붙은 경우를 감지
      const match = ability.match(/^(.*?)(?:\s*\(([^)]+)\))?$/);
      if (match) {
        let abilityName = match[1].trim();
        let hiddenText = match[2] ? `<span class="hidden-ability">(${match[2]})</span>` : '';
        tagsHtml += `<span class="ability-tag">${abilityName}${hiddenText}</span>`;
      } else {
        tagsHtml += `<span class="ability-tag">${ability}</span>`;
      }
    });
    tagsHtml += '</div>';
    return tagsHtml;
  }

  async function displayPokemonData(pokemon) {
    let eggSkills = formatSkillListToBadges(pokemon.eggSkills);
    let levelUpSkills = formatSkillListToBadges(pokemon.levelUpSkills);
    let machineSkills = formatSkillListToBadges(pokemon.machineSkills);
    let RelearnSkills = formatSkillListToBadges(pokemon.RelearnSkills);

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

    // 종족값 총합 계산
    const baseStatTotal = Object.values(pokemon.baseStats).reduce((sum, stat) => sum + stat, 0);

    let resultHtml = `
    <div class="card mb-3 fade-in">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="mb-0">${pokemon.name} <span class="text-muted" style="font-size: 0.6em;">(#${pokemon.number})</span></h2>
      </div>
      <div class="card-body">
        <div class="text-center mb-4">
          <img src="${imageUrl}" alt="${pokemon.name}" class="img-fluid" style="max-width: 200px; border-radius: 12px; background: rgba(0,0,0,0.03);">
        </div>
        <div class="d-flex align-items-center mb-2">
          <strong style="width: 50px;">타입:</strong> ${formatTypesToBadges(pokemon.type)}
        </div>
        <div class="d-flex align-items-center mb-3">
          <strong style="width: 50px;">특성:</strong> ${formatAbilitiesToTags(pokemon.abilities)}
        </div>
        <div class="mb-2"><strong>종족값 (총합: <span style="color: var(--primary-color); font-weight: 800;">${baseStatTotal}</span>):</strong></div>
        <div class="stat-container">
        ${Object.keys(pokemon.baseStats).map(stat => {
      const statValue = pokemon.baseStats[stat];
      const widthPercent = Math.min(statValue / MAX_STAT_VALUE * 100, 100);
      const translatedStat = statTranslations[stat] || stat;
      return `<div class="stat-bar" style="width: ${widthPercent}%;">${translatedStat}: ${statValue}</div>`;
    }).join('')}    
        </div>
        
        <div class="move-tabs">
          <ul class="nav nav-tabs" id="moveTabs-${pokemon.number}" role="tablist">
            <li class="nav-item" role="presentation">
              <a class="nav-link active" id="levelup-tab-${pokemon.number}" data-toggle="tab" href="#levelup-${pokemon.number}" role="tab" aria-controls="levelup-${pokemon.number}" aria-selected="true">자력기</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="machine-tab-${pokemon.number}" data-toggle="tab" href="#machine-${pokemon.number}" role="tab" aria-controls="machine-${pokemon.number}" aria-selected="false">기술머신</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="egg-tab-${pokemon.number}" data-toggle="tab" href="#egg-${pokemon.number}" role="tab" aria-controls="egg-${pokemon.number}" aria-selected="false">교배기</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="relearn-tab-${pokemon.number}" data-toggle="tab" href="#relearn-${pokemon.number}" role="tab" aria-controls="relearn-${pokemon.number}" aria-selected="false">떠올리기</a>
            </li>
          </ul>
          <div class="tab-content" id="moveTabsContent-${pokemon.number}">
            <div class="tab-pane fade show active" id="levelup-${pokemon.number}" role="tabpanel" aria-labelledby="levelup-tab-${pokemon.number}">
              ${levelUpSkills}
            </div>
            <div class="tab-pane fade" id="machine-${pokemon.number}" role="tabpanel" aria-labelledby="machine-tab-${pokemon.number}">
              ${machineSkills}
            </div>
            <div class="tab-pane fade" id="egg-${pokemon.number}" role="tabpanel" aria-labelledby="egg-tab-${pokemon.number}">
              ${eggSkills}
            </div>
            <div class="tab-pane fade" id="relearn-${pokemon.number}" role="tabpanel" aria-labelledby="relearn-tab-${pokemon.number}">
              ${RelearnSkills}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    resultDiv.innerHTML = resultHtml;

  }
})();