var level;
var buff;
var speed = 4, life = 3;
var buffs = [{name: "Life +1", effect: function(){life += 1}}, {name: "award +1", effect: function(){award += 2}}]  //need update
/*
function generateRandomBuffs(){
    var randomBuff = buffs[Math.floor(Math.random()*buffs.length)];
    return randomBuff;
}
*/
function chooseBuff(){
    return new Promise((resolve) => {
        document.getElementById('buff1').addEventListener('click', function() {       
            console.log("select buffing0");    
            resolve(0);
        });

        document.getElementById('buff2').addEventListener('click', function() {
            console.log("select buffing1");    
            resolve(1);
        });
    });
}


// 修改 givebuff 函数，选择 buff 后调用 onBuffSelected
async function givebuff() {
    var buffIndex = await chooseBuff();
    buffs[buffIndex].effect();
    onBuffSelected(); // 选择 buff 后调用刷新关卡逻辑
}

