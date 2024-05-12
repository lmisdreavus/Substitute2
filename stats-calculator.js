// 전역 스코프에 currentPokemonStats를 정의합니다.
let currentPokemonStats = {};
let pokemonsData = []; // 포켓몬 데이터를 저장할 배열

const statKeys = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];

// 랭크업,다운 계산
function calculateRankMultiplier(rank) {
    const rankMultipliers = {
        '-6': 1/4, '-5': 2/7, '-4': 1/3, '-3': 2/5, '-2': 1/2, '-1': 2/3,
        '0': 1,
        '1': 3/2, '2': 2, '3': 5/2, '4': 3, '5': 7/2, '6': 4
    };
    return rankMultipliers[rank.toString()] || 1;
}

function calculateStats() {
    const level = parseInt(document.getElementById('level-input').value);

    statKeys.forEach(statKey => {
        const baseStat = parseInt(document.getElementById(`base-${statKey}`).value) || 0;
        const iv = parseInt(document.getElementById(`iv-${statKey}`).value);
        const ev = parseInt(document.getElementById(`ev-${statKey}`).value);

        let natureModifier = 1.0; // 체력에 대해서는 기본적으로 1.0 사용
        if (statKey !== 'hp') { // 체력이 아닌 다른 스탯의 경우
            natureModifier = parseFloat(document.getElementById(`nature-modifier-${statKey}`).value);
        }

        const rankModifier = document.getElementById(`rank-modifier-${statKey}`) ?
        calculateRankMultiplier(document.getElementById(`rank-modifier-${statKey}`).value) : 1;

        const resultElement = document.getElementById(`result-${statKey}`);
        // 체력을 제외한 나머지 스탯 계산에 랭크 배율 적용
        const statResult = statKey === 'hp' ?
            calculateHP(baseStat, iv, ev, level) :
            Math.floor(calculateOtherStat(baseStat, iv, ev, level, natureModifier) * rankModifier);

        if (resultElement) resultElement.textContent = statResult;
    });
}

// 체력과 다른 스탯을 계산하는 함수입니다.
function calculateHP(baseStat, iv, ev, level) {
    return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100 + level + 10);
}

function calculateOtherStat(baseStat, iv, ev, level, natureModifier) {
    return Math.floor((((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100 + 5) * natureModifier);
}

// 포켓몬 검색 함수
function searchPokemon() {
    const searchValue = document.getElementById('pokemon-name-input').value.trim().toLowerCase();
    if (!searchValue) {
        // 검색어가 없을 경우 결과 리스트를 숨깁니다.
        document.getElementById('pokemon-search-results').style.display = 'none';
        return;
    }

    // 유사 결과 리스트를 표시하는 로직
    const similarResults = pokemonsData.filter(p => p.name.toLowerCase().includes(searchValue));
    const resultsElement = document.getElementById('pokemon-search-results');
    resultsElement.innerHTML = '';
    similarResults.forEach(pokemon => {
        const listItem = document.createElement('a');
        listItem.classList.add('list-group-item', 'list-group-item-action');
        listItem.textContent = pokemon.name;
        listItem.href = '#';
        listItem.onclick = () => selectPokemon(pokemon);
        resultsElement.appendChild(listItem);
    });
    resultsElement.style.display = 'block';
}

// 검색 버튼 클릭 시 실행되는 함수
function onSearchButtonClick() {
    const searchValue = document.getElementById('pokemon-name-input').value.trim().toLowerCase();
    const pokemon = pokemonsData.find(p => p.name.toLowerCase() === searchValue);

    if (pokemon) {
        selectPokemon(pokemon);
    }

    // 검색 결과 리스트 숨기기
    document.getElementById('pokemon-search-results').style.display = 'none';
}

// 포켓몬 선택 함수
function selectPokemon(pokemon) {
    // 종족값을 가져와서 저장합니다.
    currentPokemonStats = pokemon.baseStats;

    // 종족값을 입력 필드에 설정합니다.
    ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'].forEach(stat => {
        const baseStatElement = document.getElementById(`base-${stat}`);
        if (baseStatElement) baseStatElement.value = pokemon.baseStats[stat];
    });

    // 유사 결과 리스트 숨기기
    document.getElementById('pokemon-search-results').style.display = 'none';
}

// 페이지 로드가 완료되면 이벤트 리스너를 설정합니다.
document.addEventListener('DOMContentLoaded', () => {
    // JSON 파일에서 포켓몬 데이터를 불러옵니다.
    fetch('pokemon.json')
        .then(response => response.json())
        .then(data => pokemonsData = data)
        .catch(error => console.error('Error loading JSON Data: ', error));

    // 이벤트 리스너를 추가합니다.
    // 중복된 이벤트 리스너 제거
    document.getElementById('pokemon-name-input').addEventListener('input', searchPokemon);
    document.getElementById('search-btn').addEventListener('click', onSearchButtonClick);
    
    const calculateBtn = document.getElementById('calculate-btn');
    
    // 검색창에 엔터 키 입력 이벤트 리스너 추가
    document.getElementById('pokemon-name-input').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            onSearchButtonClick();
        }
    });

    document.getElementById('level-50').addEventListener('click', () => {
        document.getElementById('level-input').value = 50;
        calculateStats(); // 레벨 변경 후 능력치 재계산
    });

    document.getElementById('level-100').addEventListener('click', () => {
        document.getElementById('level-input').value = 100;
        calculateStats(); // 레벨 변경 후 능력치 재계산
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateStats);
    } else {
        console.error('Calculate button not found in the DOM');
    }
});

// 노력치 버튼 클릭 이벤트 처리
document.getElementById('ev-hp-max').addEventListener('click', function() {
    document.getElementById('ev-hp').value = 252;
  });
  
  document.getElementById('ev-hp-min').addEventListener('click', function() {
    document.getElementById('ev-hp').value = 0;
  });

  document.getElementById('ev-attack-max').addEventListener('click', function() {
    document.getElementById('ev-attack').value = 252;
  });
  
  document.getElementById('ev-attack-min').addEventListener('click', function() {
    document.getElementById('ev-attack').value = 0;
  });

  document.getElementById('ev-defense-max').addEventListener('click', function() {
    document.getElementById('ev-defense').value = 252;
  });
  
  document.getElementById('ev-defense-min').addEventListener('click', function() {
    document.getElementById('ev-defense').value = 0;
  });

  document.getElementById('ev-spAttack-max').addEventListener('click', function() {
    document.getElementById('ev-spAttack').value = 252;
  });
  
  document.getElementById('ev-spAttack-min').addEventListener('click', function() {
    document.getElementById('ev-spAttack').value = 0;
  });

  document.getElementById('ev-spDefense-max').addEventListener('click', function() {
    document.getElementById('ev-spDefense').value = 252;
  });
  
  document.getElementById('ev-spDefense-min').addEventListener('click', function() {
    document.getElementById('ev-spDefense').value = 0;
  });

  document.getElementById('ev-speed-max').addEventListener('click', function() {
    document.getElementById('ev-speed').value = 252;
  });
  
  document.getElementById('ev-speed-min').addEventListener('click', function() {
    document.getElementById('ev-speed').value = 0;
  });
