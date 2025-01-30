var canvas;
var ctx;
var tileSize = 40;
var FPS = 50;
var width = 960;
var height = 640;


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

    return map;
}

var map = generateRandomMap(height / tileSize, width / tileSize, 0.8);

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
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
                    ctx.fillStyle = 'red'; // Wall
                    break;
            }

            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }
}

// Call the init function when the window loads
window.onload = init;