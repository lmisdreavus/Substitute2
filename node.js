const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// pokemon.json 파일 읽기
fs.readFile('pokemon.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const pokemons = JSON.parse(data);

  // 포켓몬 데이터에 영어 이름 추가
  for (const pokemon of pokemons) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      pokemon.englishName = data.name;
    } catch (error) {
      console.error(`Error fetching data for ${pokemon.name}:`, error);
      pokemon.englishName = '';
    }
  }

  // 업데이트된 포켓몬 데이터를 파일에 저장
  fs.writeFile('pokemon.json', JSON.stringify(pokemons, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Pokemon data updated successfully!');
  });
});