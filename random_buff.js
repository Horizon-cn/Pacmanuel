
//图片素材和画布
var award_widthF=50;
var award_heightF=50;

//角色属性
var tiger_speed=5;
var manuel_speed=5;

//状态
var whether_award=0;
var whether_attack=0;

var award=function(x,y){

    this.x=Math.floor (Math.random()*15);
    this.y=Math.floor (Math.random()*15);

    this.checkCollision = function(x,y){
        var collision = false;

        if(original_map[y][x]==0){
          colision = true;
        }
        return collision;
    }

    this.produceAward=function ()
    {
        if (this.checkCollision(this.x,this.y))
        {
            this.plot = function(){
                ctx.drawImage(original_floor,1*50,0,50,50,award_widthF*this.x,award_heightF*this.y,award_widthF,award_heightF);
            }

            original_map[this.x][this.y]=5;
        }
    }

    this.awardGained=function()
    {
        var awardKind=4;
        if (whether_award)
        {
            awardKind=Math.floor (Math.random()*3);
            switch(awardKind){
                case 0:
                    ctx.drawImage(Award0,0*50,0,50,50,award_widthF*this.x,award_heightF*this.y,award_widthF,award_heightF);
                    tiger_speed=tiger_speed+3;
                case 1:
                    ctx.drawImage(Award1,0*50,0,50,50,award_widthF*this.x,award_heightF*this.y,award_widthF,award_heightF);
                    manuel_speed=manuel_speed-2;
                case 2:
                    ctx.drawImage(Award2,0*50,0,50,50,award_widthF*this.x,award_heightF*this.y,award_widthF,award_heightF);
                    whether_attack=1;
            }
        }
    }

}

var tiger=function(x,y){
    this.checkCollision = function(x,y){
        var colision = false;
    
        if(original_map[y][x]==0){
          colision = true;
        }
        else if (original_map[y][x]==5){
            colision=false;
            whether_award=1;
        }
    
        return(colision);
    }
    
}

