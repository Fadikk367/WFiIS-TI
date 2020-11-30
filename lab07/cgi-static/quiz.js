const questionTemplate = document.getElementById('question-template');
const statsTemplate = document.getElementById('stats-template');

const main = document.querySelector('main');

const quizQuestionContainer = document.querySelector('.quiz-question');
const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');
const submitButton = document.querySelector('#submit-quiz');
const questionCounter = document.querySelector('#question-count');


// ------------------- DATA & STATE ----------------------- //

// Data to display quiz
const questionsData = [{
  title: "Which of the following programming languages ​​do you like best?",
  options: ["JavaScript", "Java", "C++", "Python"],
}, {
  title: "What is your favourite season?",
  options: ["Summer", "Spring", "Autumn", "Winter"],
}, {
  title: "How many times a week do you workout?",
  options: ["0", "1-2", "3-4", "5+"],
}]

// Global state for quiz app
const quizState = {
  currentQuestion : 0,
  questionWidth: 800,
  questions: [],
  userAnswers: {
    '0': null,
    '1': null,
    '2': null,
  }
}

// Mock data for displaying statistics
const data = {
  0: {
    title: 'Mock question number one',
    answers: {
      A: {
        votes: 1,
        text: 'option one'
      }, 
      B: {
        votes: 3,
        text: 'option two'
      }, 
      C: {
        votes: 7,
        text: 'option three'
      }, 
      D: {
        votes: 2,
        text: 'option four'
      },
    }
  }
}


// ------------------- Stuff for displaying statistics and histogram ----------------------- //

class Histogram {
  constructor(parentElement, width, height, data) {
    this.parentElement = parentElement;
    this.padding = 0
    this.labelsSpace = 30;
    this.titleHeight = 0;
    this.canvas = this.createCanvas(width, height);
    this.parentElement.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.ctx.transform(1, 0, 0, -1, 0, this.canvas.height);
    this.ctx.strokeStyle = "white";

    this.width = width;
    this.height = height;
    this.data = data;
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  show() {
    this.drawAxises();
    this.drawYAxisLabels();
    this.drawHistogramBars();
  }

  getHistogramHeight() {
    return this.height - 2*this.padding - this.titleHeight - this.labelsSpace;
  }

  getHistogramWidth() {
    return this.width - 2*this.padding - this.labelsSpace;
  }

  drawAxises() {
    // y axis
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(this.padding + this.labelsSpace, this.padding + this.labelsSpace - 10);
    this.ctx.lineTo(this.padding + this.labelsSpace, this.height - (this.padding + this.titleHeight));
    this.ctx.stroke();

    // y axis arrow
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding + this.labelsSpace, this.height - (this.padding + this.titleHeight));
    this.ctx.lineTo(this.padding + this.labelsSpace + 5, this.height - (this.padding + this.titleHeight) - 15);
    this.ctx.lineTo(this.padding + this.labelsSpace - 5, this.height - (this.padding + this.titleHeight) - 15);
    this.ctx.lineTo(this.padding + this.labelsSpace, this.height - (this.padding + this.titleHeight));
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath();
    
    // x axis
    this.ctx.moveTo(this.padding + this.labelsSpace - 10, this.padding + this.labelsSpace);
    this.ctx.lineTo(this.getHistogramWidth(), this.padding + this.labelsSpace);
    this.ctx.stroke();
  }

  drawYAxisLabels() {
    this.ctx.font = "20px Arial";
    const maxValue = Math.max(...Object.values(this.data).map(option => option.votes));
    const spaceHeight = this.getHistogramHeight();
    const labelStep = spaceHeight/(maxValue + 1);

    for (let i = 1; i < maxValue + 1; i++) {
      // draw y axis label
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(this.padding + this.labelsSpace - 5, labelStep*i + this.padding + this.labelsSpace);
      this.ctx.lineTo(this.padding + this.labelsSpace + 5, labelStep*i + this.padding + this.labelsSpace);
      this.ctx.stroke();
      this.writeText(i, this.padding, labelStep*i - 8 + this.padding + this.labelsSpace);

      // draw horizonal line for specific label
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(this.padding + this.labelsSpace + 5, labelStep*i + this.padding + this.labelsSpace);
      this.ctx.lineTo(this.getHistogramWidth(), labelStep*i + this.padding + this.labelsSpace);
      this.ctx.stroke();
    }
  }

  drawHistogramBars() {
    const maxValue = Math.max(...Object.values(this.data).map(option => option.votes));
    const spaceHeight = this.getHistogramHeight();
    const labelStep = spaceHeight/(maxValue + 1);

    let i = 0
    for (let [label, { votes, text }] of Object.entries(this.data)) {
      this.ctx.fillStyle ="yellow"
      this.ctx.fillRect(this.padding + this.labelsSpace + i*75 + 25, this.padding + this.labelsSpace, 50, votes*labelStep);
      this.writeText(label, this.padding + this.labelsSpace + i*75 + 40, this.padding, "yellows");
      i++;
    }
  }

  writeText(text, x, y, color = "white") {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.scale(1, -1);
    this.ctx.fillText(text, x, -y);
    this.ctx.restore();
  }
}
// Histogram class - END


const showStatistics = (quizStatistics = data) => {
  console.log(quizStatistics)
  main.innerHTML = '';
  main.className = "main-stats";

  for ([questionId, questionInfo] of Object.entries(quizStatistics)) {
    const statsElement = statsTemplate.content.cloneNode(true);

    const histogramBox = statsElement.querySelector('.question-histogram');
    const questionTitle = statsElement.querySelector('.question-title');
    questionTitle.textContent = questionInfo.title;

    const queistionList = statsElement.querySelector('ul');
    for (let [tag, option] of Object.entries(questionInfo.answers)) {
      const item = document.createElement('li');
      item.className = "question-option";
      item.textContent = `${tag}: ${option.text}`;
      queistionList.appendChild(item);
    }
  
    const histogram = new Histogram(histogramBox, 400, 400, questionInfo.answers);
    main.appendChild(statsElement);
    histogram.show();
  }
}


// ------------------- Handlers and helper functions for quiz controlling ----------------------- //

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

const handleShowNextQuestion = () => {
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
}


const handleShowPreviousQuestion = () => {
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
}


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
    const url = `../cgi-bin/post_quiz.py?answer=${encodedAnswer}`;

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

nextButton.addEventListener('click', handleShowNextQuestion);
prevButton.addEventListener('click', handleShowPreviousQuestion);
submitButton.addEventListener('click', handleQuizSubmit);
renderQuizQuestions(questionsData);
updateQuestionCounter();
