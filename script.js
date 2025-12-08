// script.js
let currentQuestion = {};
let usedIndexes = [];

function getRandomQuestion() {
    if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
        alert("Question data not loaded!");
        return null;
    }

    // Khi đã hỏi hết thì reset
    if (usedIndexes.length >= QUESTIONS.length) {
        usedIndexes = [];
    }

    let index;
    do {
        index = Math.floor(Math.random() * QUESTIONS.length);
    } while (usedIndexes.includes(index));

    usedIndexes.push(index);
    return QUESTIONS[index];
}

function loadQuestion() {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    document.getElementById("question").innerText = currentQuestion.question;

    const opts = document.getElementById("options");
    opts.innerHTML = "";

    currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx);
        opts.appendChild(btn);
    });
}

function checkAnswer(index) {
    if (index === currentQuestion.correct) {
        alert("Correct!");
    } else {
        alert("Wrong!");
    }
    loadQuestion();
}

window.onload = () => {
    if (typeof QUESTIONS === "undefined") {
        alert("Data file not loaded! Check data.js path.");
    } else {
        loadQuestion();
    }
};
