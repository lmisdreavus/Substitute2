

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

// 검색 결과를 화면에 출력하는 함수입니다.
function displayResults(results) {
  // 결과 컨테이너를 비웁니다.
  resultsContainer.innerHTML = '';
  
  if (results.length > 0) {
    // 결과가 있을 경우, 각각을 리스트 아이템으로 만들어 화면에 표시합니다.
    results.forEach(result => {
      const resultElement = document.createElement('li');
      resultElement.classList.add('list-group-item'); // Bootstrap 클래스 추가
      resultElement.textContent = result;
      resultsContainer.appendChild(resultElement);
    });
  } else {
    // 결과가 없을 경우, 사용자에게 알립니다.
    const noResultElement = document.createElement('li');
    noResultElement.classList.add('list-group-item', 'list-group-item-action', 'active');
    noResultElement.textContent = '검색 결과가 없습니다.';
    resultsContainer.appendChild(noResultElement);
  }
}

document.getElementById('move-name-input').addEventListener('keypress', function(event) {
  // 엔터 키의 키코드는 13입니다.
  if (event.keyCode === 13) {
    event.preventDefault(); // 폼이 실제로 제출되는 것을 방지합니다.
    searchMove(); // 검색 함수를 호출합니다.
  }
});