// Constants
var ghostMoveInterval = 200; // Interval for ghost movement in milliseconds
var whether_award = 0;
var whether_attack = 0;

// function checkCollision(x, y, map) {
//     if (map[y][x] === 0) {
//         return true;
//     }
//     return false;
// }


function generateAwards() {
    awards = [];
    while (awards.length < 5) {
        var x = Math.floor(Math.random() * (map[0].length - 2)) + 1;
        var y = Math.floor(Math.random() * (map.length - 2)) + 1;
        if (map[y][x] === 0 && !awards.some(award => award.x === x && award.y === y)) {
            awards.push({ x: x, y: y });
        }
    }
}

// award gaining
function awardGained(ctx, award_widthF, award_heightF, x, y, Award0, Award1, Award2) {
    if (whether_award) {
        var awardKind = Math.floor(Math.random() * 3);
        switch (awardKind) {
            case 0:
                ctx.drawImage(Award0, 0 * 50, 0, 50, 50, award_widthF * x, award_heightF * y, award_widthF, award_heightF);
                // ghostMoveInterval = 0;
                // setTimeout(() => {
                //     ghostMoveInterval = 100; 
                // }, 5000);
                HP_harm=5;
                break;
            case 1:
                ctx.drawImage(Award1, 0 * 50, 0, 50, 50, award_widthF * x, award_heightF * y, award_widthF, award_heightF);
                ghostMoveInterval = 100;
                setTimeout(() => {
                    ghostMoveInterval = 200; 
                }, 5000);
                break;
            case 2:
                ctx.drawImage(Award2, 0 * 50, 0, 50, 50, award_widthF * x, award_heightF * y, award_widthF, award_heightF);
                whether_attack = 1;
                setTimeout(() => {
                    whether_attack = 0; 
                }, 5000);
                break;
        }
    }
}

// Function to check collision for tiger
function checkTigerCollision(x, y, map) {
    if (awards[y][x] === 1) {
        whether_award = 1;
    }
}
