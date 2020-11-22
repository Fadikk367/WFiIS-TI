const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const data = {
  0: {
    A: 15, 
    B: 0, 
    C: 3, 
    D: 1
  }, 
  1: {
    A: 15, 
    B: 3, 
    C: 0, 
    D: 1
  }, 
  2: {
    A: 18, 
    B: 0, 
    C: 0, 
    D: 1
  }
}

for (let i = 0; i < 5; i++) {
  ctx.fillRect(25+ i*100, 25, 50, 200);
  ctx.font = "10px Arial";
  ctx.fillText("Asdfsd fsdf sdfsd f sdf", 25+ i*100, 220);
}