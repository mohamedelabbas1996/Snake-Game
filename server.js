const {createGameState,gameLoop,getUpdatedVelocity} = require('./game');
const {FRAME_RATE} = require('./constants'); 
console.log('hello');
let state ;
let bestScore = 0;
const io = require('socket.io')();
io.on('connection',client => {
    
    
     client.on('start',handleStart);

     console.log(state);
   //startGameInterval(client,state);
    client.on('keydown', handleKeyDown);
    client.on('replay', handleReplay);
    function handleStart(){
        startGame(client,state);
    }
    function handleReplay(){
        console.log("replay");
        startGame(client,state);
        //client.on('keydown', handleKeyDown);
    }
    function handleKeyDown(keyCode){
        console.log('keydown');
   // console.log(state.player.vel);
        
            try{
             keyCode = parseInt(keyCode);
             
             const velocity = getUpdatedVelocity(keyCode);
             if (!(velocity.x === state.player.vel.x || state.player.vel.y === velocity.y))
             {
                 state.player.vel = velocity;
            }
        
        
            }catch(e){
                console.error(e);
            }
        
        
        }

    
   
        
}); 



function startGame(client){
     state = createGameState();
     state.bestScore = bestScore;
     console.log(state);
    startGameInterval(client,state);

}
function startGameInterval(client,state){
   
    const intervalId = setInterval(()=>{
        console.log(state.player.vel) ;
        //console.log(state);
const winner = gameLoop(state,client);
if (!winner){
    
    client.emit('gamestate',JSON.stringify(state));
}else{
    
    bestScore = bestScore>state.score?bestScore:state.score;
    const score = state.score;
    client.emit('gameover',{score,bestScore});
    console.log(state.player.snake);
    
    clearInterval(intervalId);
}
    },
    1000/FRAME_RATE); 
}
io.listen(3000);