const canvas = document.querySelector('canvas');
const angleInput = document.querySelector('input#angleInput');
const lengthInput = document.querySelector('input#lengthInput');
const deepthInput = document.querySelector('input#deepthInput');
const lengthVarianceInput = document.querySelector('input#lengthVarianceInput');
const angleVarianceInput = document.querySelector('input#angleVarianceInput');
const branchingProbabilityInput = document.querySelector('input#branchingProbabilityInput');
const ctx = canvas.getContext('2d');

let arng = new alea(234234234324234);
console.log(arng()); 

function chooseWithProbability(probability) {
  return probability >= Math.random()*100;
}

canvas.style.height = '100%';
canvas.style.width = '100%';

console.dir(canvas);

const canvasHeight = canvas.offsetHeight;
const canvasWidth = canvas.offsetWidth;

canvas.height = canvasHeight;
canvas.width = canvasWidth;

ctx.lineWidth = 1;


const divideFactor = 2;
let initialLength = 100;
let maxDepth = 12;
let angDiff = 60;
let lengthVariance = 0;
const initialLineWidth = 10;
const startPoint = {
  x: parseInt(canvasWidth / 2),
  y: canvasHeight - 50,
}

function getRadians(degrees) {
  return degrees * Math.PI / 180;
}

function branch(point, angle, length, deepth, lineWidth) {
  if (deepth >= maxDepth) return;

  const variancedLentgh = length * (1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100));

  const nextPoint = {
    // x: point.x + length*Math.sin(angle)*(1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100)),
    x: point.x + variancedLentgh*Math.sin(angle),
    // y: point.y - length*Math.cos(angle)*(1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100)),
    y: point.y - variancedLentgh*Math.cos(angle),
  }

  const nextLineWidth = lineWidth <= 1 ? 1 : lineWidth - 2;

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(nextPoint.x, nextPoint.y);
  ctx.closePath();
  ctx.stroke();

  // if (chooseWithProbability(branchingProbabilityInput.value)) {
    branch(nextPoint, angle + getRadians(angDiff), length*0.8, deepth + 1, nextLineWidth);
  // }

  // if (chooseWithProbability(branchingProbabilityInput.value)) {
    branch(nextPoint, angle - getRadians(angDiff), length*0.8, deepth + 1, nextLineWidth);
  // }
}

branch(startPoint, 0, initialLength, 0, initialLineWidth);

angleInput.addEventListener('input', e => {
  console.log(e.target.value);
  angDiff = e.target.value;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

lengthInput.addEventListener('input', e => {
  console.log(e.target.value);
  initialLength = e.target.value;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

deepthInput.addEventListener('input', e => {
  console.log(e.target.value);
  maxDepth = e.target.value;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

lengthVarianceInput.addEventListener('input', e => {
  lengthVariance = e.target.value;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

angleVarianceInput.addEventListener('input', e => {
  angleVariance = e.target.value;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

// branchingProbabilityInput.addEventListener('input', e => {
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//   branch(startPoint, 0, initialLength, 0, initialLineWidth);
// })