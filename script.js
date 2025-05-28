let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

async function loadQuestions() {
  const response = await fetch('questions.json');
  questions = await response.json();
  showQuestion();
}

function showQuestion() {
  nextBtn.disabled = true;
  const current = questions[currentQuestionIndex];
  questionEl.textContent = current.question;
  choicesEl.innerHTML = '';

  current.choices.forEach(choice => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.classList.add('choice');
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(btn, current.answer);
    li.appendChild(btn);
    choicesEl.appendChild(li);
  });
}

function selectAnswer(button, correctAnswer) {
  const buttons = document.querySelectorAll('.choice');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.textContent === button.textContent) {
      btn.classList.add('incorrect');
    }
  });

  if (button.textContent === correctAnswer) {
    score++;
  }
  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  questionEl.textContent = "Quiz Completed!";
  choicesEl.innerHTML = '';
  nextBtn.style.display = 'none';
  scoreEl.textContent = `Your Score: ${score} / ${questions.length}`;
}

loadQuestions();
