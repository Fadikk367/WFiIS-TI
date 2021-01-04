let t = 1;
let level = 0;
let treeStructure = {};
let treeStructureParams = {};
let threeTheme = {};
let branchPartitionFactor = 20;
let ctx = null;


onmessage = function(evt) {
  resetGlobalParameters();

  treeStructure = evt.data.treeStructure;
  treeStructureParams = evt.data.treeStructureParams;
  treeTheme = evt.data.treeTheme;

  const canvas = evt.data.canvas;
  ctx = canvas.getContext('2d');
  ctx.strokeStyle = treeTheme.branchColor;

    
  requestAnimationFrame(animateTreeGrowth);
}


function animateTreeGrowth() {
  if (t == branchPartitionFactor + 1) {
    t = 1;
    level++;
  }

  if (level == treeStructureParams.deepth) {
    postMessage({ isAnimationFinished: true });
    return;
  };

  ctx.lineWidth = treeStructure[level].lineWidth;
  const branches = treeStructure[level].branches;
  
  for (let i = 0; i < branches.length; i++) {
    const branchPoints = treeStructure[level].branches[i];
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(branchPoints[t - 1].x, branchPoints[t - 1].y);
    ctx.lineTo(branchPoints[t].x, branchPoints[t].y);
    ctx.closePath();
    ctx.stroke();
  }

  t++;
  requestAnimationFrame(animateTreeGrowth);
}


function resetGlobalParameters() {
  t = 1;
  level = 0;
  treeStructure = {};
  treeStructureParams = {};
  threeTheme = {};
  branchPartitionFactor = 20;
  ctx = null;
}