const quizQuestionContainer = document.querySelector('.quiz-question');
const quizQuestions = document.querySelectorAll('.quiz-question-content');

const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');

let currentQuestion = 0;
const questionWidth = quizQuestions[0].clientWidth;

quizQuestionContainer.style.transform = `translateX()`;


nextButton.addEventListener('click', () => {
  if (currentQuestion >= quizQuestions.length - 1 ) return;

  quizQuestions[currentQuestion].classList.add('animate-question-content');
  quizQuestions[currentQuestion + 1].classList.add('animate-question-content');

  quizQuestions[currentQuestion].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });
  quizQuestions[currentQuestion + 1].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });

  quizQuestionContainer.style.transition = `transform 0.4s ease-in-out`;
  currentQuestion++;
  quizQuestionContainer.style.transform = `translateX(${-questionWidth*currentQuestion}px)`;
});

prevButton.addEventListener('click', () => {
  if (currentQuestion <= 0 ) return;

  quizQuestions[currentQuestion].classList.add('animate-question-content');
  quizQuestions[currentQuestion - 1].classList.add('animate-question-content');

  quizQuestions[currentQuestion].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });
  quizQuestions[currentQuestion - 1].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });

  quizQuestionContainer.style.transition = `transform 0.4s ease-in-out`;
  currentQuestion--;
  quizQuestionContainer.style.transform = `translateX(${-questionWidth*currentQuestion}px)`;
});