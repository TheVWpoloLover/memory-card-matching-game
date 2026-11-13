const LEVELS = {
  easy: { pairs: 6, columns: 4 },
  classic: { pairs: 8, columns: 4 },
  expert: { pairs: 12, columns: 6 }
};

const SYMBOLS = ["🍓", "🍋", "🍇", "🍊", "🍒", "🍉", "🍍", "🥝", "🫐", "🍑", "🥑", "🌼"];
const board = document.querySelector("#board");
const moveDisplay = document.querySelector("#moves");
const timeDisplay = document.querySelector("#time");
const pairDisplay = document.querySelector("#pairs");
const progress = document.querySelector("#progress");
const difficulty = document.querySelector("#difficulty");
const bestDisplay = document.querySelector("#best-score");
const status = document.querySelector("#game-status");
const newGameButton = document.querySelector("#new-game");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerId = null;
let started = false;
let currentLevel = difficulty.value;

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const remainder = (totalSeconds % 60).toString().padStart(2, "0");
  return minutes + ":" + remainder;
}

function bestKey() {
  return "little-memory-club-best-" + currentLevel;
}

function readBest() {
  try {
    return localStorage.getItem(bestKey());
  } catch {
    return null;
  }
}

function updateBestLabel() {
  const best = readBest();
  bestDisplay.textContent = best ? "Best: " + best + " moves" : "Best: —";
}

function startTimer() {
  if (started) return;
  started = true;
  timerId = window.setInterval(() => {
    seconds += 1;
    timeDisplay.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  window.clearInterval(timerId);
  timerId = null;
}

function updateStats() {
  moveDisplay.textContent = String(moves);
  timeDisplay.textContent = formatTime(seconds);
  pairDisplay.textContent = matchedPairs + " / " + LEVELS[currentLevel].pairs;
  progress.style.width = (matchedPairs / LEVELS[currentLevel].pairs) * 100 + "%";
}

function makeCard(symbol, index) {
  const card = document.createElement("button");
  card.className = "memory-card";
  card.type = "button";
  card.dataset.symbol = symbol;
  card.dataset.index = String(index);
  card.setAttribute("aria-label", "Hidden card");
  card.setAttribute("aria-pressed", "false");
  card.innerHTML = '<span class="card-back" aria-hidden="true">✿</span><span class="card-front" aria-hidden="true">' + symbol + "</span>";
  card.addEventListener("click", () => flipCard(card));
  return card;
}

function newGame() {
  stopTimer();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  started = false;
  currentLevel = difficulty.value;

  const symbols = SYMBOLS.slice(0, LEVELS[currentLevel].pairs);
  const cards = shuffle([...symbols, ...symbols]);
  board.style.gridTemplateColumns = "repeat(" + LEVELS[currentLevel].columns + ", minmax(0, 1fr))";
  board.replaceChildren(...cards.map(makeCard));
  board.setAttribute("aria-label", "Memory card board, " + LEVELS[currentLevel].pairs + " pairs");
  status.textContent = "New game started. Find " + LEVELS[currentLevel].pairs + " matching pairs.";
  updateStats();
  updateBestLabel();
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("is-matched")) return;

  startTimer();
  card.classList.add("is-flipped");
  card.setAttribute("aria-pressed", "true");
  card.setAttribute("aria-label", "Card showing " + card.dataset.symbol);

  if (!firstCard) {
    firstCard = card;
    status.textContent = "Card revealed. Choose one more card.";
    return;
  }

  secondCard = card;
  moves += 1;
  updateStats();

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    status.textContent = "Match found! " + matchedPairs + " of " + LEVELS[currentLevel].pairs + " pairs.";
    resetTurn();
    updateStats();

    if (matchedPairs === LEVELS[currentLevel].pairs) finishGame();
    return;
  }

  lockBoard = true;
  status.textContent = "Not a match. Cards will turn back over.";
  window.setTimeout(() => {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");
    firstCard.setAttribute("aria-pressed", "false");
    secondCard.setAttribute("aria-pressed", "false");
    firstCard.setAttribute("aria-label", "Hidden card");
    secondCard.setAttribute("aria-label", "Hidden card");
    resetTurn();
  }, 850);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function finishGame() {
  stopTimer();
  const previousBest = Number(readBest());
  const isNewBest = !previousBest || moves < previousBest;
  if (isNewBest) {
    try {
      localStorage.setItem(bestKey(), String(moves));
    } catch {
      // The current game remains playable if browser storage is unavailable.
    }
  }
  updateBestLabel();
  status.textContent = "You found every pair in " + moves + " moves and " + formatTime(seconds) + (isNewBest ? ". New personal best!" : ". Well played!");
}

difficulty.addEventListener("change", newGame);
newGameButton.addEventListener("click", newGame);
newGame();