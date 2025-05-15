let questions = [];
let currentIndex = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultDiv = document.getElementById("result");
const scoreText = document.getElementById("score");

//Shuffling
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    questionText.textContent = `Pytanie ${currentIndex + 1} z ${questions.length}: ${q.question || ''}`;
    answersDiv.innerHTML = "";
    nextBtn.style.display = "none";

    if (q.answers) {
        const answers = Object.entries(q.answers);
        shuffle(answers);
        answers.forEach(([key, value]) => {
            const btn = document.createElement("button");
            btn.textContent = `${key}: ${value}`;
            btn.onclick = () => selectAnswer(btn, key);
            answersDiv.appendChild(btn);
        });
    } else {
        // If no answers, just show info
        const info = document.createElement("div");
        info.textContent = "Brak odpowiedzi do wyświetlenia.";
        answersDiv.appendChild(info);
    }
}

function selectAnswer(button, selected) {
    const correct = questions[currentIndex].correct;
    const buttons = answersDiv.querySelectorAll("button");

    buttons.forEach(btn => {
        btn.disabled = true;
        const key = btn.textContent.split(":")[0];
        if (key === correct) btn.classList.add("correct");
        else if (key === selected) btn.classList.add("wrong");
    });

    if (selected === correct) score++;
    nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    document.getElementById("quiz").style.display = "none";
    resultDiv.style.display = "block";
    scoreText.textContent = `Poprawne odpowiedzi: ${score} / ${questions.length}`;
}

// Load questions from JSON and start quiz
fetch('pytania.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffle(questions);
        showQuestion();
    })
    .catch(err => {
        questionText.textContent = "Błąd ładowania pytań.";
        console.error(err);
    });
