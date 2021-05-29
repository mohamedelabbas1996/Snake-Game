const {GRID_SIZE} = require('./constants');
module.exports = {

    createGameState,
    gameLoop,
    getUpdatedVelocity
}
function getUpdatedVelocity(keyCode)
{
    switch(keyCode){

        case 37:
            {
            return {x:-1,y:0};
        }
        case 38:{
            return {x:0,y:-1};
        }
        case 39:{
            return {x:1,y:0};

        }
        case 40:{
            return {x:0,y:1};
 
        }
        default :{
            return {x:0,y:0};
        }

    }

}

function gameLoop(state,client){
    let timeoutId;
    if (!state){
        return
    }
    const playerOne = state.player;
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    if (playerOne.pos.x< 0 || playerOne.pos.x>GRID_SIZE||playerOne.pos.y< 0 || playerOne.pos.y> GRID_SIZE)
     {
         return 2;
     }
     if (isBigFoodEaten(state.player.pos,state.bigFood)){
        clearTimeout(timeoutId);
         client.emit('bigfoodeaten');
         
        state.score += 30;
        state.bigFood.isAvailable = false;
     }
     if (isSmallFoodEaten(state.player.pos,state.food))
     {
        client.emit('smallfoodeaten');
         playerOne.snake.push({...playerOne.pos});
         playerOne.pos.x += playerOne.vel.x;
         playerOne.pos.y += playerOne.vel.y;
         
         state.score += 10;
         
         state.counter +=1;
         //
         state.food = randomFood(state);

         if (state.counter===5){
            client.emit('bigfoodavailable');
             showBigFood(state);
             timeoutId =setTimeout(hideBigFood,7000);
             state.counter = 0; 
         }

     }

     if (playerOne.vel.x || playerOne.vel.y  ){
         for (let cell of playerOne.snake){
             if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y){
                 
                 return 2;
             }
         }
         playerOne.snake.push({...playerOne.pos})
         playerOne.snake.shift();

     }
     return false;
     function hideBigFood(){
         client.emit('bigfoodtimedout');
         state.bigFood.isAvailable = false;
     }
}
function showBigFood(state){
    state.bigFood.isAvailable = true;
    //generate radom big food
    const bigFood = randomFood(state); 
    state.bigFood.x = bigFood.x;
    state.bigFood.y = bigFood.y;
}
function isBigFoodEaten(player,food){
    if ((player.x >= food.x && player.x <= food.x+ 1)  && (player.y >= food.y && player.y <= food.y+ 1) && food.isAvailable){
        return true;
    }
    return false;
}
function isSmallFoodEaten(player,food){
    if (player.x === food.x && player.y ===food.y ){
        return true;
    }
    return false;

}
function randomFood(state){
    food = {
        x: Math.floor(Math.random() *GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE)
         
    }
    for (let cell of state.player.snake){
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        } 
    }
    return food;
    }

function createGameState(){
return (
    {
        
        counter : 0,
        bestScore:0,
        score : 0,
        player:{
            snake:[
                {x:10,y:10},
                {x:11,y:10},
                {x:12,y:10},
                {x:13,y:10},
                {x:14,y:10}
            
            ],
        
            pos:{
            x:14,
            y:10
            },
        
            vel:{
                x:1,
                y:0
            }
        },
        bigFood:{
            x:23,
            y:11,
            isAvailable:false
        },
        food:{
        x:12,
        y:12
        
        } 
        
        ,
        gridSize:GRID_SIZE
        
        
        
        }

);

}