let currentIndex = 0;
let score = 0;
let originalWords = [];
let translatedWords = [];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

async function loadWords() {
  const response = await fetch('words.json');
  const data = await response.json();
  originalWords = data.original_words;
  translatedWords = data.translated_words;

  shuffleWordPairs();
  showQuestion();
}

// Shuffle the indices to present words in random order
let wordOrder = [];
function shuffleWordPairs() {
  wordOrder = [...Array(originalWords.length).keys()];
  for (let i = wordOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordOrder[i], wordOrder[j]] = [wordOrder[j], wordOrder[i]];
  }
}

function showQuestion() {
  nextBtn.disabled = true;
  const wordIndex = wordOrder[currentIndex];
  const original = originalWords[wordIndex];
  const correctAnswer = translatedWords[wordIndex];

  questionEl.textContent = `¿Cómo se dice "${original}" en inglés?`;

  // Generate options: correct answer + random others
  const options = new Set();
  options.add(correctAnswer);
  while (options.size < 4) {
    const random = translatedWords[Math.floor(Math.random() * translatedWords.length)];
    options.add(random);
  }

  const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
  choicesEl.innerHTML = '';

  shuffledOptions.forEach(option => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.classList.add('choice');
    btn.textContent = option;
    btn.onclick = () => selectAnswer(btn, correctAnswer);
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
  currentIndex++;
  if (currentIndex < originalWords.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  questionEl.textContent = "¡Quiz finalizado!";
  choicesEl.innerHTML = '';
  nextBtn.style.display = 'none';
  scoreEl.textContent = `Puntaje: ${score} de ${originalWords.length}`;
}

loadWords();
