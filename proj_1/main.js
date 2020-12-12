const canvas = document.querySelector('canvas');
const seedInput = document.querySelector('input#seedInput');

const splitAngleInput = document.querySelector('input[name=splitAngle]');
const branchLengthInput = document.querySelector('input[name=branchLength]');
const currentDeepthInput = document.querySelector('input[name=currentDeepth]');
const splitAngleVarianceInput = document.querySelector('input[name=splitAngleVariance]');
const branchLengthVarianceInput = document.querySelector('input[name=branchLengthVariance]');
const splitProbabilityInput = document.querySelector('input[name=splitProbability]');

const drawLeavesCheckbox = document.querySelector('input#drawLeaves');
const drawShadowsCheckbox = document.querySelector('input#drawShadows');
const branchColorInput = document.querySelector('input#branchColor');
const rootThicknessInput = document.querySelector('input[name=rootThickness]');
const ctx = canvas.getContext('2d');

const defaultSeed = 111;

// function debounce(func, wait, immediate) {
// 	let timeout;
// 	return function() {
// 		const context = this, args = arguments;
// 		const later = function() {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};
// 		const callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.apply(context, args);
// 	};
// };

function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

const treeStructureParams = {
  splitAngle: splitAngleInput.value,
  branchLength: branchLengthInput.value,
  deepth: deepthInput.value,
  splitAngleVariance: splitAngleVarianceInput.value,
  branchLengthVariance: branchLengthVarianceInput.value,
  splitProbability: splitProbabilityInput.value,
  seed: defaultSeed,
}

const defaultRootThickness = rootThicknessInput.value;
const defaultShadowColor = "rgba(0,0,0,0.8)";
const defaultBranchColor = branchColorInput.value;
const defaultLeafColor = "green";
const defaultBranchShadowBlur = 3;
const defaultLeafShadowBlur = 3;

const treeTheme = {
  rootThickness: defaultRootThickness,
  branchColor: defaultBranchColor,
  shadowColor: defaultShadowColor,
  leafColor: defaultLeafColor,
  branchShadowBlur: defaultBranchShadowBlur,
  leafShadowBlur: defaultLeafShadowBlur,
  isDrawingLeaves: false,
  isDrawingShadows: false,
}

let arng = new alea(treeStructureParams.seed);

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



// const treeStyleParams = {
//   branchColorInput
//   branchWidth

// }


let initialLength = branchLengthInput.value;
// let deepth = deepthInput.value;
// let treeStructureParams.splitAngle = splitAngleInput.value;
let lengthVariance = branchLengthVarianceInput.value;
let angleVariance = splitAngleVarianceInput.value;
let leavesShadowBlur = 0;
let branchesShadowBlur = 0;
ctx.strokeStyle = 'black';

const startPoint = {
  x: parseInt(canvasWidth / 2),
  y: canvasHeight - 50,
}

function getRadians(degrees) {
  return degrees * Math.PI / 180;
}


ctx.shadowColor = "rgba(0,0,0,0.8)";
ctx.shadowBlur = branchesShadowBlur;

function resetTreeParams() {
  drawLeavesCheckbox.checked = false;
  drawShadowsCheckbox.checked = false;
  treeStructure = {};
  treeTheme.isDrawingLeaves = false;
  treeTheme.isDrawingShadows = false;
}

function drawSingleLeave(point) {
  ctx.save();

  ctx.shadowBlur = treeTheme.isDrawingShadows ? treeTheme.leafShadowBlur : 0;
  ctx.fillStyle = treeTheme.leafColor
  ctx.beginPath();
  ctx.arc(point.x - 7, point.y - 7, 7, Math.PI/4, Math.PI);
  ctx.fill();

  ctx.restore();
}

function drawManyLeaves(points) {
  points.map(drawSingleLeave);
}


function branch(point, angle, length, currentDeepth, lineWidth) {
  if (currentDeepth >= treeStructureParams.deepth) {
    if (treeTheme.isDrawingLeaves) {
      drawSingleLeave(point);
    }
    return;
  };

  const variancedLentgh = length * (1.0 + (chooseWithProbability(50) ? treeStructureParams.branchLengthVariance/100 : - treeStructureParams.branchLengthVariance/100));
  const variancedAngle = angle * (1.0 + (chooseWithProbability(50) ? treeStructureParams.splitAngleVariance/100 : - treeStructureParams.splitAngleVariance/100))

  const nextPoint = {
    // x: point.x + length*Math.sin(angle)*(1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100)),
    x: point.x + variancedLentgh*Math.sin(variancedAngle),
    // y: point.y - length*Math.cos(angle)*(1.0 + (chooseWithProbability(50) ? lengthVariance/100 : - lengthVariance/100)),
    y: point.y - variancedLentgh*Math.cos(variancedAngle),
  }

  const branchPoints = getBranchPoints(point, nextPoint);
  if (!treeStructure[currentDeepth]) {
    treeStructure[currentDeepth] = {
      branches: [],
      lineWidth,
    }
  }

  treeStructure[currentDeepth].branches.push(branchPoints);
  treeStructure[currentDeepth].lineWidth = lineWidth;

  const nextLineWidth = lineWidth <= 1 ? 1 : lineWidth - 2;

  ctx.strokeStyle = treeTheme.branchColor;
  ctx.shadowBlur = treeTheme.isDrawingShadows ? treeTheme.branchShadowBlur : 0;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(nextPoint.x, nextPoint.y);
  ctx.closePath();
  ctx.stroke();

  if (chooseWithProbability(treeStructureParams.splitProbability)) {
      branch(nextPoint, angle + getRadians(treeStructureParams.splitAngle), length*0.8, currentDeepth + 1, nextLineWidth);
  }

  if (chooseWithProbability(treeStructureParams.splitProbability)) {
    branch(nextPoint, angle - getRadians(treeStructureParams.splitAngle), length*0.8, currentDeepth + 1, nextLineWidth);
  }
}

branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);




const treeStructureForm = document.querySelector('form[name=tree-structure-form]');

function handleStructureFormInput(e) {
  treeStructureParams[e.target.name] = parseInt(e.target.value);

  resetTreeParams();
  arng = new alea(treeStructureParams.seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
}

treeStructureForm.addEventListener('input', throttle(handleStructureFormInput, 33));
treeStructureForm.addEventListener('submit', e => e.preventDefault());




const treeThemeForm = document.querySelector('form[name=treeThemeForm]');

function handleThemeFormInput(e) {
  treeTheme[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

  if (e.target.name === "rootThickness" || e.target.name === "branchColor") {
    resetTreeParams();
  }
  arng = new alea(treeStructureParams.seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
}

treeThemeForm.addEventListener('input', throttle(handleThemeFormInput, 50));
treeThemeForm.addEventListener('submit', e => e.preventDefault());





// drawLeavesCheckbox.addEventListener('change', e => {
//   arng = new alea(treeStructureParams.seed);
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//   branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.lineWidth);
// });

// drawShadowsCheckbox.addEventListener('change', e => {
//   branchesShadowBlur = 5;
//   arng = new alea(treeStructureParams.seed);
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//   branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.lineWidth);
// });

// function handleColorChange(e) {
//   ctx.strokeStyle = e.target.value;
//   arng = new alea(treeStructureParams.seed);
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//   branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.lineWidth);
// }

// branchColorInput.addEventListener('input', throttle(handleColorChange, 50));

// rootThicknessInput.addEventListener('input', e => {
//   treeTheme.lineWidth = e.target.value;
//   arng = new alea(treeStructureParams.seed);
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//   branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.lineWidth);
// });


const download = () => {
  const link = document.createElement('a');
  link.download = 'three.jpeg';
  link.href = canvas.toDataURL()
  link.click();
}

const downloadButton = document.querySelector('button#download-btn');
downloadButton.addEventListener('click', download);

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
  arng = new alea(treeStructureParams.seed);
  branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.shadowBlur = treeTheme.branchShadowBlur;

  window.requestAnimationFrame(animateTreeGrowth);
});


function animateTreeGrowth() {
  if (t == branchPartitionFactor + 1) {

    if (level == treeStructureParams.deepth - 1) {
      const leavesPoints = treeStructure[level].branches.map(branch => branch[branch.length - 1]);
      drawManyLeaves(leavesPoints);
    }
    t = 1;
    level++;
  }

  if (level == treeStructureParams.deepth) return;

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

  // if (level != treeStructureParams.deepth) {
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