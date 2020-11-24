const statsTemplate = document.getElementById('stats-template');
const main = document.querySelector('main');

// ctx.fillRect(10, 10, 100, 100);

class Histogram {
  parentElement = null;
  padding = 0;
  labelsSpace = 30;
  width = 600;
  height = 600;
  titleHeight = 0;
  data = {};
  ctx = null;
  canvas = null;

  constructor(parentElement, width, height, data) {
    this.parentElement = parentElement;

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


const data = {
  0: {
    title: 'What programming languages do you liek most?',
    answers: {
      A: {
        votes: 1,
        text: 'aaaaaaaa'
      }, 
      B: {
        votes: 3,
        text: 'bbbbbbbbbb'
      }, 
      C: {
        votes: 7,
        text: 'cccccccccc'
      }, 
      D: {
        votes: 2,
        text: 'dddddddddddddddd'
      },
    }
  }, 
  1: {
    title: 'B;alalad ;adf f df ',
    answers: {
      A: {
        votes: 0,
        text: 'aaaaaaaa'
      }, 
      B: {
        votes: 9,
        text: 'bbbbbbbbbb'
      }, 
      C: {
        votes: 3,
        text: 'cccccccccc'
      }, 
      D: {
        votes: 6,
        text: 'dddddddddddddddd'
      },
    }
  }, 
  2: {
    title: 'Q3',
    answers: {
      A: {
        votes: 4,
        text: 'aaaaaaaa'
      }, 
      B: {
        votes: 4,
        text: 'bbbbbbbbbb'
      }, 
      C: {
        votes: 4,
        text: 'cccccccccc'
      }, 
      D: {
        votes: 3,
        text: 'dddddddddddddddd'
      },
    }
  }, 
}

const showStatistics = (quizStatistics = data) => {
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

// showStatistics();

