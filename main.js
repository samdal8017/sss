const MAX = 45;
const PICK = 6;
let currentSetCount = 5;
let history = JSON.parse(localStorage.getItem('lottoHistory')) || [];

// 가상의 역대 당첨 데이터 가중치 (빈도 분석 시뮬레이션)
const historicalWeights = Array(MAX + 1).fill(1).map((w, i) => {
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

function generateSmartSet() {
  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    let set = new Set();
    while (set.size < PICK) {
      set.add(weightedPick(historicalWeights));
    }
    const arr = Array.from(set).sort((a, b) => a - b);
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sum < 100 || sum > 180) continue;
    const oddCount = arr.filter(n => n % 2 !== 0).length;
    if (oddCount < 2 || oddCount > 4) continue;
    const lowCount = arr.filter(n => n <= 22).length;
    if (lowCount < 2 || lowCount > 4) continue;
    return arr;
  }
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
  renderHistory();
}

async function triggerJackpotSequence(count) {
  if (count) currentSetCount = count;
  const container = document.getElementById("result");
  const initialControls = document.getElementById("initialControls");
  const resetControls = document.getElementById("resetControls");
  const historyContainer = document.getElementById("historySection");
  
  initialControls.classList.add("hidden");
  resetControls.classList.add("hidden");
  if(historyContainer) historyContainer.classList.add("hidden");
  
  container.innerHTML = `
    <div class="spectacular-machine">
      <div class="machine-glow"></div>
      <div id="statusText" class="scanning-text-v2">역대 데이터 정밀 분석 중...</div>
      <div class="orbit-machine">
        <div class="shuffling-ball orbit-1" id="ball-0">?</div>
        <div class="shuffling-ball orbit-2" id="ball-1">?</div>
        <div class="shuffling-ball orbit-3" id="ball-2">?</div>
        <div class="shuffling-ball orbit-1" id="ball-3">?</div>
        <div class="shuffling-ball orbit-2" id="ball-4">?</div>
        <div class="shuffling-ball bonus-ball-shimmer hidden" id="ball-5">?</div>
      </div>
      <div class="luxury-progress-container">
        <div class="luxury-progress-bar fast"></div>
      </div>
    </div>
  `;

  // 1단계: 5개 번호 셔플 (0~2.4초)
  const shuffleInterval = setInterval(() => {
    for(let i=0; i<5; i++) {
      const b = document.getElementById(`ball-${i}`);
      if(b) b.innerText = Math.floor(Math.random() * 45) + 1;
    }
  }, 60);

  await new Promise(resolve => setTimeout(resolve, 2400));
  
  // 2단계: 보너스 번호 확정 (2.4~3초)
  const statusText = document.getElementById("statusText");
  const bonusBall = document.getElementById("ball-5");
  if(statusText) statusText.innerText = "잭팟 번호 확정 중!";
  if(bonusBall) {
    bonusBall.classList.remove("hidden");
    const bonusInterval = setInterval(() => {
      bonusBall.innerText = Math.floor(Math.random() * 45) + 1;
    }, 50);
    setTimeout(() => clearInterval(bonusInterval), 600);
  }

  await new Promise(resolve => setTimeout(resolve, 600));
  
  clearInterval(shuffleInterval);
  container.classList.add("reveal-flash");
  setTimeout(() => {
    container.classList.remove("reveal-flash");
    saveAndRenderResults();
    resetControls.classList.remove("hidden");
  }, 200);
}

function saveAndRenderResults() {
  const container = document.getElementById("result");
  container.innerHTML = "";
  const allSets = [];

  const titles = [
    "데이터 증명 100억 번호", "통계 기반 최적 세트", "검증된 AI 당첨 예측",
    "황금 비율 퍼펙트 티켓", "역대 빈도 가중치 분석", "잭팟 매커니즘 정밀 추출",
    "빅데이터 기반 우승 번호", "패턴 분석 상위 추천", "영광의 당첨 확률", "포춘 마스터 정밀 예측"
  ];

  for (let i = 0; i < currentSetCount; i++) {
    const numbers = generateSmartSet();
    allSets.push(numbers);
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

  // 히스토리 저장 (최신 결과 1개 세트만 저장하거나 전체 저장 가능 - 여기서는 첫 세트만 저장)
  history.unshift({
    date: new Date().toLocaleString(),
    numbers: allSets[0] 
  });
  if(history.length > 5) history.pop();
  localStorage.setItem('lottoHistory', JSON.stringify(history));
}

function renderHistory() {
  let section = document.getElementById("historySection");
  if(!section) return;
  
  // 유효한 데이터만 필터링 (date와 numbers가 모두 있는 경우만)
  const validHistory = history.filter(item => item && item.date && Array.isArray(item.numbers));
  
  if(validHistory.length === 0) {
    section.classList.add("hidden");
    return;
  }
  
  section.classList.remove("hidden");
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  
  validHistory.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <span class="history-date">${item.date}</span>
      <div class="ball-container mini">
        ${item.numbers.map(n => `<span class="lotto-ball mini ${getBallColorClass(n)}">${n}</span>`).join('')}
      </div>
    `;
    list.appendChild(div);
  });
}

document.getElementById("resetBtn").addEventListener("click", () => {
  triggerJackpotSequence();
});

applyTimeTheme();
showInitialMenu();
