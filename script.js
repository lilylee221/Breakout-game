const rulesSlider = document.querySelector('.rules__slider');
const rulesBtn = document.querySelector('.rules__btn');
const closeBtn = document.querySelector('.rules__slider__close-btn');

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

let score = 0;
const blocksRows = 9;
const blocksColumns = 5;

//Rules slider open & close handler
rulesBtn.addEventListener('click', () => {
  rulesSlider.classList.add('open');
});
closeBtn.addEventListener('click', () => {
  rulesSlider.classList.remove('open');
});

//Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 40,
  size: 6,
  speed: 4,
  dx: 4,
  dy: -4,
};
//Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

//Block props
blockInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};
const blocks = [];
for (let i = 0; i < blocksRows; i++) {
  blocks[i] = [];
  for (let j = 0; j < blocksColumns; j++) {
    const x = i * (blockInfo.w + blockInfo.padding) + blockInfo.offsetX;
    const y = j * (blockInfo.h + blockInfo.padding) + blockInfo.offsetY;
    blocks[i][j] = { x, y, ...blockInfo };
  }
}

//Draw ball

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  ctx.fillStyle = '#70d6ff';
  ctx.fill();
  ctx.closePath();
}

//Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#70d6ff';
  ctx.fill();
  ctx.closePath();
}

//Draw score

function drawScore() {
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Draw blocks
function drawBlocks() {
  blocks.forEach((column) => {
    column.forEach((block) => {
      ctx.beginPath();
      ctx.rect(block.x, block.y, block.w, block.h);
      ctx.fillStyle = block.visible ? '#70d6ff' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

//Move paddle
function movePaddle() {
  paddle.x += paddle.dx;
  //wall detection
  //right
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  //left
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  }
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

//keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

//move ball funtion

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  //wall collision
  //left & right
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  //top & botton
  if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.dy *= -1;
  }
  //paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //Blocks collision
  blocks.forEach((column) => {
    column.forEach((block) => {
      if (block.visible) {
        if (
          ball.x - ball.size > block.x && //left check
          ball.x + ball.size < block.x + block.w && //right check
          ball.y + ball.size > block.y && // top side check
          ball.y - ball.size < block.y + block.h //bottom side check
        ) {
          ball.dy *= -1;
          block.visible = false;
          score++;
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    score = 0;
    resetBlocks();
  }
  if (score === blocksRows * blocksColumns) {
    resetBlocks();
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2 + 40;
  }
}

//reset  blocks function
function resetBlocks() {
  blocks.forEach((column) => {
    column.forEach((block) => {
      block.visible = true;
    });
  });
}
//when scroe reaches to 45, win the game and reset the game
function winningGame() {
  if (score % (blocksRows * blocksColumns) === 0) {
    showAllBlocks();
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2 + 40;
  }
}

//Draw All
function drawAll() {
  //clear canvas whenever there is an update
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBlocks();
}

function update() {
  drawAll();
  movePaddle();
  moveBall();
  requestAnimationFrame(update);
}
update();

//key event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
