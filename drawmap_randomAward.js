var canvas;
var ctx;
var tileSize = 40;
var FPS = 60;
var width = 960;
var height = 640;

var hp = 100;
var pacman = { x: 1, y: 1 }; // Initial position of Pac-Man
var pacmanImage = new Image();
pacmanImage.src = 'bluetiger.png';
var refreshInterval = 1000; // Refresh interval in milliseconds
var wallsToRemove = 10;
var wallsToAdd = 11;
var wallDensity = 0.85;
var beannum = 10;
var ghostImage = new Image();
ghostImage.src = 'manuel.png'; // Assuming you have a ghost image named 'ghost.png'
var ghostMoveInterval = 300; // Interval for ghost movement in milliseconds

var round = 1; // 定义回合计数
var gpa = 1.0; // 定义初始得分

var whether_award=0; //检测是否受到随机奖励
var whether_attack = 0; //检测是否能吃掉老马

var ghostHarm=25; //老马伤害

var ghosts = [
    { x: 12, y: 1 },
    { x: 1, y: 12 },
    { x: 13, y: 10 },
    { x: 13, y: 10 },
    { x: 13, y: 10 },
    { x: 13, y: 10 }
];

var beans = [];
var awards=[];


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawMap();
    drawPacman();
    drawGhosts();
    generateBeans();
    drawBeans();
    generateAwards();
    round = 1;
    
    document.getElementById('round-counter').innerText = `回合: ${round}`; // 更新显示的回合计数

    window.addEventListener('keydown', movePacman);
    setInterval(refreshMap, refreshInterval);
    setInterval(moveGhosts, ghostMoveInterval);
}


function generateRandomMap(rows, cols, probabilityOfZero) {
    var map = [];
    for (var row = 0; row < rows; row++) {
        var rowArray = [];
        for (var col = 0; col < cols; col++) {
            // Generate a random number and compare it with the probability
            if(pacman.x === col && pacman.y === row){
                rowArray.push(0);
            }else if (Math.random() < probabilityOfZero) {
                rowArray.push(0);
            } else {
                rowArray.push(1);
            }
        }
        map.push(rowArray);
    }

    // Set the outermost boundary to 1
    for (var row = 0; row < rows; row++) {
        map[row][0] = 1;
        map[row][cols - 1] = 1;
    }
    for (var col = 0; col < cols; col++) {
        map[0][col] = 1;
        map[rows - 1][col] = 1;
    }

    // reserve a space for the player
    map[1][1] = 0;
    map[1][2] = 0;
    map[2][1] = 0;

    return map;
}

var map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);

function drawMap() {
    for (var row = 0; row < map.length; row++) {
        for (var col = 0; col < map[row].length; col++) {
            var tile = map[row][col];
            var x = col * tileSize;
            var y = row * tileSize;

            switch (tile) {
                case 0:
                    ctx.fillStyle = 'white'; // Empty space
                    break;
                case 1:
                    ctx.fillStyle = 'gray'; // Wall
                    break;
            }

            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }
}

function drawPacman() {
    var x = pacman.x * tileSize;
    var y = pacman.y * tileSize;
    ctx.drawImage(pacmanImage, x, y, tileSize, tileSize);
}

function drawGhosts() {
    ghosts.forEach(function(ghost) {
        var x = ghost.x * tileSize;
        var y = ghost.y * tileSize;
        ctx.drawImage(ghostImage, x, y, tileSize, tileSize);
    });
}

// 随机生成25个豆子的位置
function generateBeans() {
    beans = [];
    while (beans.length < beannum) {
        var x = Math.floor(Math.random() * (map[0].length - 2)) + 1;
        var y = Math.floor(Math.random() * (map.length - 2)) + 1;
        if (map[y][x] === 0 && !beans.some(bean => bean.x === x && bean.y === y)) {
            beans.push({ x: x, y: y });
        }
    }
    updateBeanCounter();
    updateGpaCounter();
}

// 绘制豆子
function drawBeans() {
    beans.forEach(function(bean) {
        ctx.beginPath();
        ctx.arc((bean.x + 0.5) * tileSize, (bean.y + 0.5) * tileSize, tileSize / 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
    });
}

function updateBeanCounter() {
    document.getElementById('bean-counter').innerText = `剩余豆子: ${beans.length}`;
}

function updateHpCounter() {
    document.getElementById('hp-counter').innerText = `HP: ${hp}`;
}

function updateGpaCounter() {
    var eatenBeans = beannum - beans.length;
    gpa = 1.0 + (3.0 * eatenBeans / beannum); // 线性得分计算

    if (gpa >= 4.0) gpa = 4.0;
    else if (gpa >= 3.7) gpa = 3.7;
    else if (gpa >= 3.3) gpa = 3.3;
    else if (gpa >= 3.0) gpa = 3.0;
    else if (gpa >= 2.7) gpa = 2.7;
    else if (gpa >= 2.3) gpa = 2.3;
    else if (gpa >= 2.0) gpa = 2.0;
    else if (gpa >= 1.7) gpa = 1.7;
    else if (gpa >= 1.3) gpa = 1.3;
    else gpa = 1.0;

    document.getElementById('gpa-counter').innerText = `GPA: ${gpa.toFixed(1)} / 4.0`;
}

function movePacman(event) {
    var newX = pacman.x;
    var newY = pacman.y;

    switch (event.key) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
    }

    // Check if the new position is within bounds and not a wall
    if (newX >= 0 && newX < map[0].length && newY >= 0 && newY < map.length && map[newY][newX] === 0) {
        pacman.x = newX;
        pacman.y = newY;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawGhosts();

    
     //check for collision with award
     if (checkCollisionWithAwards()) {
        awardGained();   
    } 
    
    // Check for collision with the ghosts
    if (checkCollisionWithGhosts()) {
        if (whether_attack){
            eatGhost();
        }
        else {
            hp -= ghostHarm;
            updateHpCounter();
            if (hp <= 0) {
                // Delay the alert to ensure the ghost image overlaps with Pac-Man
                setTimeout(function() {
                    alert("Game Over! Pac-Man has been caught by Professor Manuel.");
                    resetGame();
                }, 100);
            }
        }   
    } else {
        beans = beans.filter(function(bean) {
            return !(bean.x === pacman.x && bean.y === pacman.y);
        });
        updateBeanCounter();
        updateGpaCounter();
        
        if (beans.length === 0) {
            alert("Next Round");
            ghostMoveInterval *= 0.6; // 提升10%
            beannum += 5;
            map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);
            generateBeans(beannum);
            round++; // 增加回合计数
            document.getElementById('round-counter').innerText = `回合: ${round}`; // 更新显示的回合计数
        }
    }
 }
    


function moveGhosts() {
    ghosts.forEach(function(ghost) {
        var directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 }   // Right
        ];
        var direction = directions[Math.floor(Math.random() * directions.length)];
        var newX = ghost.x + direction.x;
        var newY = ghost.y + direction.y;

        // Check if the new position is within bounds and not a wall
        if (newX >= 1 && newX < map[0].length - 1 && newY >= 1 && newY < map.length - 1 && map[newY][newX] === 0) {
            ghost.x = newX;
            ghost.y = newY;
        }
    });
    // Redraw the map, Pac-Man, and ghosts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
    drawBeans();

    // Check for collision with Pac-Man
    if (checkCollisionWithGhosts()) {
        hp -= 25;
        updateHpCounter();
        if (hp <= 0) {
            // Delay the alert to ensure the ghost image overlaps with Pac-Man
            setTimeout(function() {
                alert("Game Over! Pac-Man has been caught by Professor Manuel.");
                resetGame();
            }, 100);
        }
    }
}

function checkCollisionWithGhosts() {
    return ghosts.some(function(ghost) {
        return ghost.x === pacman.x && ghost.y === pacman.y;
    });
}

function refreshMap() {
    // Remove certain number of walls
    for (var i = 0; i < wallsToRemove; i++) {
        var row, col;
        do {
            row = Math.floor(Math.random() * (map.length - 2)) + 1;
            col = Math.floor(Math.random() * (map[0].length - 2)) + 1;
        } while (map[row][col] !== 1 || (row === pacman.y && col === pacman.x));
        map[row][col] = 0;
    }

    // Add certain number of walls
    for (var i = 0; i < wallsToAdd; i++) {
        var row, col;
        var isValidPosition;
        do {
            row = Math.floor(Math.random() * (map.length - 2)) + 1;
            col = Math.floor(Math.random() * (map[0].length - 2)) + 1;

            // 检查新生成的墙是否与ghost的位置重合
            isValidPosition = true;
            for (var j = 0; j < ghosts.length; j++) {
                if (ghosts[j].x === col && ghosts[j].y === row) {
                    isValidPosition = false;
                    break;
                }
            }

            // 检查新生成的墙是否与bean的位置重合
            for (var k = 0; k < beans.length; k++) {
                if (beans[k].x === col && beans[k].y === row) {
                    isValidPosition = false;
                    break;
                }
            }
            
            //检查墙是否与award重合
            isValidPosition = true;
            for (var j = 0; j < awards.length; j++) {
                if (awards[j].x === col && awards[j].y === row) {
                    isValidPosition = false;
                    break;
                }
            }
        } while (map[row][col] !== 0 || (row === pacman.y && col === pacman.x) || !isValidPosition);
        map[row][col] = 1;
    }

    // Redraw the map, Pac-Man, and ghosts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
    drawBeans();
}

function resetGame() {
    pacman = { x: 1, y: 1 }; // Reset Pac-Man's position
    ghosts = [
        { x: 12, y: 1 },
        { x: 1, y: 12 },
        { x: 13, y: 10 },
        { x: 13, y: 10 },
        { x: 13, y: 10 },
        { x: 13, y: 10 }
    ]; // Reset ghosts' positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);
    beannum = 10;
    hp = 100;
    ghostMoveInterval = 300;
    round = 1;
    document.getElementById('round-counter').innerText = `回合: ${round}`; // 更新显示的回合计数

    drawMap();
    drawPacman();
    drawGhosts();
    generateBeans(beannum);
    drawBeans();
    updateHpCounter();
    updateGpaCounter();
}

// Start the game when the "Start" button is clicked
document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    init();
});


// generates the random awards on the map
function generateAwards() {
    awards = [];
    while (awards.length < 5) {
        var x = Math.floor(Math.random() * (map[0].length - 2)) + 1;
        var y = Math.floor(Math.random() * (map.length - 2)) + 1;
        if (map[y][x] === 0 && !awards.some(award => award.x === x && award.y === y) && !beans.some(bean => bean.x === x && bean.y === y)) {
            awards.push({ x: x, y: y });
        }
    }
}


// award gaining, and effect dissapear in 5 sec
function awardGained() {
    var awardKind = Math.floor(Math.random() * 3);
    switch (awardKind) {
        case 0:
            drawAward(award01Image);
            ghostHarm=ghostHarm*0.4; //award 0
            alert("You get an award! Deductions will hurt less in 5 seconds.");
            setTimeout(() => {
                ghostHarm = 100; 
            }, 5000);
            break;
            
            break;
        case 1:
            drawAward(award02Image);
            ghostMoveInterval = ghostMoveInterval*0.5; //award 1: ghost speed*0.5
            alert("You get an award! Manuel will move slower in 5 seconds.");
            setTimeout(() => {
                ghostMoveInterval = 300; 
            }, 5000);
            break;
        case 2:
            drawAward(award03Image); //award 2:eat ghost
            whether_attack=1;
            alert("You get an award! You can now give deduction to Manuel in 5 seconds.");
            setTimeout(() => {
                whether_attack = 0; 
            }, 5000);
            break;
    }
}

function checkCollisionWithAwards() {
    var collisionAwards = awards.some(function(award) {
        return award.x === pacman.x && award.y === pacman.y;
    });
    return collisionAwards;
}


function drawAward(awardType_Image) {
    var x = pacman.x * tileSize;
    var y = pacman.y * tileSize;
    ctx.drawImage(awardType_Image, x, y, tileSize, tileSize);
}


function eatGhost() {
    for (let i = 0; i < ghosts.length; i++) {
        if (ghosts[i].x === pacman.x && ghosts[i].y === pacman.y) {
            ghosts.splice(i, 1); // Remove the ghost from the array
            return true; // Return true if a ghost was eaten
        }
    }
    return false; // Return false if no ghost was eaten
}