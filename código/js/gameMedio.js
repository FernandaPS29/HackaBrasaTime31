const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
//variáveis globais
const cellSize = 100;
const cellGap = 3;
let numberOfResources = 400;
let enemiesInterval = 600;
let frame = 0;
let gameOver = false;
let score = 0;
const winningScore = 150;
let chosenDefender = 1;

const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];

//mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked: false
}
canvas.addEventListener('mousedown', function(){
    mouse.clicked = true;
});
canvas.addEventListener('mouseup', function(){
    mouse.clicked = false;
});
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener('mouseleave', function(){
    mouse.y = undefined;
    mouse.y = undefined;
})
//quadro do jogo
const controlsBar = {
    width: canvas.width, 
    height: cellSize,
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'rgba(27,20,100)';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
function createGrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell (x,y));
        }
    }
}
createGrid();

function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}
//projétil
const projectile = new Image();
projectile.src = 'img/vacina.png';

class Projectile {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.power = 20;
        this.speed = 5;
    }
    update() {
        this.x += this.speed;
    }
    draw(){
       // ctx.fillStyle = 'rgba(0,255,197)';
       // ctx.beginPath();
       // ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
       // ctx.fill();
        ctx.drawImage(projectile, this.x, this. y, this.width, this.height);
    }
}
function handleProjectiles(){
    for (let i=0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) 
            {
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize){
            projectiles.splice(i, 1);
            i--;
        }
    }
}
//defensores
const defender1 = new Image();
defender1.src = 'img/enfermeira.png';
const defender2 = new Image();
defender2.src = 'img/enfermeiro.png';

class Defender {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 167;
        this. spriteHeight = 167;
        this.minFrame = 0;
        this.maxFrame = 1;
        this.chosenDefender = chosenDefender;
    }
    draw(){
        //ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#00B050';
        ctx.font = '30px Londrina Solid';
        ctx.fillText(Math.floor(this.health), this.x + 20, this.y);
        if (this.chosenDefender === 1) {
            ctx.drawImage(defender1, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this. y, this.width, this.height);
        } else if (this.chosenDefender === 2) {
             ctx.drawImage(defender2, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this. y, this.width, this.height);
        }
    }
    update () {
        if (frame % 20 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
       /*     if (this.frameX === 10) this.shootNow = true;
        }
        if (this.shooting){
            this.minFrame = 0;
            this.maxFrame = 11;
        } else {
            this.minFrame = 12;
            this.maxFrame = 20;
        }

        if (this.shooting && this.shootNow) {*/
                projectiles.push(new Projectile(this.x + 50, this.y +50)); 
              /*  this.shootNow = false;
        }*/
    }
    }
}

const card1 = {
    x: 10,
    y: 10,
    width: 70,
    height: 85
}
const card2 = {
    x:90,
    y:10,
    width: 70,
    height: 85
}

function chooseDefender(){
    let card1stroke = 'rgba(236,0,140)';
    let card2stroke = 'rgba(236,0,140)';

    if (collision(mouse, card1) && mouse.clicked) {
        chosenDefender = 1;
    } else if (collision(mouse, card2) && mouse.clicked) {
        chosenDefender = 2;
    }
    if (chosenDefender === 1) {
        card1stroke = 'rgba(0,255,197)';
        card2stroke = 'rgba(236,0,140)';
    } else if (chosenDefender === 2) {
        card1stroke = 'rgba(236,0,140)';
        card2stroke = 'rgba(0,255,197)';
    } else {
        card1stroke = 'rgba(236,0,140)';
        card2stroke = 'rgba(236,0,140)';
    }

    ctx.lineWidth = 1;
    ctx.fillStyle = '#FFE699';
    
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1stroke;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(defender1, 0, 0, 131, 131, 7, 10, 131/2, 131/2);
    
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
    ctx.strokeStyle = card2stroke;
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
    ctx.drawImage(defender2, 0, 0, 131, 131, 85, 10, 131/2, 131/2);
}

canvas.addEventListener('click', function(){
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i=0; i < defenders.length; i++){
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
    }
    let defenderCost = 100;
    if (numberOfResources >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }
});
function handleDefenders() {
    for (let i=0; i<defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        if (enemyPositions.indexOf(defenders[i].y) !== -1) {
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }
        for (let j = 0; j < enemies.length; j++) {
            if (defenders[i] && collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health -= 0.2;
            }
            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}
//recursos flutuantes
const floating = new Image();
floating.src = 'img/protecao.png';

const floatingMessages = [];
class floatingMessage {
    constructor(value, x, y, size, color){
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.color = color;
        this.opacity = 1;
        this.width = 40;
        this.height = 40;
    }
    update(){
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > 0.01) this.opacity -= 0.05;
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Londrina Solid';
        ctx.fillText(this.value, this.x, this.y);
        ctx.globalAlpha = 1;
        ctx.drawImage(floating, this.x, this.y, this.width, this.height);
    }
}
function handleFloatingMessages(){
    for (let i=0; i<floatingMessages.length; i++){
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if(floatingMessages[i].lifeSpan >= 50) {
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}

//inimigos
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'img/covid1.png';
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = 'img/covid2.png';
enemyTypes.push(enemy2);
const enemy3 = new Image();
enemy3.src = 'img/covid3.png';
enemyTypes.push(enemy3);

class Enemy {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 1.0;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 3;
        if (this.enemyType === enemy1){
            this.spriteWidth = 150;
            this.spriteHeight = 150;
        } else if (this.enemyType === enemy2 || this.enemyType === enemy3) {
            this.spriteWidth = 100;
            this.spriteHeight = 100;
       }
    }
    update(){
        this.x -= this.movement;
        if (frame % 5 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame; 
        }
        
    }
    draw(){
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.enemyType === enemy1){
            ctx.fillStyle = '#FF0000';
        } else if (this.enemyType === enemy2) {
            ctx.fillStyle = '#0000FF';
       } else if (this.enemyType === enemy3) {
        ctx.fillStyle = '#FFC000';
        }
        ctx.font = '30px Londrina Solid';
        ctx.fillText(Math.floor(this.health), this.x + 20, this.y - 5);
        //ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}
function handleEnemies(){
    for (let i=0; i<enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true;
        }
        if (enemies[i].health <= 0){
            let gainedResources = enemies[i].maxHealth/10;
            floatingMessages.push(new floatingMessage('+ '+ gainedResources, enemies[i].x, enemies[i].y, 30, 'rgba(27,20,100)'));
            floatingMessages.push(new floatingMessage('+ '+ gainedResources, 250, 50, 30, '#FFFF00'));
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if (frame % enemiesInterval === 0 && score < winningScore){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -=50;
    }
}
//recursos
const mask = new Image();
mask.src = 'img/mascara.png';
const alcohol = new Image();
alcohol.src = 'img/alcool.png';
const hands = new Image();
hands.src = 'img/lavar.png';

const amounts = [50,60,70];
class Resource {
    constructor () {
        this.x = Math.random() + (canvas.width - cellSize);
        this.y = (Math.floor(Math.random() * 5)+ 1) * cellSize + 25;
        this.width = cellSize *0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random()*amounts.length)];
        this.width = 40;
        this.height = 40;
    }
    draw() {
        //ctx.fillStyle = 'rgba(236,0,140)';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#FF6600';
        ctx.font = '30px Londrina Solid';
        ctx.fillText (this.amount, this.x, this.y);
        if (this.amount === 50) {
            ctx.drawImage(alcohol, this.x, this. y, this.width, this.height);
        } else if (this.amount === 60) {
            ctx.drawImage(hands, this.x, this. y, this.width, this.height);
        } else if (this.amount === 70) {
            ctx.drawImage(mask, this.x, this. y, this.width, this.height);
        }

        
    }
}
function handleResources(){
    if (frame % 500 === 0 && score < winningScore) {
        resources.push(new Resource());
    }
    for (let i=0; i<resources.length; i++) {
        resources[i].draw();
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
            numberOfResources += resources[i].amount;
            floatingMessages.push(new floatingMessage('+ '+ resources[i].amount, '+ '+ resources[i].x, '+ '+ resources[i].y, 20, 'rgba(27,20,100)'));
            floatingMessages.push(new floatingMessage('+ '+ resources[i].amount, 250, 50, 30, '#FFFF00'));
            resources.splice(i, 1);
            i--;
        }
    }
}


//utilitários
function handleGameStatus(){
    ctx.fillStyle = '#FFE699';
    ctx.font = '30px Londrina Solid';
    ctx.fillText ('Pontos: ' + score, 180, 35);
    ctx.fillText ('CoDefenders: ' + numberOfResources, 180, 75);
    if (gameOver) {
        ctx.fillStyle = '#FFE699';
        ctx.font = '60px Londrina Solid';
        ctx.fillText('Fim do jogo!', 500, 50);
    }
    if (score >= winningScore && enemies.length === 0) {
        ctx.fillStyle = '#FFE699';
        ctx.font = '50px Londrina Solid';
        ctx.fillText('Nível médio completo!', 500, 50);
        ctx.font = '30px Londrina Solid';
        ctx.fillText ('Você fez '+ score + ' pontos! ', 500, 90);
    }
}

canvas.addEventListener('click', function () {
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i=0; i < defenders.length; i++) {
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
        return;
    }
    let defenderCost = 100;
    if (numberOfResources >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    } else {
        floatingMessages.push(new floatingMessage('Você precisa de mais CoDefenders!', mouse.x, mouse.y, 15, 'rgba(27,20,100)'));
    }

})

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(27,20,100)';
    ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleResources();
    handleProjectiles();
    handleEnemies();
    chooseDefender();
    handleGameStatus();
    handleFloatingMessages();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();
function collision (first, second){
    if ( !(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)
    ) {
        return true;
    };
};

window.addEventListener('resize', function() {
    canvasPosition = canvas.getBoundingClientRect();
})