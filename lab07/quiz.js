const questionTemplate = document.getElementById('question-template');
// const questionTemplate = document.getElementsByTagName('template');
console.log(questionTemplate);

const quizQuestionContainer = document.querySelector('.quiz-question');
let quizQuestions = [];

const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');

let currentQuestion = 0;
// const questionWidth = quizQuestionContainer.clientWidth;
const questionWidth = 800;

quizQuestionContainer.style.transform = `translateX()`;


nextButton.addEventListener('click', () => {
  console.log(quizQuestions)
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


const questionsData = [{
  title: "Question number one?",
  options: ["A1", "B1", "C1", "D1"],
}, {
  title: "Question number two?",
  options: ["A2", "B2", "C2", "D2"],
}, {
  title: "Question number thre?",
  options: ["A3", "B3", "C3", "D3"],
}];


const handleQuestionAnswerClick = e => {
  const answer = e.target.dataset.id;
  console.log({ answer, currentQuestion });
}


const renderQuizQuestions = questions => {
  questions.forEach(question => {
    const questionElement = questionTemplate.content.cloneNode(true);

    const questionTitle = questionElement.querySelector('.question-title');
    const questionOptions = questionElement.querySelectorAll('span.question-option');

    questionTitle.textContent = question.title;
    questionOptions.forEach((questionOption, i) => {
      questionOption.textContent = question.options[i];
      questionOption.addEventListener('click', handleQuestionAnswerClick);
    });

    quizQuestionContainer.appendChild(questionElement);
  });

  quizQuestions = [...quizQuestionContainer.querySelectorAll('.quiz-question-content')];
}



renderQuizQuestions(questionsData);