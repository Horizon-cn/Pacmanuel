var level;
var buff;
var speed = 4, life = 3;
var buffs = [{name: "Speed +2", effect: function(){speed += 2} },{name: "Life +1", effect: function(){life += 1}}]  //need update
/*
function generateRandomBuffs(){
    var randomBuff = buffs[Math.floor(Math.random()*buffs.length)];
    return randomBuff;
}
*/
function chooseBuff(){
    return new Promise((resolve) => {
        console.log("Please choose one buff:");
        console.log("1: " + buffs[0].name);
        console.log("2: " + buffs[1].name);


        function handleKeydown(button) {
            if (button.code === 'Digit1') {
                check = true;
                document.removeEventListener('keydown', handleKeydown);
                resolve(1);
            } else if (button.code === 'Digit2') {
                check = true;
                document.removeEventListener('keydown', handleKeydown);
                resolve(2);
            } else {
                console.log("Invalid input. Please enter 1 or 2.");
            }
        }

    document.addEventListener('keydown', handleKeydown);
    });
}


async function givebuff(){
    var buffIndex = await chooseBuff();
    buffIndex--;
    buffs[buffIndex].effect();
    console.log("You have chosen: " + buffs[buffIndex].name);
    console.log(speed, life);
}

