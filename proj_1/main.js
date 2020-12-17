const canvas = document.querySelector('canvas');
const canvasContainer = document.querySelector('#content');
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

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const defaultRootThickness = rootThicknessInput.value;
const defaultShadowColor = "rgba(0,0,0,0.8)";
const defaultBranchColor = branchColorInput.value;
const defaultLeafColor = "green";
const defaultBranchShadowBlur = 3;
const defaultLeafShadowBlur = 3;
const defaultSeed = 0;

// Parameters defining tree structure
const treeStructureParams = {
  splitAngle: splitAngleInput.value,
  branchLength: branchLengthInput.value,
  deepth: deepthInput.value,
  splitAngleVariance: splitAngleVarianceInput.value,
  branchLengthVariance: branchLengthVarianceInput.value,
  splitProbability: splitProbabilityInput.value,
  seed: defaultSeed,
}

// Parameters defining tree styling
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

// Structure holding levels of tree which holds lineWidth and array or branches divided on points
let treeStructure = {};

const ctx = canvas.getContext('2d');
const treeGrowthAnimationWorker = new Worker('./animatedThreeGrowth.js');

// Seeded pseudo-random generator
let arng = new alea(treeStructureParams.seed);

// Throttle function coppied from lodash library - I only needed this one so it would be pointles to include or download whole lib
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



// Splits branch into branchPartitionFactor + 1 points in order to proceed tree growth animation
let branchPartitionFactor = 20;

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


const chooseWithProbability = probability => (probability >= arng()*100);

let canvasHeight = canvas.offsetHeight;
let canvasWidth = canvas.offsetWidth;

canvas.height = canvasHeight;
canvas.width = canvasWidth;

let startPoint = {
  x: parseInt(canvasWidth / 2),
  y: canvasHeight - 50,
}


function fitCanvasToContainer() {
  canvasWidth = canvasContainer.offsetWidth;
  canvasHeight = canvasContainer.offsetHeight;
  
  canvas.style.width = canvasWidth;
  canvas.style.height = canvasHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}


function getRadians(degrees) {
  return degrees * Math.PI / 180;
}


ctx.shadowColor = "rgba(0,0,0,0.8)";


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


const calculateVariancedLength = (length, branchLengthVariance) => (
  length * (1.0 + branchLengthVariance/100 * (chooseWithProbability(50) ? 1 : -1))
);


const calculateVariancedAngle = (angle, splitAngleVariance) => (
  angle * (1.0 + splitAngleVariance/100 * (chooseWithProbability(50) ? 1 : -1))
);


const calculateNextLineWidth = lineWidth => lineWidth <= 1 ? 1 : lineWidth - 2;


const isBranchFinished = currentDeepth => currentDeepth >= treeStructureParams.deepth;


function drawBranch(startPoint, endPoint, lineWidth) {
  ctx.strokeStyle = treeTheme.branchColor;
  ctx.shadowBlur = treeTheme.isDrawingShadows ? treeTheme.branchShadowBlur : 0;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.closePath();
  ctx.stroke();
}


// Core function in the app - this one is called recursively to draw a tree
function branch(point, angle, length, currentDeepth, lineWidth) {
  if (isBranchFinished(currentDeepth)) {
    if (treeTheme.isDrawingLeaves) {
      drawSingleLeave(point);
    }
    return;
  };

  const variancedLentgh = calculateVariancedLength(length, treeStructureParams.branchLengthVariance);
  const variancedAngle = calculateVariancedAngle(angle, treeStructureParams.splitAngleVariance);

  const nextPoint = new Point(
    point.x + variancedLentgh*Math.sin(variancedAngle),
    point.y - variancedLentgh*Math.cos(variancedAngle),
  )

  const branchPoints = getBranchPoints(point, nextPoint);
  if (!treeStructure[currentDeepth]) {
    treeStructure[currentDeepth] = {
      branches: [],
      lineWidth,
    }
  }

  treeStructure[currentDeepth].branches.push(branchPoints);
  treeStructure[currentDeepth].lineWidth = lineWidth;

  drawBranch(point, nextPoint, lineWidth);

  const nextLineWidth = calculateNextLineWidth(lineWidth);
  
  const shouldDrawRightBranch = chooseWithProbability(treeStructureParams.splitProbability);
  const shouldDrawLeftBranch = chooseWithProbability(treeStructureParams.splitProbability);
  
  if (shouldDrawRightBranch) {
    const nextRigthBranchAngle = angle + getRadians(treeStructureParams.splitAngle);
    branch(nextPoint, nextRigthBranchAngle, length*0.8, currentDeepth + 1, nextLineWidth);
  }
  
  if (shouldDrawLeftBranch) {
    const nextLeftBranchAngle = angle - getRadians(treeStructureParams.splitAngle);
    branch(nextPoint, nextLeftBranchAngle, length*0.8, currentDeepth + 1, nextLineWidth);
  }
}

branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);



// Hadling tree parameter forms inputs
const treeStructureForm = document.querySelector('form[name=tree-structure-form]');
const treeThemeForm = document.querySelector('form[name=treeThemeForm]');


function handleStructureFormInput(e) {
  treeStructureParams[e.target.name] = parseInt(e.target.value);

  resetTreeParams();
  arng = new alea(treeStructureParams.seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
}


function handleThemeFormInput(e) {
  treeTheme[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

  if (e.target.name === "rootThickness" || e.target.name === "branchColor") {
    resetTreeParams();
  }
  arng = new alea(treeStructureParams.seed);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
}


treeStructureForm.addEventListener('input', throttle(handleStructureFormInput, 33));
treeThemeForm.addEventListener('input', throttle(handleThemeFormInput, 50));

treeStructureForm.addEventListener('submit', e => e.preventDefault());
treeThemeForm.addEventListener('submit', e => e.preventDefault());


function handleWindowResize() {
  fitCanvasToContainer();
  
  startPoint = {
    x: parseInt(canvasContainer.offsetWidth / 2),
    y: canvasContainer.offsetHeight - 50,
  };
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  resetTreeParams();
  arng = new alea(treeStructureParams.seed);
  branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
}

window.addEventListener('resize', handleWindowResize);








const treeAnimationButton = document.querySelector('button#grow-btn');

treeAnimationButton.addEventListener('click', () => {
  const animationCanvas = document.createElement('canvas');
  animationCanvas.width = canvasWidth;
  animationCanvas.height = canvasHeight;
  animationCanvas.style.width = canvasWidth;
  animationCanvas.style.height = canvasHeight;
  canvas.style.display = 'none';
  canvasContainer.appendChild(animationCanvas);
  const offscreen = animationCanvas.transferControlToOffscreen();

  treeAnimationButton.disabled = true;
  treeAnimationButton.classList.toggle('disabled');

  treeGrowthAnimationWorker.postMessage({ canvas: offscreen, treeStructure, treeStructureParams, treeTheme }, [offscreen]);

  treeGrowthAnimationWorker.onmessage = function(evt) {
    if (evt.data.isAnimationFinished) {
      canvasContainer.removeChild(animationCanvas);
      arng = new alea(treeStructureParams.seed);
      branch(startPoint, 0, treeStructureParams.branchLength, 0, treeTheme.rootThickness);
      canvas.style.display = 'block';
      treeAnimationButton.disabled = false;
      treeAnimationButton.classList.toggle('disabled');
    }
  };
});






// UI utils - modal toggling, downloading tree picture etc.
const infoModal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const toggleInfoModalBtn = document.querySelector('#toggle-info-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const downloadButton = document.querySelector('button#download-btn');


function handleTreeDownload() {
  const link = document.createElement('a');
  link.download = 'three.jpeg';
  link.href = canvas.toDataURL()
  link.click();
}


toggleInfoModalBtn.addEventListener('click', () => {
  infoModal.classList.add('open-modal');
  modalContent.style.animation = `slideIn 0.4s ease-in-out`;
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

downloadButton.addEventListener('click', handleTreeDownload);