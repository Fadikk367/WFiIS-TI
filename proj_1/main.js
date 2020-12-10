const canvas = document.querySelector('canvas');
const seedInput = document.querySelector('input#seedInput');
const angleInput = document.querySelector('input#angleInput');
const lengthInput = document.querySelector('input#lengthInput');
const deepthInput = document.querySelector('input#deepthInput');
const lengthVarianceInput = document.querySelector('input#lengthVarianceInput');
const angleVarianceInput = document.querySelector('input#angleVarianceInput');
const branchingProbabilityInput = document.querySelector('input#branchingProbabilityInput');
const drawLeavesCheckbox = document.querySelector('input#drawLeaves');
const drawShadowsCheckbox = document.querySelector('input#drawShadows');
const branchColorInput = document.querySelector('input#branchColor');
const rootThickness = document.querySelector('input#rootThickness');
const ctx = canvas.getContext('2d');
let seed = 111;
let arng = new alea(seed);

let branchPartitionFactor = 20;

let treeStructure = {

}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function getBranchPoints(begin, end) {
  const branchPoints = [];
  const dx = end.x - begin.x;
  const dy = end.y - begin.y;

  for (let i = 0; i < branchPartitionFactor; i++) {
    const x = begin.x + i*dx/branchPartitionFactor;
    const y = begin.y + i*dy/branchPartitionFactor;

    branchPoints.push(new Point(x, y));
  }
  branchPoints.push(new Point(end.x, end.y));

  return branchPoints;
}




function chooseWithProbability(probability) {
  return probability >= arng()*100;
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
let initialLength = lengthInput.value;
let maxDepth = deepthInput.value;
let angDiff = angleInput.value;
let lengthVariance = lengthVarianceInput.value;
let angleVariance = angleVarianceInput.value;
let leavesShadowBlur = 0;
let branchesShadowBlur = 0;
ctx.strokeStyle = 'black';
let initialLineWidth = 10;
const startPoint = {
  x: parseInt(canvasWidth / 2),
  y: canvasHeight - 50,
}

function getRadians(degrees) {
  return degrees * Math.PI / 180;
}


ctx.shadowColor = "rgba(0,0,0,0.8)";
ctx.shadowBlur = branchesShadowBlur;

function drawSingleLeave(point) {
  ctx.shadowBlur = leavesShadowBlur;
  ctx.beginPath();
  ctx.arc(point.x - 7, point.y - 7, 7, Math.PI/4, Math.PI);
  ctx.fill();
  ctx.shadowBlur = branchesShadowBlur;
  ctx.restore();
}

function drawManyLeaves(points) {
  points.map(drawSingleLeave);
}


ctx.fillStyle = "green";
function branch(point, angle, length, deepth, lineWidth) {
  if (deepth >= maxDepth) {
    if (drawLeavesCheckbox.checked) {
      drawSingleLeave(point);
    }
    return;
  };

  const variancedLentgh = length * (1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100));
  const variancedAngle = angle * (1.0 + (chooseWithProbability(50) ? angleVariance/100 : - angleVariance/100))

  const nextPoint = {
    // x: point.x + length*Math.sin(angle)*(1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100)),
    x: point.x + variancedLentgh*Math.sin(variancedAngle),
    // y: point.y - length*Math.cos(angle)*(1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100)),
    y: point.y - variancedLentgh*Math.cos(variancedAngle),
  }

  const branchPoints = getBranchPoints(point, nextPoint);
  if (!treeStructure[deepth]) {
    treeStructure[deepth] = {
      branches: [],
      lineWidth,
    }
  }

  treeStructure[deepth].branches.push(branchPoints);
  treeStructure[deepth].lineWidth = lineWidth;

  const nextLineWidth = lineWidth <= 1 ? 1 : lineWidth - 2;

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(nextPoint.x, nextPoint.y);
  ctx.closePath();
  ctx.stroke();

  if (chooseWithProbability(branchingProbabilityInput.value)) {
      branch(nextPoint, angle + getRadians(angDiff), length*0.8, deepth + 1, nextLineWidth);
  }

  if (chooseWithProbability(branchingProbabilityInput.value)) {
    branch(nextPoint, angle - getRadians(angDiff), length*0.8, deepth + 1, nextLineWidth);
  }
}

branch(startPoint, 0, initialLength, 0, initialLineWidth);

angleInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  leavesShadowBlur = 0;
  console.log(e.target.value);
  angDiff = e.target.value;
  arng = new alea(seed);
  ctx.fillStyle = "rgb(238, 225, 225)";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

lengthInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  console.log(e.target.value);
  initialLength = e.target.value;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

deepthInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  console.log(e.target.value);
  maxDepth = e.target.value;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

lengthVarianceInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  lengthVariance = e.target.value;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

angleVarianceInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  angleVariance = e.target.value;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

seedInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  console.log(e.target.value);
  seed = parseInt(e.target.value);
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
})

branchingProbabilityInput.addEventListener('input', e => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

drawLeavesCheckbox.addEventListener('change', e => {
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

drawShadowsCheckbox.addEventListener('change', e => {
  branchesShadowBlur = 5;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

branchColorInput.addEventListener('change', e => {
  ctx.strokeStyle = e.target.value;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});

rootThickness.addEventListener('input', e => {
  initialLineWidth = e.target.value;
  arng = new alea(seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
});


const download = () => {
  const link = document.createElement('a');
  link.download = 'three.jpeg';
  link.href = canvas.toDataURL()
  link.click();
}

const downloadButton = document.querySelector('button#download-btn');
downloadButton.addEventListener('click', download);


const paramsForm = document.querySelector('form')
paramsForm.addEventListener('input', e => {
  console.log(e.target.id);
});
paramsForm.addEventListener('submit', e => e.preventDefault());

const growBtn = document.querySelector('button#grow-btn');

let t = 1;
let level = 0;

growBtn.addEventListener('click', () => {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  branchesShadowBlur = 0;
  t = 1;
  level = 0;
  arng = new alea(seed);
  branch(startPoint, 0, initialLength, 0, initialLineWidth);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  window.requestAnimationFrame(animateTreeGrowth);
});


function animateTreeGrowth() {
  if (t == branchPartitionFactor + 1) {

    if (level == maxDepth - 1) {
      const leavesPoints = treeStructure[level].branches.map(branch => branch[branch.length - 1]);
      drawManyLeaves(leavesPoints);
    }
    t = 1;
    level++;
  }

  if (level == maxDepth) return;

  ctx.lineWidth = treeStructure[level].lineWidth;
  const branches = treeStructure[level].branches;
  
  for (let i = 0; i < branches.length; i++) {
    const branchPoints = treeStructure[level].branches[i];

    ctx.beginPath();
    ctx.moveTo(branchPoints[t - 1].x, branchPoints[t - 1].y);
    ctx.lineTo(branchPoints[t].x, branchPoints[t].y);
    ctx.closePath();
    ctx.stroke();
  }

  t++;

  // if (level != maxDepth) {
    window.requestAnimationFrame(animateTreeGrowth)
  // }
}














const infoModal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const toggleInfoModalBtn = document.querySelector('#toggle-info-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');

toggleInfoModalBtn.addEventListener('click', () => {
  infoModal.classList.add('open-modal');
  modalContent.style.animation = `showUp 0.3s ease-in-out`;
});

closeModalBtn.addEventListener('click', () => {
  infoModal.classList.remove('open-modal');
});

modalContent.addEventListener('click', e => {
  e.stopPropagation();
});

infoModal.addEventListener('click', e => {
  e.stopPropagation();
  infoModal.classList.remove('open-modal');
});