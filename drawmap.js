var canvas;
var ctx;
var tileSize = 40;
var FPS = 60;
var width = 960;
var height = 640;

var hp = 100;
var pacman = { x: 1, y: 1 }; // Initial position of Pac-Man
var pacmanImage = new Image();
pacmanImage.src = './static/image/bluetiger.png';
var refreshInterval = 1000; // Refresh interval in milliseconds

var hwallImage = new Image();
hwallImage.src = './images/walls/floor_with_flower.png';
var vwallImage = new Image();
vwallImage.src = './images/walls/sidewall_flower.png';
var nwallImage = new Image();
nwallImage.src = './images/walls/sidewall_no_flower.png';
var wallsToRemove = 10;
var wallsToAdd = 11;
var wallDensity = 0.85;

var beannum = 10;
var beanImage = new Image();
beanImage.src = "./static/image/bean.png";

var ghostImage = new Image();
ghostImage.src = './static/image/manuel.png'; // The ghost image named 'ghost.png'
var ghostMoveInterval = 10; // Interval for ghost movement in milliseconds

var level;
var buff;
var speed = 4, life = 3;
var buffs = [
    {name: "Hp +25", effect: function(){if(hp != 100)hp += 25; updateHpCounter();}}, 
    {name: "Beannum need -2", effect: function(){beannum -= 2}}
]  //need update


var round = 1; // 定义回合计数
var gpa = 1.0; // 定义初始得分

var ghostSpeed = 2; // pixels per frame
var ghostSize = tileSize; // size of ghost sprite
var ghostHarm = 25; // damage caused by ghosts
var normalghostHarm = ghostHarm;

var ghosts = [
    { x: 12, y: 1, pixelX: 12 * tileSize, pixelY: 1 * tileSize, targetX: 12, targetY: 1 },
    { x: 1, y: 12, pixelX: 1 * tileSize, pixelY: 12 * tileSize, targetX: 1, targetY: 12 },
    { x: 13, y: 10, pixelX: 13 * tileSize, pixelY: 10 * tileSize, targetX: 13, targetY: 10 },
    { x: 12, y: 11, pixelX: 12 * tileSize, pixelY: 11 * tileSize, targetX: 12, targetY: 11 },
    { x: 11, y: 12, pixelX: 11 * tileSize, pixelY: 12 * tileSize, targetX: 11, targetY: 12 },
    { x: 11, y: 14, pixelX: 11 * tileSize, pixelY: 14 * tileSize, targetX: 11, targetY: 14 }
];

var beans = [];
let gamePaused = false;

var collisionCheckInterval = 60; // Check collision every 1000ms (1 second)
var lastCollisionCheck = 0; // Track when we last checked for collision

var buffPoints = [];
var activeBuffs = new Set();
var buffImage1 = new Image();
buffImage1.src = 'images/award/award01Image.png'; // Damage reduction buff
var buffImage2 = new Image();
buffImage2.src = 'images/award/award02Image.png'; // Speed reduction buff
var buffImage3 = new Image();
buffImage3.src = 'images/award/award03Image.png'; // Freeze buff

var originalGhostHarm = 25;
var originalGhostMoveInterval = 10;
var originalGhostSpeed = 2;

var lastTime = 0;
var animationFrameId;

// Add these variables at the top with other variables
var messages = [];
var messageTimeout = 2000; // How long each message stays on screen (2 seconds)

// Add this variable near the top with other variables
var whether_attack = false;

// Modify the buffPoint structure to include image and effect
var buffPoints = [];
var buffEffects = [
    {
        name: "Freeze Ghosts",
        image: buffImage1,
        apply: function() {
            ghostSpeed = 0; // Effectively freeze ghosts
            setTimeout(() => { ghostSpeed = originalGhostSpeed; }, 5000);
            showMessage("❄️ All ghosts frozen for 5 seconds!");
        }
    },
    {
        name: "Damage Reduction",
        image: buffImage2,
        apply: function() {
            ghostHarm = 10;
            setTimeout(() => { ghostHarm = originalGhostHarm; }, 5000);
            showMessage(`🛡️ Ghost damage reduced to ${ghostHarm} for 5 seconds!`);
        }
    },
    {
        name: "Ghost Hunter",
        image: buffImage3,
        apply: function() {
            whether_attack = true;
            showMessage("👻 You can now eat ghosts for 5 seconds!");
            setTimeout(() => { 
                whether_attack = false;
            }, 5000);
        }
    }
];

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

function checkDisplayStatus(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const displayStatus = window.getComputedStyle(element).display;
        console.log(`Element with ID "${elementId}" has display status: ${displayStatus}`);
        return displayStatus;
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
        return null;
    }
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    drawMap();
    drawPacman();
    drawGhosts();
    generateBeans();
    generateBuffPoints();
    
    document.getElementById('round-counter').innerText = `回合: ${round}`;
    window.addEventListener('keydown', movePacman);
    setInterval(refreshMap, refreshInterval);
    setInterval(moveGhosts, ghostMoveInterval);

    // Start the game loop
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function drawMap() {
    for (var row = 0; row < map.length; row++) {
        for (var col = 0; col < map[row].length; col++) {
            var tile = map[row][col];
            var x = col * tileSize;
            var y = row * tileSize;

            if (tile === 0) {
                // Empty space
                ctx.fillStyle = '#FFFFF0';
                ctx.fillRect(x, y, tileSize, tileSize);
            } else if (tile === 1) {
                // Draw walls based on position
                if (row === 0 || row === map.length - 1) {
                    // Horizontal boundary walls
                    ctx.drawImage(hwallImage, x, y, tileSize, tileSize);
                } else if (col === 0 || col === map[row].length - 1) {
                    // Vertical boundary walls
                    ctx.drawImage(vwallImage, x, y, tileSize, tileSize);
                } else {
                    // Inner walls
                    ctx.drawImage(nwallImage, x, y, tileSize, tileSize);
                }
            }
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
        ctx.drawImage(beanImage, 
            bean.x * tileSize + (tileSize - tileSize/2)/2, // center the bean horizontally
            bean.y * tileSize + (tileSize - tileSize/2)/2, // center the bean vertically
            tileSize/2, // make bean slightly smaller than tile
            tileSize/2
        );
    });
}

function updateBeanCounter() {
    const beanCounterElement = document.getElementById('bean-counter');
    console.log("bean-counter:", document.getElementById('bean-counter'));
    if (beanCounterElement) {
        beanCounterElement.innerText = `剩余豆子: ${beans.length}`;
    }
}

function onBuffSelected() {
    console.log("select buff already");
    // 隐藏 buff 界面
    document.getElementById('buff').style.display = 'none';
    document.getElementById('canvas').style.display='block';
    document.getElementById('bean-counter').style.display='block';
    document.getElementById('round-counter').style.display='block';
    document.getElementById('hp-counter').style.display='block';
    document.getElementById('gpa-counter').style.display='block';
    document.querySelector('.info').style.display='block';
    // 刷新关卡逻辑
    ghostMoveInterval *= 0.8; // 提升10%
    ghostSpeed *= 1.2;
    beannum += 5;
    map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);
    generateBeans(beannum);
    generateBuffPoints();
    round++; // 增加回合计数
    console.log("round: ", round);
    const roundCounterElement = document.getElementById('round-counter');
    if (roundCounterElement) {
        roundCounterElement.innerText = `回合: ${round}`; // 更新显示的回合计数
    }
    // 恢复游戏
    gamePaused = false;

    //重新绘制地图、Pac-Man 和幽灵
    ctx = canvas.getContext('2d');
    drawMap();
    drawPacman();
    drawGhosts();
    drawBeans();
    drawBuffPoints();
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

function resetHandler() {
    document.querySelector('.levellose').style.display = 'none'; // 隐藏 levellose 界面
    document.getElementById('canvas').style.display = "block";
    document.getElementById('bean-counter').style.display = "block";
    document.getElementById('round-counter').style.display = "block";
    document.getElementById('gpa-counter').style.display='block';
    document.getElementById('hp-counter').style.display='block';
    document.querySelector('.info').style.display = "block";
    gamePaused = false; // 恢复游戏
    resetGame();
}


function movePacman(event) {

    if (gamePaused) return; // 如果游戏暂停，则不执行移动逻辑

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
    
    // Check for collision with the ghosts using time interval
    var currentTime = Date.now();
    if (currentTime - lastCollisionCheck >= collisionCheckInterval) {
        lastCollisionCheck = currentTime;
        if (checkCollisionWithGhosts()) {
            lastCollisionCheck += 500;
            if (whether_attack) {
                // Try to eat ghost if we have the buff
                eatGhost();
            } else {
                // Normal collision damage
                playGhostSound();
                hp -= ghostHarm;
                showMessage(`👻 Manuel caught you! HP - ${ghostHarm}`);
                updateHpCounter();
                if (hp <= 0) {
                    // Delay the alert to ensure the ghost image overlaps with Pac-Man
                    setTimeout(function() {
                        gamePaused = true; // 暂停游戏
                        document.getElementById('canvas').style.display = "none";
                        document.getElementById('bean-counter').style.display = "none";
                        document.getElementById('round-counter').style.display = "none";
                        document.getElementById('gpa-counter').style.display='none';
                        document.getElementById('hp-counter').style.display='none';
                        document.querySelector('.info').style.display = "none";

                        document.querySelector('.levellose').style.display = 'block'; // 显示 levellose 界面
                        document.getElementById('reset').removeEventListener('click', resetHandler);
                                // Add event listener to the next level button

                        document.getElementById('reset').addEventListener('click', resetHandler);
                        }, 100);
                }
            }
        }
    } else {
        beans = beans.filter(function(bean) {
            if (bean.x === pacman.x && bean.y === pacman.y) {
                playCoinSound(); // 播放音频
                return false;
            }
            return true;
        });
        updateBeanCounter();
        updateGpaCounter();
        
        // Next level difficulty
        if (beans.length === 0) {
            gamePaused = true; // 暂停游戏
            var audio = document.getElementById('winSound');
            audio.play();
            document.getElementById('canvas').style.display = "none";
            document.getElementById('bean-counter').style.display = "none";
            document.getElementById('round-counter').style.display = "none";
            document.getElementById('gpa-counter').style.display='none';
            document.getElementById('hp-counter').style.display='none';
            document.querySelector('.info').style.display = "none";

            document.querySelector('.levelwin').style.display = 'block'; // 显示 levelwin 界面
            document.getElementById('nextlevel').removeEventListener('click', nextLevelHandler);
                    // Add event listener to the next level button

            document.getElementById('nextlevel').addEventListener('click', nextLevelHandler);
        }
    }
    
    // Check for buff collection
    buffPoints.forEach(function(point) {
        if (point.active && !point.collected && point.x === pacman.x && point.y === pacman.y) {
            // Randomly select a buff
            const randomBuff = buffEffects[Math.floor(Math.random() * buffEffects.length)];
            point.collected = true;
            point.effect = randomBuff.apply;
            point.image = randomBuff.image;
            
            // Apply the buff effect
            point.effect();
        }
    });
}

function nextLevelHandler() {
    // Clear the canvas
    document.getElementById('levelwin').style.display = 'none';
    document.getElementById('buff').style.display = 'block';

    // Call givebuff function to test
    givebuff();
}

function playCoinSound() {
    var audio = document.getElementById('coinSound');
    audio.play();
}

function playGhostSound() {
    var audio = document.getElementById('ghostSound');
    audio.play();
}

function moveGhosts() {
    // Only check collision if enough time has passed
    if (gamePaused) return; // 如果游戏暂停，则不执行移动逻辑
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

    // Modified collision check using time interval
    if (shouldCheckCollision) {
        lastCollisionCheck = currentTime;
        if (checkCollisionWithGhosts()) {
            lastCollisionCheck += 500;
            if (whether_attack) {
                // Try to eat ghost if we have the buff
                eatGhost();
            } else {
                // Normal collision damage
                playGhostSound();
                hp -= ghostHarm;
                showMessage(`👻 Manuel caught you! HP - ${ghostHarm}`);
                updateHpCounter();
                if (hp <= 0) {
                    setTimeout(function() {
                        gamePaused = true; // 暂停游戏
                        document.getElementById('canvas').style.display = "none";
                        document.getElementById('bean-counter').style.display = "none";
                        document.getElementById('round-counter').style.display = "none";
                        document.getElementById('gpa-counter').style.display='none';
                        document.getElementById('hp-counter').style.display='none';
                        document.querySelector('.info').style.display = "none";
        
                        document.querySelector('.levellose').style.display = 'block'; // 显示 levellose 界面
                        document.getElementById('reset').removeEventListener('click', resetHandler);
                                // Add event listener to the next level button
        
                        document.getElementById('reset').addEventListener('click', resetHandler);
        
                        }, 100);
                }
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

// Add this new function to handle messages
function showMessage(text, duration = 2000) {
    messages.push({
        text: text,
        startTime: Date.now(),
        duration: duration
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
    
    // Check if any buff is there
    for (var i = 0; i < buffPoints.length; i++) {
        if (buffPoints[i].active && buffPoints[i].x === col && buffPoints[i].y === row) {
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
}

function resetGame() {
    // Cancel existing animation frame if any
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

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
    buffPoints = [];
    activeBuffs.clear();
    generateBuffPoints();
    ghostHarm = originalGhostHarm;
    ghostMoveInterval = originalGhostMoveInterval;
    ghostSpeed = originalGhostSpeed;
    whether_attack = false;
    document.getElementById('round-counter').innerText = `回合: ${round}`; // 更新显示的回合计数

    drawMap();
    drawPacman();
    drawGhosts();
    generateBeans(beannum);
    drawBuffPoints();
    updateHpCounter();
    updateGpaCounter();

    // Restart game loop
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Start the game when the "Start" button is clicked
document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    init();
});

function chooseBuff(){
    return new Promise((resolve) => {
        function buff1Handler() {
            resolve(0); // 假设 buff1 的索引是 0
        }
        function buff2Handler() {
            resolve(1); // 假设 buff2 的索引是 1
        }
        document.getElementById('buff1').removeEventListener('click', buff1Handler);
        document.getElementById('buff1').addEventListener('click', buff1Handler);
        document.getElementById('buff2').removeEventListener('click', buff2Handler);
        document.getElementById('buff2').addEventListener('click', buff2Handler);
    });
}


// 修改 givebuff 函数，选择 buff 后调用 onBuffSelected
async function givebuff() {
    var buffIndex = await chooseBuff();
    buffs[buffIndex].effect();
    onBuffSelected(); // 选择 buff 后调用刷新关卡逻辑
}

// Replace generateBuffPoints function
function generateBuffPoints() {
    buffPoints = [];
    while (buffPoints.length < 5) {
        var x = Math.floor(Math.random() * (map[0].length - 2)) + 1;
        var y = Math.floor(Math.random() * (map.length - 2)) + 1;
        if (map[y][x] === 0 && 
            !buffPoints.some(point => point.x === x && point.y === y) &&
            !beans.some(bean => bean.x === x && bean.y === y)) {
            buffPoints.push({ 
                x: x, 
                y: y,
                active: true,
                collected: false,
                effect: null,
                image: null
            });
        }
    }
}

// Modify the drawBuffPoints function to include message drawing
function drawBuffPoints() {
    // Draw buff points
    buffPoints.forEach(function(point) {
        if (point.active) {
            if (point.collected && point.image) {
                ctx.drawImage(point.image, 
                    point.x * tileSize, 
                    point.y * tileSize, 
                    tileSize, 
                    tileSize
                );
            } else {
                // Draw uncollected buff marker
                ctx.fillStyle = 'gold';
                ctx.beginPath();
                ctx.arc(
                    point.x * tileSize + tileSize/2,
                    point.y * tileSize + tileSize/2,
                    tileSize/4,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    });

    // Draw active messages
    const currentTime = Date.now();
    messages = messages.filter(msg => currentTime - msg.startTime < msg.duration);
    
    if (messages.length > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(width/4, height/2 - 30, width/2, 60);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        messages.forEach((msg, index) => {
            ctx.fillText(msg.text, width/2, height/2 + (index * 25));
        });
        ctx.restore();
    }
}

// Modify gameLoop to ensure messages are drawn on top
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw everything
    drawMap();
    drawPacman();
    drawGhosts();
    drawBeans();
    drawBuffPoints();

    // Request next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Modify eatGhost function to actually remove ghosts
function eatGhost() {
    for (let i = 0; i < ghosts.length; i++) {
        if (Math.floor(ghosts[i].pixelX/tileSize) === pacman.x && 
            Math.floor(ghosts[i].pixelY/tileSize) === pacman.y) {
            ghosts.splice(i, 1); // Remove the ghost from the array
            showMessage("🍽️ Manuel eliminated!");
            return true;
        }
    }
    return false;
}
