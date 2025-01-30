var canvas;
var ctx;
var tileSize = 40;
var FPS = 50;
var width = 960;
var height = 640;
var pacman = { x: 1, y: 1 }; // Initial position of Pac-Man
var pacmanImage = new Image();
pacmanImage.src = 'bluetiger.png';
var refreshInterval = 1000; // Refresh interval in milliseconds
var wallsToRemove = 10;
var wallsToAdd = 10;
var spaceDensity = 0.85;
var ghostImage = new Image();
ghostImage.src = 'manuel.png'; // Assuming you have a ghost image named 'ghost.png'
var ghostMoveInterval = 200; // Interval for ghost movement in milliseconds

var ghosts = [
    { x: 12, y: 1 },
    { x: 13, y: 10 },
    { x: 7, y: 14 },
    { x: 7, y: 7 },
    { x: 7, y: 7 },
    { x: 7, y: 7 },
];

function generateRandomMap(rows, cols, probabilityOfZero) {
    var map = [];
    for (var row = 0; row < rows; row++) {
        var rowArray = [];
        for (var col = 0; col < cols; col++) {
            // Generate a random number and compare it with the probability
            if (Math.random() < probabilityOfZero) {
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

var map = generateRandomMap(height / tileSize, width / tileSize, spaceDensity);

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawMap();
    drawPacman();
    drawGhosts();

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
        var x = ghost.x * tileSize;
        var y = ghost.y * tileSize;
        ctx.drawImage(ghostImage, x, y, tileSize, tileSize);
    });
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

    // Redraw the map, Pac-Man, and ghosts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
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
        do {
            row = Math.floor(Math.random() * (map.length - 2)) + 1;
            col = Math.floor(Math.random() * (map[0].length - 2)) + 1;
        } while (map[row][col] !== 0 || (row === pacman.y && col === pacman.x));
        map[row][col] = 1;
    }

    // Redraw the map, Pac-Man, and ghosts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
}

// Call the init function when the window loads
window.onload = init;