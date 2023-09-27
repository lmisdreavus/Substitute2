let pokemons = [];

// JSON 데이터 불러오기
fetch('pokemon.json')
  .then(response => response.json())
  .then(data => pokemons = data)
  .catch(error => console.error('Error loading Pokémon data:', error));

// 검색 이벤트 리스너
document.getElementById('search').addEventListener('input', function () {
  const searchText = this.value;
  const resultDiv = document.getElementById('result');

  // 포켓몬 데이터 검색
  const pokemon = pokemons.find(p => p.name === searchText);

  // 결과 출력
  if (pokemon) {
    let resultHtml = `
      <h2>${pokemon.name} (#${pokemon.number})</h2>
      <p>타입: ${pokemon.type}</p>
      <p>종족값: ${pokemon.baseStats}</p>
      <p>특성: ${pokemon.abilities}</p>
      <p>레벨 업으로 배우는 기술:<br> ${pokemon.levelUpSkills.join('<br>')}</p>
      <p>기술머신으로 배우는 기술:<br> ${pokemon.machineSkills.join('<br>')}</p>
      <p>알 부화로 배우는 기술:<br> ${pokemon.eggSkills.join('<br>')}</p>
    `;
    resultDiv.innerHTML = resultHtml;
  } else {
    resultDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
  }
});
