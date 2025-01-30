var level;
var buff;
var speed = 4, life = 3;
var buffs = [{name: "Speed +2", effect: function(){speed += 2}},{name: "Life +1", effect: function(){life += 1}}, {name: "award +1", effect: function(){award += 2}}]  //need update
/*
function generateRandomBuffs(){
    var randomBuff = buffs[Math.floor(Math.random()*buffs.length)];
    return randomBuff;
}
*/
function chooseBuff(){
    return new Promise((resolve) => {
        document.getElementById('buff1').addEventListener('click', function() {
            resolve(0);
        });

        document.getElementById('buff2').addEventListener('click', function() {
            resolve(1);
        });
    });
}


async function givebuff() {
    var buffIndex = await chooseBuff();
    buffs[buffIndex].effect();
    var outputDiv = document.getElementById('output');
    console.log("Speed: " + speed + ", Life: " + life + "<br>");
}

