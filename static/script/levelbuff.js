var level;
var buff;
var speed = 4, life = 3;
<<<<<<< HEAD
var buffs = [{name: "Speed +2", effect: function(){speed += 2} },{name: "Life +1", effect: function(){life += 1}}]  //need update
=======
var buffs = [{name: "Life +1", effect: function(){life += 1}}, {name: "award +1", effect: function(){award += 2}}]  //need update
>>>>>>> man/hhy
/*
function generateRandomBuffs(){
    var randomBuff = buffs[Math.floor(Math.random()*buffs.length)];
    return randomBuff;
}
*/
function chooseBuff(){
    return new Promise((resolve) => {
<<<<<<< HEAD
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
=======
        document.getElementById('buff1').addEventListener('click', function() {       
            console.log("select buffing0");    
            resolve(0);
        });

        document.getElementById('buff2').addEventListener('click', function() {
            console.log("select buffing1");    
            resolve(1);
        });
>>>>>>> man/hhy
    });
}


<<<<<<< HEAD
async function givebuff(){
    var buffIndex = await chooseBuff();
    buffIndex--;
    buffs[buffIndex].effect();
    console.log("You have chosen: " + buffs[buffIndex].name);
    console.log(speed, life);
=======
// 修改 givebuff 函数，选择 buff 后调用 onBuffSelected
async function givebuff() {
    var buffIndex = await chooseBuff();
    buffs[buffIndex].effect();
    onBuffSelected(); // 选择 buff 后调用刷新关卡逻辑
>>>>>>> man/hhy
}

