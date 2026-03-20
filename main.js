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

// 자동 시간 테마 설정 (7 PM ~ 7 AM 다크모드)
function applyTimeTheme() {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  document.body.setAttribute('data-theme', isNight ? 'dark' : 'light');
}

async function triggerJackpotSequence(count) {
  if (count) currentSetCount = count;
  const container = document.getElementById("result");
  const initialControls = document.getElementById("initialControls");
  const resetControls = document.getElementById("resetControls");
  
  // 상태 변경
  initialControls.classList.add("hidden");
  resetControls.classList.add("hidden");
  container.innerHTML = `
    <div class="jackpot-overlay">
      <div class="scanning-text">ANALYZING HIGH-STAKES DATA...</div>
      <div class="jackpot-hype">THIS IS THE $10,000,000 WINNER</div>
      <div class="loading-bar"><div class="loading-progress"></div></div>
    </div>
  `;

  // 애니메이션 지연 (2초)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  renderResults();
  resetControls.classList.remove("hidden");
}

function renderResults() {
  const container = document.getElementById("result");
  container.innerHTML = "";

  const titles = [
    "THE $10M JACKPOT",
    "CERTIFIED WINNER",
    "ULTIMATE FORTUNE",
    "THE GOLDEN TICKET",
    "WEALTH ACCELERATOR",
    "JACKPOT GENESIS",
    "VICTORY LEGACY",
    "SUPREME RICHES",
    "GLORY GUARDIAN",
    "FORTUNE MASTER"
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
  // 다시 뽑기 누르면 다시 5/10 선택 화면으로 가거나 바로 현재 개수로 다시 뽑기 가능
  // 여기서는 현재 개수(currentSetCount)로 바로 애니메이션 실행
  triggerJackpotSequence();
});

// 초기 실행
applyTimeTheme();
// 처음엔 결과를 보여주지 않고 빈 상태로 대기 (사용자가 선택하도록)
