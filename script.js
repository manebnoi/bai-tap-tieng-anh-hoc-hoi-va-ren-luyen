let questionList = [];
let currentIndex = 0;
let score = 0;
let bgMusic = null;

// DOM elements
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");
const rewardPopup = document.getElementById("reward");

// Background music
bgMusic = document.getElementById("bg-music");

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);

// -----------------------
// START GAME
// -----------------------
function startGame() {
  // Play music ON CLICK only
  bgMusic.currentTime = 0;
  bgMusic.play();

  score = 0;
  scoreEl.textContent = score;

  // Use 20 random questions from data.js
  questionList = window.getRandomQuizSet(20);

  currentIndex = 0;
  startBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");

  showQuestion();
}

// -----------------------
// SHOW QUESTION
// -----------------------
function showQuestion() {
  const q = questionList[currentIndex];

  // Clear old answers
  answersEl.innerHTML = "";
  nextBtn.classList.add("hidden");

  // Display question text
  questionEl.textContent = q.q;

  // Special case: listening
  if (q.type === "listening" && q.audio) {
    let audioElement = document.createElement("audio");
    audioElement.src = q.audio;
    audioElement.controls = true;
    audioElement.style.marginBottom = "15px";
    answersEl.appendChild(audioElement);
  }

  // Create answer buttons
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.textContent = option;

    btn.addEventListener("click", () => handleAnswer(option, q.answer, btn));

    answersEl.appendChild(btn);
  });
}

// -----------------------
// HANDLE ANSWER
// -----------------------
function handleAnswer(selected, correct, btn) {
  const allButtons = answersEl.querySelectorAll("button");

  allButtons.forEach(b => (b.disabled = true));

  if (selected === correct) {
    btn.style.background = "#00ff99";
    btn.style.color = "#004400";
    score++;
    scoreEl.textContent = score;
  } else {
    btn.style.background = "#ff4d4d";
    btn.style.color = "white";

    // highlight correct answer
    allButtons.forEach(b => {
      if (b.textContent === correct) {
        b.style.background = "#00ff99";
        b.style.color = "#004400";
      }
    });
  }

  nextBtn.classList.remove("hidden");
}

// -----------------------
// NEXT QUESTION
// -----------------------
function nextQuestion() {
  currentIndex++;

  if (currentIndex >= questionList.length) {
    endGame();
  } else {
    showQuestion();
  }
}

// -----------------------
// END GAME
// -----------------------
function endGame() {
  questionEl.textContent = "🎉 Hoàn thành bài chơi!";
  answersEl.innerHTML = "";
  nextBtn.classList.add("hidden");

  // Show reward if good score
  if (score >= 15) {
    rewardPopup.classList.remove("hidden");
  }

  startBtn.classList.remove("hidden");
}

// -----------------------
// CLOSE REWARD POPUP
// -----------------------
window.closeReward = function () {
  rewardPopup.classList.add("hidden");
};
