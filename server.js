const express = require('express');
const app = express();
const port = 3000; // 포트 번호를 3000으로 설정

// 업데이트 내역 데이터 (나중에 데이터베이스로 대체 가능)
let updates = [
  { id: 1, date: '2023년 5월 10일', content: '남청의 원반 게임 업데이트를 반영하여 포켓몬 데이터를 업데이트했습니다.' },
  { id: 2, date: '2023년 4월 15일', content: '새로운 기술 검색 기능을 추가했습니다.' }
];

// 정적 파일 제공
app.use(express.static('public'));

// JSON 데이터 파싱 미들웨어
app.use(express.json());

// 업데이트 내역 가져오기
app.get('/api/updates', (req, res) => {
  res.json(updates);
});

// 새로운 업데이트 추가
app.post('/api/updates', (req, res) => {
  const newUpdate = req.body;
  newUpdate.id = updates.length + 1;
  updates.push(newUpdate);
  res.json(newUpdate);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});