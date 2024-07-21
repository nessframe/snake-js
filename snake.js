const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);
resize();
function resize() {
    canvas.width = Math.round(window.innerWidth / 1.2 / 20) * 20;
    canvas.height = Math.round(window.innerHeight / 1.4 / 20) * 20;
};

const cell = 20;
let frame = 0;
const maxFrame = 7;
const snake = {
    x:  Math.round(canvas.width / 2 / 20) * 20,
    y:  Math.round(canvas.height / 2 / 20) * 20,
    moveX: cell,
    moveY: 0,
    tails: [],
    tailLength: 3,
};
const berry = {
    x: Math.floor(Math.random() * canvas.width / 20) * 20 + cell / 2,
    y: Math.floor(Math.random() * canvas.height / 20) * 20 + cell / 2,
};


document.addEventListener('keydown', (event) => control(event.code))
// свайпы
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});
document.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    let touch = '';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            touch = 'ArrowRight'
        } else {
            touch = 'ArrowLeft'
        }
    } else {
        if (deltaY > 0) {
            touch = 'ArrowDown'
        } else {
            touch = 'ArrowUp'
        }
    }
    control(touch)
});


requestAnimationFrame(gameLoop);

function gameLoop() {
    requestAnimationFrame(gameLoop)
    if (frame < maxFrame) {
        frame++
        return true;
    }
    frame = 0;

    drawSnake()
    drewBerry()
}
function drawSnake() {
    snake.tails.unshift({ x: snake.x, y: snake.y });
    if (snake.tails.length > snake.tailLength) snake.tails.pop();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#003f5c';
    for (let i = 0; i < snake.tails.length; i++) {
        ctx.fillRect(snake.tails[i].x, snake.tails[i].y, cell, cell);
        ctx.fillStyle = '#005881';
        
        for(let j = i + 1; j < snake.tails.length; j++) {
			if (snake.tails[i].x == snake.tails[j].x && snake.tails[i].y == snake.tails[j].y) {
				alert('Ваша змейка врезалась в саму себя :<')
                restart()
			}
		}
    }
    snake.x += snake.moveX;
    snake.y += snake.moveY;
    collisions()
}
function drewBerry() {
    ctx.fillStyle = '#bd003c';
    ctx.beginPath();
    ctx.arc(berry.x, berry.y, cell / 2, 0, Math.PI * 2, true);
    ctx.fill();
}
function collisions() {
    if (snake.x >= canvas.width) snake.x = 0;
    if (snake.x < 0) snake.x = canvas.width;
    if (snake.y >= canvas.height) snake.y = 0;
    if (snake.y < 0) snake.y = canvas.height;

    if (snake.x === berry.x - cell / 2 && snake.y === berry.y - cell / 2) {
        snake.tailLength++
        berry.x = Math.floor(Math.random() * canvas.width / 20) * 20 + cell / 2
        berry.y = Math.floor(Math.random() * canvas.height / 20) * 20 + cell / 2
    }
}
function restart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    berry.x = Math.floor(Math.random() * canvas.width / 20) * 20 + cell / 2
    berry.y = Math.floor(Math.random() * canvas.height / 20) * 20 + cell / 2

    snake.x = Math.round(canvas.width / 2 / 20) * 20
    snake.y = Math.round(canvas.height / 2 / 20) * 20
    snake.tailLength = 3
    snake.tails = []
    snake.moveX = cell
    snake.moveY = 0
}
let direction = 'right';
function control(event) {
    if (event === 'ArrowUp'  && direction !== 'down') {
        snake.moveX = 0;
        snake.moveY = -cell;
        direction = 'up';
    }
    else if (event === 'ArrowDown' && direction !== 'up') {
        snake.moveX = 0;
        snake.moveY = cell;
        direction = 'down';
    }
    else if (event === 'ArrowLeft' && direction !== 'right') {
        snake.moveX = -cell;
        snake.moveY = 0;
        direction = 'left';
    }
    else if (event === 'ArrowRight' && direction !== 'left') {
        snake.moveX = cell;
        snake.moveY = 0;
        direction = 'right';
    }
}