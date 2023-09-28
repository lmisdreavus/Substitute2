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
    <div class="card mb-3">
      <div class="card-header">
        <h2>${pokemon.name} (#${pokemon.number})</h2>
      </div>
      <div class="card-body">
        <p><strong>타입:</strong> ${pokemon.type}</p>
        
        <table class="table table-striped mt-3">
          <thead>
            <tr>
              <th>체력</th>
              <th>공격</th>
              <th>방어</th>
              <th>특수공격</th>
              <th>특수방어</th>
              <th>스피드</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${pokemon.baseStats[0]}</td>
              <td>${pokemon.baseStats[1]}</td>
              <td>${pokemon.baseStats[2]}</td>
              <td>${pokemon.baseStats[3]}</td>
              <td>${pokemon.baseStats[4]}</td>
              <td>${pokemon.baseStats[5]}</td>
            </tr>
          </tbody>
        </table>
        
        <p><strong>특성:</strong> ${pokemon.abilities}</p>
        <p><strong>레벨 업으로 배우는 기술:</strong><br> ${pokemon.levelUpSkills.join('<br>')}</p>
        <p><strong>기술머신으로 배우는 기술:</strong><br> ${pokemon.machineSkills.join('<br>')}</p>
        <p><strong>알 부화로 배우는 기술:</strong><br> ${pokemon.eggSkills.join('<br>')}</p>
      </div>
    </div>
  `;
  resultDiv.innerHTML = resultHtml;
}
});
