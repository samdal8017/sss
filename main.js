const MAX = 45;
const PICK = 6;
let currentSetCount = 5;

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

function applyTimeTheme() {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  document.body.setAttribute('data-theme', isNight ? 'dark' : 'light');
}

function showInitialMenu() {
  const container = document.getElementById("result");
  const initialControls = document.getElementById("initialControls");
  const resetControls = document.getElementById("resetControls");
  
  container.innerHTML = "";
  initialControls.classList.remove("hidden");
  resetControls.classList.add("hidden");
}

async function triggerJackpotSequence(count) {
  if (count) currentSetCount = count;
  const container = document.getElementById("result");
  const initialControls = document.getElementById("initialControls");
  const resetControls = document.getElementById("resetControls");
  
  initialControls.classList.add("hidden");
  resetControls.classList.add("hidden");
  
  // 로또 기계 애니메이션 HTML 생성
  container.innerHTML = `
    <div class="machine-container">
      <div class="scanning-text">EXTRACTING WINNING NUMBERS...</div>
      <div class="picking-balls">
        <div class="shuffling-ball" id="ball-0">?</div>
        <div class="shuffling-ball" id="ball-1">?</div>
        <div class="shuffling-ball" id="ball-2">?</div>
        <div class="shuffling-ball" id="ball-3">?</div>
        <div class="shuffling-ball" id="ball-4">?</div>
        <div class="shuffling-ball" id="ball-5">?</div>
      </div>
      <div class="loading-bar"><div class="loading-progress"></div></div>
    </div>
  `;

  // 숫자 셔플 애니메이션 실행
  const shuffleInterval = setInterval(() => {
    for(let i=0; i<6; i++) {
      const b = document.getElementById(`ball-${i}`);
      if(b) b.innerText = Math.floor(Math.random() * 45) + 1;
    }
  }, 80);

  // 2초 대기 후 실제 결과 렌더링
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  clearInterval(shuffleInterval);
  renderResults();
  resetControls.classList.remove("hidden");
}

function renderResults() {
  const container = document.getElementById("result");
  container.innerHTML = "";

  const titles = [
    "THE $10M JACKPOT", "CERTIFIED WINNER", "ULTIMATE FORTUNE",
    "THE GOLDEN TICKET", "WEALTH ACCELERATOR", "JACKPOT GENESIS",
    "VICTORY LEGACY", "SUPREME RICHES", "GLORY GUARDIAN", "FORTUNE MASTER"
  ];

  for (let i = 0; i < currentSetCount; i++) {
    const numbers = generateSet();
    const card = document.createElement("div");
    card.className = "set-card";
    card.style.animationDelay = `${i * 0.1}s`;

    const header = document.createElement("div");
    header.className = "set-header";
    header.innerText = titles[i % titles.length];
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

document.getElementById("resetBtn").addEventListener("click", () => {
  triggerJackpotSequence();
});

applyTimeTheme();
showInitialMenu();
