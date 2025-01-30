// Initialize the canvas and context
function drawmap() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    for (var row = 0; row < labMAT[randomPos].length; row++) {
        for (var col = 0; col < labMAT[randomPos][row].length; col++) {
          var tile = labMAT[randomPos][row][col];
          drawTile(ctx, col, row, tile);
        }
    }
  }
  
  // Define the tile size
  var tileSize = 50;
  
  // Function to draw individual tiles
  function drawTile(ctx, col, row, tile) {
    var x = col * tileSize;
    var y = row * tileSize;
  
    switch (tile) {
      case 0:
        ctx.fillStyle = 'white'; // Empty space
        break;
      case 1:
        ctx.fillStyle = 'red'; // Player
        break;
      case 2:
        ctx.fillStyle = 'gray'; // Wall
        break;
      case 3:
        ctx.fillStyle = 'green'; // Goal
        break;
    }
  
    ctx.fillRect(x, y, tileSize, tileSize);
  }
  
  // Call the init function when the window loads
  window.onload = init;