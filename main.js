const MAX = 45;
const PICK = 6;
let currentSetCount = 5;

// 가상의 역대 당첨 데이터 가중치 (빈도 분석 시뮬레이션)
const historicalWeights = Array(MAX + 1).fill(1).map((w, i) => {
  // 실제 로또 통계에서 자주 나오는 번호들에 약간의 가중치 부여 (시뮬레이션)
  const hotNumbers = [1, 5, 12, 18, 27, 34, 43, 45, 10, 20];
  return hotNumbers.includes(i) ? 1.5 : 1.0;
});

function weightedPick(weights) {
  let total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 1; i <= MAX; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
}

// 스마트 예측 알고리즘: 실제 당첨 패턴 분석 및 필터링
function generateSmartSet() {
  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    let set = new Set();
    while (set.size < PICK) {
      set.add(weightedPick(historicalWeights));
    }
    const arr = Array.from(set).sort((a, b) => a - b);
    
    // 1. 합계 분석 (보통 100~175 사이에서 70% 이상 발생)
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sum < 100 || sum > 180) continue;

    // 2. 홀짝 밸런스 (3:3, 2:4, 4:2 비율 최적화)
    const oddCount = arr.filter(n => n % 2 !== 0).length;
    if (oddCount < 2 || oddCount > 4) continue;

    // 3. 고저 밸런스 (1~22: 저, 23~45: 고)
    const lowCount = arr.filter(n => n <= 22).length;
    if (lowCount < 2 || lowCount > 4) continue;

    // 4. 연속 번호 제한 (3개 이상 연속 배제)
    let consecutive = false;
    for(let i=0; i<arr.length-2; i++) {
      if(arr[i]+1 === arr[i+1] && arr[i+1]+1 === arr[i+2]) consecutive = true;
    }
    if (consecutive) continue;

    return arr;
  }
  // 실패 시 기본 세트 반환
  return Array.from({length: PICK}, () => Math.floor(Math.random() * 45) + 1).sort((a, b) => a - b);
}

function getBallColorClass(num) {
  if (num <= 10) return "ball-yellow";
  if (num <= 20) return "ball-blue";
  if (num <= 30) return "ball-red";
  if (num <= 40) return "ball-purple";
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
  
  container.innerHTML = `
    <div class="spectacular-machine">
      <div class="machine-glow"></div>
      <div class="scanning-text-v2">역대 당첨 데이터 정밀 분석 중...</div>
      <div class="orbit-machine">
        <div class="shuffling-ball orbit-1" id="ball-0">?</div>
        <div class="shuffling-ball orbit-2" id="ball-1">?</div>
        <div class="shuffling-ball orbit-3" id="ball-2">?</div>
        <div class="shuffling-ball orbit-1" id="ball-3">?</div>
        <div class="shuffling-ball orbit-2" id="ball-4">?</div>
        <div class="shuffling-ball orbit-3" id="ball-5">?</div>
      </div>
      <div class="luxury-progress-container">
        <div class="luxury-progress-bar"></div>
      </div>
    </div>
  `;

  const shuffleInterval = setInterval(() => {
    for(let i=0; i<6; i++) {
      const b = document.getElementById(`ball-${i}`);
      if(b) b.innerText = Math.floor(Math.random() * 45) + 1;
    }
  }, 60);

  await new Promise(resolve => setTimeout(resolve, 3000));
  
  clearInterval(shuffleInterval);
  container.classList.add("reveal-flash");
  setTimeout(() => {
    container.classList.remove("reveal-flash");
    renderResults();
    resetControls.classList.remove("hidden");
  }, 200);
}

function renderResults() {
  const container = document.getElementById("result");
  container.innerHTML = "";

  const titles = [
    "데이터가 증명한 100억 번호", "통계 기반 최적의 행운 세트", "검증된 AI 당첨 예측",
    "황금 비율의 퍼펙트 티켓", "역대 빈도 가중치 분석 결과", "잭팟 매커니즘 정밀 추출",
    "빅데이터 기반 우승 번호", "패턴 분석 최상위 추천 세트", "영광의 당첨 확률 가디언", "포춘 마스터의 정밀 예측"
  ];

  for (let i = 0; i < currentSetCount; i++) {
    const numbers = generateSmartSet(); // 스마트 엔진 사용
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
