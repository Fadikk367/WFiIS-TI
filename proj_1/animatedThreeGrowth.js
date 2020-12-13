let t = 1;
let level = 0;
let treeStructure = {};
let treeStructureParams = {};
let threeTheme = {};
let branchPartitionFactor = 20;
let ctx = null;

onmessage = function(evt) {
  if (evt.data.length == 3) {
    treeStructure = evt.data[0];
    treeStructureParams = evt.data[1];
    treeTheme = evt.data[2];
    postMessage({ dataSent: true });
  } else {
    const canvas = evt.data.canvas;
    ctx = canvas.getContext('2d');
  
    ctx.strokeStyle = treeTheme.branchColor;
    // ctx.shadowBlur = treeTheme.isDrawingShadows ? treeTheme.branchShadowBlur : 0;
    ctx.shadowBlur = 5;
    requestAnimationFrame(animateTreeGrowth);
  }
}

function animateTreeGrowth() {
  if (t == branchPartitionFactor + 1) {

    // if (level == treeStructureParams.deepth - 1) {
    //   const leavesPoints = treeStructure[level].branches.map(branch => branch[branch.length - 1]);
    //   drawManyLeaves(leavesPoints);
    // }
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