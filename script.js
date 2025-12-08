let currentIndex = 0;
let score = 0;
let shuffledQuestions = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");

// Start game
startQuiz();

function startQuiz() {
    shuffledQuestions = shuffleArray(QUESTIONS);
    currentIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const q = shuffledQuestions[currentIndex];

    questionEl.innerText = q.question;
    progressEl.innerText = `Question ${currentIndex + 1} / ${shuffledQuestions.length}`;

    optionsEl.innerHTML = "";
    nextBtn.style.display = "none";

    const shuffledOptions = q.options
        .map((opt, idx) => ({ text: opt, index: idx }))
        .sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt.text;
        btn.onclick = () => selectAnswer(opt.index);
        optionsEl.appendChild(btn);
    });
}

function selectAnswer(choice) {
    const q = shuffledQuestions[currentIndex];
    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach((b) => (b.disabled = true));

    if (choice === q.correct) {
        score++;
        highlightCorrect(buttons, q.options[q.correct]);
    } else {
        highlightCorrect(buttons, q.options[q.correct]);
        highlightWrong(buttons, q.options[choice]);
    }

    nextBtn.style.display = "block";
}

function highlightCorrect(btns, correctText) {
    btns.forEach((b) => {
        if (b.innerText === correctText) b.classList.add("correct");
    });
}

function highlightWrong(btns, wrongText) {
    btns.forEach((b) => {
        if (b.innerText === wrongText) b.classList.add("wrong");
    });
}

nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
};

function finishQuiz() {
    questionEl.innerHTML = `🎉 Completed!`;
    optionsEl.innerHTML = `
        <img src="cup.png" class="trophy">
        <div class="result">Score: ${score}/${shuffledQuestions.length}</div>
    `;
    nextBtn.style.display = "none";
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
