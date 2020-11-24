const questionTemplate = document.getElementById('question-template');
// const questionTemplate = document.getElementsByTagName('template');
console.log(questionTemplate);

const quizQuestionContainer = document.querySelector('.quiz-question');

const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');
const submitButton = document.querySelector('#submit-quiz');
const questionCounter = document.querySelector('#question-count');


const quizState = {
  currentQuestion : 0,
  questionWidth: 800,
  questions: [],
  userAnswers: {
    0: null,
    1: null,
    2: null,
  }
}


quizQuestionContainer.style.transform = `translateX()`;

const updateQuestionCounter = () => {
  questionCounter.textContent = `${quizState.currentQuestion  + 1}/${quizState.questions.length}`;
}

const isButtonActive = button => {
  return button.classList.contains('button-disabled');
}

const isQuizCompleted = () => {
  return Object.values(quizState.userAnswers).every(answer => answer !== null);
}

const updateButtonsState = () => {
  // Disable prevButton if we are on 1st question, enable otherwise
  quizState.currentQuestion  === 0 
    ? prevButton.classList.add('button-disabled') 
    : prevButton.classList.remove('button-disabled');

  // Disable nextButton if we are on the last question, enable otherwise
  quizState.currentQuestion  === (quizState.questions.length - 1)
    ? nextButton.classList.add('button-disabled') 
    : nextButton.classList.remove('button-disabled');
}

nextButton.addEventListener('click', () => {
  console.log(quizState);
  if (isButtonActive(nextButton)) return;

  quizState.questions[quizState.currentQuestion].classList.add('animate-question-content');
  quizState.questions[quizState.currentQuestion  + 1].classList.add('animate-question-content');

  quizState.questions[quizState.currentQuestion].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });
  quizState.questions[quizState.currentQuestion  + 1].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });

  quizQuestionContainer.style.transition = `transform 0.4s ease-in-out`;
  quizState.currentQuestion += 1;
  quizQuestionContainer.style.transform = `translateX(${-quizState.questionWidth*quizState.currentQuestion }px)`;
  updateQuestionCounter();
  updateButtonsState();
});


prevButton.addEventListener('click', () => {
  console.log(quizState);
  if (isButtonActive(prevButton)) return;

  quizState.questions[quizState.currentQuestion].classList.add('animate-question-content');
  quizState.questions[quizState.currentQuestion - 1].classList.add('animate-question-content');

  quizState.questions[quizState.currentQuestion].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });
  quizState.questions[quizState.currentQuestion - 1].addEventListener('animationend', e => {
    e.target.classList.remove('animate-question-content');
  });

  quizQuestionContainer.style.transition = `transform 0.4s ease-in-out`;
  quizState.currentQuestion -= 1;
  quizQuestionContainer.style.transform = `translateX(${-quizState.questionWidth*quizState.currentQuestion }px)`;
  updateQuestionCounter();
  updateButtonsState();
});


const questionsData = [{
  title: "Which of the following programming languages ​​do you like best?",
  options: ["JavaScript", "Java", "C++", "Python"],
}, {
  title: "What is your favourite season?",
  options: ["Summer", "Spring", "Autumn", "Winter"],
}, {
  title: "How many times a week do you workout?",
  options: ["0", "1-2", "3-4", "5+"],
}];


const clearPreviousAnswer = (questionNumber, previouslySelectedAnswer) => {
  const previouslySelectedOption = quizQuestionContainer.querySelector(`.quiz-question-content[data-question-number='${questionNumber}'] .question-option[data-id='${previouslySelectedAnswer}']`);

  if (!!previouslySelectedOption) {
    previouslySelectedOption.classList.remove('selected');
  }
}

const handleAnswerQuestion = (questionId, optionElement) => {
  const answer = optionElement.dataset.id;
  const previouslySelectedAnswer = quizState.userAnswers[questionId];

  if (previouslySelectedAnswer) {
    clearPreviousAnswer(questionId, previouslySelectedAnswer);
  }

  quizState.userAnswers[questionId] = answer;
  optionElement.classList.add('selected');

  isQuizCompleted() 
  ? submitButton.classList.remove('button-disabled')
  : submitButton.classList.add('button-disabled');
}


const renderQuizQuestions = questions => {
  questions.forEach(question => {
    const questionElement = questionTemplate.content.cloneNode(true);

    const questionTitle = questionElement.querySelector('.question-title');
    const questionOptions = questionElement.querySelectorAll('span.question-option');

    questionTitle.textContent = question.title;
    questionOptions.forEach((questionOption, i) => {
      questionOption.appendChild(document.createTextNode(question.options[i]));
    });

    quizQuestionContainer.appendChild(questionElement);
  });

  quizState.questions = [...quizQuestionContainer.querySelectorAll('.quiz-question-content')];
  quizState.questions.forEach((question, idx) => { 
    question.dataset.questionNumber = idx;
    question.addEventListener('click', function(e) {
      const questionId = this.dataset.questionNumber;
    
      if (e.target.classList.contains('question-option')) {
        handleAnswerQuestion(questionId, e.target);
      }
    });
  });
}

async function handleQuizSubmit() {
  if (isQuizCompleted()) {
    const encodedAnswer = encodeURI(JSON.stringify(quizState.userAnswers));
    const url = `../../cgi-bin/lab07/post_quiz.py?answer=${encodedAnswer}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      showStatistics(data);
    } catch(err) {
      console.log('ERROR');
      console.error(err);
    }
  }
}


submitButton.addEventListener('click', handleQuizSubmit);
renderQuizQuestions(questionsData);
updateQuestionCounter();
