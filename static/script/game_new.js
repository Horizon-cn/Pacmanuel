var canvas;
canvas.width = 960;
canvas.height = 640;    

var ctx;

var FPS = 50;

var player;

var map = 
[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

function drawmap(){


}

function setup_map(){
    
    for(var x=0; x<50; x++){
        ranObjx = Math.floor(Math.random() * 13)+1;
        ranObjy = Math.floor(Math.random() * 13)+1;
        if(map[ranObjy][ranObjx] == 0){
            map[ranObjy][ranObjx] = 1;
        }
    }

}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function init(){

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    player = new Player();

    setInterval(function(){
        drawmap();
        player.draw();
    }, 500/FPS);

}