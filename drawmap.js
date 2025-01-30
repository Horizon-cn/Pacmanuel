var canvas;
var ctx;
var tileSize = 40;
var FPS = 50;
var width = 960;
var height = 640;
var pacman = { x: 1, y: 1 }; // Initial position of Pac-Man
var pacmanImage = new Image();
pacmanImage.src = 'favicon.png';
var refreshInterval = 3000; // Refresh interval in milliseconds
var wallsToRemove = 10;
var wallsToAdd = 10;
var wallDensity = 0.8;

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

var map = generateRandomMap(height / tileSize, width / tileSize, wallDensity);

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawMap();
    drawPacman();

    window.addEventListener('keydown', movePacman);
    setInterval(refreshMap, refreshInterval);
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

    // Redraw the map and Pac-Man
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
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

    // Redraw the map and Pac-Man
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
}

// Call the init function when the window loads
window.onload = init;