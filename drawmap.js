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
ghostImage.src = 'manuel.png'; // The ghost image named 'ghost.png'
var ghostMoveInterval = 10; // Interval for ghost movement in milliseconds

var round = 1; // 定义回合计数
var gpa = 1.0; // 定义初始得分

var ghostSpeed = 2; // pixels per frame
var ghostSize = tileSize; // size of ghost sprite

var ghosts = [
    { x: 12, y: 1, pixelX: 12 * tileSize, pixelY: 1 * tileSize, targetX: 12, targetY: 1 },
    { x: 1, y: 12, pixelX: 1 * tileSize, pixelY: 12 * tileSize, targetX: 1, targetY: 12 },
    { x: 13, y: 10, pixelX: 13 * tileSize, pixelY: 10 * tileSize, targetX: 13, targetY: 10 },
    { x: 12, y: 11, pixelX: 12 * tileSize, pixelY: 11 * tileSize, targetX: 12, targetY: 11 },
    { x: 11, y: 12, pixelX: 11 * tileSize, pixelY: 12 * tileSize, targetX: 11, targetY: 12 },
    { x: 11, y: 14, pixelX: 11 * tileSize, pixelY: 14 * tileSize, targetX: 11, targetY: 14 }
];

var beans = [];

var collisionCheckInterval = 200; // Check collision every 1000ms (1 second)
var lastCollisionCheck = 0; // Track when we last checked for collision

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

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawMap();
    drawPacman();
    drawGhosts();
    generateBeans();
    drawBeans();
    round = 1;
    
    document.getElementById('round-counter').innerText = `回合: ${round}`; // 更新显示的回合计数

    window.addEventListener('keydown', movePacman);
    setInterval(refreshMap, refreshInterval);
    setInterval(moveGhosts, ghostMoveInterval);
}

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
        ctx.drawImage(ghostImage, ghost.pixelX, ghost.pixelY, ghostSize, ghostSize);
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
        case 'w':
        case 'W':
            newY--;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            newY++;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            newX--;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
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
    
    // Check for collision with the ghosts using time interval
    var currentTime = Date.now();
    if (currentTime - lastCollisionCheck >= collisionCheckInterval) {
        lastCollisionCheck = currentTime;
        if (checkCollisionWithGhosts()) {
            lastCollisionCheck += 500;
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
    } else {
        beans = beans.filter(function(bean) {
            return !(bean.x === pacman.x && bean.y === pacman.y);
        });
        updateBeanCounter();
        updateGpaCounter();
        
        // Next level difficulty
        if (beans.length === 0) {
            setTimeout(function() {
                alert("Next Level!");
                ghostMoveInterval *= 0.8; // 提升10%
                ghostSpeed *= 1.2; // 提升20%
                beannum += 5;
                map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);
                generateBeans(beannum);
                round++; // 增加回合计数
                document.getElementById('round-counter').innerText = `回合: ${round}`; // 更新显示的回合计数
            }, 100);
        }

        // Redraw the map, Pac-Man, and ghosts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        drawPacman();
        drawGhosts();
        drawBeans();
    }
}

function moveGhosts() {
    // Only check collision if enough time has passed
    var currentTime = Date.now();
    var shouldCheckCollision = currentTime - lastCollisionCheck >= collisionCheckInterval;
    
    ghosts.forEach(function(ghost,index) {
        // Check if ghost reached its target
        if (Math.abs(ghost.pixelX - ghost.targetX * tileSize) < ghostSpeed &&
            Math.abs(ghost.pixelY - ghost.targetY * tileSize) < ghostSpeed) {
            
            ghost.pixelX = ghost.targetX * tileSize;
            ghost.pixelY = ghost.targetY * tileSize;
            ghost.x = ghost.targetX;
            ghost.y = ghost.targetY;

            // Choose new target
            var directions = [
                { x: 0, y: -1 }, // Up
                { x: 0, y: 1 },  // Down
                { x: -1, y: 0 }, // Left
                { x: 1, y: 0 }   // Right
            ];
            
            var validDirections = directions.filter(dir => {
                let newX = ghost.x + dir.x;
                let newY = ghost.y + dir.y;

                var ghostcollision = false;
                for (var i = 0; i < ghosts.length; i++) {
                    if (i === index) continue;
                    var otherGhost = ghosts[i];
                    if (Math.abs(newX * tileSize- otherGhost.pixelX) < tileSize &&
                Math.abs(newY * tileSize - otherGhost.pixelY) < tileSize)
                        ghostcollision = true;
                }

                return newX >= 1 && newX < map[0].length - 1 && 
                       newY >= 1 && newY < map.length - 1 && 
                       map[newY][newX] === 0 && !ghostcollision;
            });

            if (validDirections.length > 0) {
                var direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                ghost.targetX = ghost.x + direction.x;
                ghost.targetY = ghost.y + direction.y;
            }else{
                ghost.targetX = ghost.x;
                ghost.targetY = ghost.y;
            }
        }

        // Move towards target
        var dx = ghost.targetX * tileSize - ghost.pixelX;
        var dy = ghost.targetY * tileSize - ghost.pixelY;
        
        if (dx !== 0) ghost.pixelX += Math.sign(dx) * ghostSpeed;
        if (dy !== 0) ghost.pixelY += Math.sign(dy) * ghostSpeed;
    });

    // Redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
    drawBeans();

    // Modified collision check using time interval
    if (shouldCheckCollision) {
        lastCollisionCheck = currentTime;
        if (checkCollisionWithGhosts()) {
            lastCollisionCheck += 500;
            hp -= 25;
            updateHpCounter();
            if (hp <= 0) {
                setTimeout(function() {
                    alert("Game Over! Pac-Man has been caught by Professor Manuel.");
                    resetGame();
                }, 100);
            }
        }      
    }
}

// function checkCollisionWithGhosts() {
//     return ghosts.some(function(ghost) {
//         var dx = Math.abs(ghost.pixelX - (pacman.x * tileSize));
//         var dy = Math.abs(ghost.pixelY - (pacman.y * tileSize));
//         return dx < tileSize/2 && dy < tileSize/2;
//     });
// }

function checkCollisionWithGhosts() {
    return ghosts.some(function(ghost) {
        var pacmanLeft = pacman.x * tileSize;
        var pacmanRight = pacmanLeft + tileSize;
        var pacmanTop = pacman.y * tileSize;
        var pacmanBottom = pacmanTop + tileSize;

        var ghostLeft = ghost.pixelX;
        var ghostRight = ghostLeft + ghostSize;
        var ghostTop = ghost.pixelY;
        var ghostBottom = ghostTop + ghostSize;

        return !(pacmanRight <= ghostLeft || pacmanLeft >= ghostRight || pacmanBottom <= ghostTop || pacmanTop >= ghostBottom);
    });
}

// Add this helper function
function isTileEmpty(row, col) {
    // Check if tile has no wall
    if (map[row][col] === 1) return false;
    
    // Check if pacman is there
    if (pacman.x === col && pacman.y === row) return false;
    
    // Check if any ghost is there
    for (var i = 0; i < ghosts.length; i++) {
        if (Math.floor(ghosts[i].pixelX / tileSize) === col && 
            Math.floor(ghosts[i].pixelY / tileSize) === row) {
            return false;
        }
    }
    
    // Check if any bean is there
    for (var i = 0; i < beans.length; i++) {
        if (beans[i].x === col && beans[i].y === row) {
            return false;
        }
    }
    
    return true;
}

// Replace the refreshMap function
function refreshMap() {
    // Store positions of walls to remove
    var wallsToRemoveList = [];
    
    // Find existing walls that can be removed
    for (var row = 1; row < map.length - 1; row++) {
        for (var col = 1; col < map[0].length - 1; col++) {
            if (map[row][col] === 1) {
                wallsToRemoveList.push({row: row, col: col});
            }
        }
    }
    
    // Randomly select and remove walls
    for (var i = 0; i < Math.min(wallsToRemove, wallsToRemoveList.length); i++) {
        var index = Math.floor(Math.random() * wallsToRemoveList.length);
        var pos = wallsToRemoveList[index];
        map[pos.row][pos.col] = 0;
        wallsToRemoveList.splice(index, 1);
    }
    
    // Find empty tiles for new walls
    var emptyTiles = [];
    for (var row = 1; row < map.length - 1; row++) {
        for (var col = 1; col < map[0].length - 1; col++) {
            if (isTileEmpty(row, col)) {
                emptyTiles.push({row: row, col: col});
            }
        }
    }
    
    // Add new walls on empty tiles
    for (var i = 0; i < Math.min(wallsToAdd, emptyTiles.length); i++) {
        var index = Math.floor(Math.random() * emptyTiles.length);
        var pos = emptyTiles[index];
        map[pos.row][pos.col] = 1;
        emptyTiles.splice(index, 1);
    }

    // Redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
    drawBeans();
}

function resetGame() {
    pacman = { x: 1, y: 1 }; // Reset Pac-Man's position
    ghosts = [
        { x: 12, y: 1, pixelX: 12 * tileSize, pixelY: 1 * tileSize, targetX: 12, targetY: 1 },
        { x: 1, y: 12, pixelX: 1 * tileSize, pixelY: 12 * tileSize, targetX: 1, targetY: 12 },
        { x: 13, y: 10, pixelX: 13 * tileSize, pixelY: 10 * tileSize, targetX: 13, targetY: 10 },
        { x: 12, y: 11, pixelX: 12 * tileSize, pixelY: 11 * tileSize, targetX: 12, targetY: 11 },
        { x: 11, y: 12, pixelX: 11 * tileSize, pixelY: 12 * tileSize, targetX: 11, targetY: 12 },
        { x: 11, y: 14, pixelX: 11 * tileSize, pixelY: 14 * tileSize, targetX: 11, targetY: 14 }
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);
    beannum = 10;
    hp = 100;
    ghostMoveInterval = 10;
    ghostSpeed = 2;
    round = 1;
    lastCollisionCheck = 0;
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