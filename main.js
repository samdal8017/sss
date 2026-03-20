const MAX = 45;
const PICK = 6;
const SET_COUNT = 5;

// 가중치 배열
let freq = Array(MAX + 1).fill(1);
for (let i = 0; i < 2000; i++) {
  let n = Math.floor(Math.random() * MAX) + 1;
  freq[n]++;
}

function weightedPick() {
  let total = freq.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 1; i <= MAX; i++) {
    r -= freq[i];
    if (r <= 0) return i;
  }
}

function generateSet() {
  let set = new Set();
  while (set.size < PICK) {
    set.add(weightedPick());
  }
  return Array.from(set).sort((a, b) => a - b);
}

function getBallColorClass(num) {
  if (num <= 10) return "ball-yellow";
  if (num <= 20) return "ball-blue";
  if (num <= 30) return "ball-red";
  if (num <= 40) return "ball-gray";
  return "ball-green";
}

function generateAll() {
  const container = document.getElementById("result");
  container.innerHTML = "";

  for (let i = 0; i < SET_COUNT; i++) {
    const numbers = generateSet();
    const card = document.createElement("div");
    card.className = "set-card";
    card.style.animationDelay = `${i * 0.1}s`;

    const header = document.createElement("div");
    header.className = "set-header";
    header.innerText = `LUCKY SET ${i + 1}`;
    card.appendChild(header);

    const ballContainer = document.createElement("div");
    ballContainer.className = "ball-container";

    numbers.forEach((num, idx) => {
      const ball = document.createElement("div");
      ball.className = `lotto-ball ${getBallColorClass(num)}`;
      ball.innerText = num;
      ball.style.animationDelay = `${(i * 0.1) + (idx * 0.05)}s`;
      ballContainer.appendChild(ball);
    });

    card.appendChild(ballContainer);
    container.appendChild(card);
  }
}

document.getElementById("generateBtn").addEventListener("click", generateAll);
document.getElementById("resetBtn").addEventListener("click", generateAll);

// 초기 실행
generateAll();
