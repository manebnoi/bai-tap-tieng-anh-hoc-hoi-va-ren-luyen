// script.js (updated) — uses window.ALL_QUESTIONS / getRandomQuizSet(n)
let gameSet = [];     // questions for this playthrough
let idx = 0;
let score = 0;
const PER_GAME = 20;   // number of questions per game; change if you want

// DOM
const qBox = document.getElementById("question");
const ansBox = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startBtn");
const scoreBox = document.getElementById("score");
const reward = document.getElementById("reward");
const bgMusic = document.getElementById("bg-music");

// Utility
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Start
startBtn.addEventListener("click", () => {
  // prepare set of questions — use generator from data.js
  if (!window.getRandomQuizSet) {
    alert("Question pool not loaded yet. Try refreshing the page.");
    return;
  }
  gameSet = window.getRandomQuizSet(PER_GAME);
  idx = 0;
  score = 0;
  scoreBox.textContent = score;
  startBtn.classList.add("hidden");
  bgMusic.play().catch(()=>{ /* browsers might block autoplay until user gesture; Start click is a gesture */ });
  showQuestion();
});

// Show question
function showQuestion() {
  nextBtn.classList.add("hidden");
  ansBox.innerHTML = "";
  if (idx >= gameSet.length) {
    endGame();
    return;
  }
  const item = gameSet[idx];

  // render question text
  qBox.innerHTML = `<h2>Q${idx+1}/${gameSet.length}: ${item.q}</h2>`;

  if (item.type === "quiz") {
    // ensure shuffled options
    const opts = shuffle(item.options.slice());
    opts.forEach(opt => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = opt;
      b.onclick = () => handleAnswer(opt, item.answer, b);
      ansBox.appendChild(b);
    });
  } else if (item.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your answer";
    input.className = "input";
    input.style.padding = "10px";
    input.style.borderRadius = "8px";
    input.style.border = "none";
    input.style.marginTop = "10px";
    ansBox.appendChild(input);

    const submit = document.createElement("button");
    submit.className = "btn";
    submit.textContent = "Submit";
    submit.onclick = () => {
      const val = (input.value || "").trim();
      handleAnswer(val, item.answer, null);
    };
    ansBox.appendChild(submit);
  } else if (item.type === "listening") {
    // Play audio, show options
    if (item.audio) {
      try {
        const aud = new Audio(item.audio);
        aud.play();
      } catch (e) {
        console.warn("Audio play failed:", e);
      }
    }
    const opts = shuffle(item.options.slice());
    opts.forEach(opt => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = opt;
      b.onclick = () => handleAnswer(opt, item.answer, b);
      ansBox.appendChild(b);
    });
  } else {
    // fallback as quiz
    const opts = item.options ? shuffle(item.options.slice()) : [];
    opts.forEach(opt => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = opt;
      b.onclick = () => handleAnswer(opt, item.answer, b);
      ansBox.appendChild(b);
    });
  }
}

// Handle answer
function handleAnswer(given, correct, buttonEl) {
  // normalize
  const g = (given || "").toString().trim().toLowerCase();
  const c = (correct || "").toString().trim().toLowerCase();

  // disable further clicks
  const btns = ansBox.querySelectorAll(".btn");
  btns.forEach(b => b.disabled = true);

  if (g === c) {
    score += 10;
    if (buttonEl) buttonEl.style.background = "#2ecc71";
    alert("✅ Correct! +10 points");
  } else {
    if (buttonEl) buttonEl.style.background = "#e74c3c";
    alert(`❌ Wrong. Correct: ${correct}`);
  }
  scoreBox.textContent = score;
  nextBtn.classList.remove("hidden");
}

// Next
nextBtn.addEventListener("click", () => {
  idx++;
  showQuestion();
});

// End game
function endGame() {
  qBox.innerHTML = `<h2>🎉 Game Completed!</h2>`;
  ansBox.innerHTML = `<p>Your total score: <b>${score}</b></p>`;
  if (score >= Math.floor(PER_GAME * 10 * 0.7)) { // e.g., >=70% of max
    reward.classList.remove("hidden");
  }
  nextBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
}
