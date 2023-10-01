let pokemons = [];

// JSON 데이터 불러오기
fetch('pokemon.json')
  .then(response => response.json())
  .then(data => {
    pokemons = data;
    console.log(data);
  })
  .catch(error => console.error('Error loading JSON Data: ', error));

// 검색 이벤트 리스너
document.getElementById('search').addEventListener('input', function () {
  const searchText = this.value;
  const resultDiv = document.getElementById('result');

  // 포켓몬 데이터 검색
  const pokemon = pokemons.find(p => p.name === searchText);

  

  // 결과 출력
if (pokemon) {
  let levelUpSkills = pokemon.levelUpSkills ? pokemon.levelUpSkills.join('<br>') : '없음';
  let machineSkills = pokemon.machineSkills ? pokemon.machineSkills.join('<br>') : '없음';
  let eggSkills = pokemon.eggSkills ? pokemon.eggSkills.join('<br>') : '없음';

    let resultHtml = `
      <div class="card mb-3">
        <div class="card-header">
          <h2>${pokemon.name} (#${pokemon.number})</h2>
        </div>
        <div class="card-body">
          <p><strong>타입:</strong> ${pokemon.type}</p>
          <div><strong>종족값:</strong></div>
          <div class="stat-container">
            <div class="stat-bar" style="width: ${pokemon.baseStats.hp}%;">체력: ${pokemon.baseStats.hp}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.attack}%;">공격: ${pokemon.baseStats.attack}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.defense}%;">방어: ${pokemon.baseStats.defense}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.spAttack}%;">특수공격: ${pokemon.baseStats.spAttack}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.spDefense}%;">특수방어: ${pokemon.baseStats.spDefense}</div>
            <div class="stat-bar" style="width: ${pokemon.baseStats.speed}%;">스피드: ${pokemon.baseStats.speed}</div>
          </div>
          <br>
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
