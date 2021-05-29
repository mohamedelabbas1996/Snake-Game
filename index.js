const socket = io('http://localhost:3000');  
socket.on('init',handleinit); 
socket.on('gamestate',handlegameState);
socket.on('gameover',handlegameOver);
socket.on('bigfoodavailable',handleBigFoodAvailable);
socket.on('bigfoodeaten',handleBigFoodEaten);
socket.on('bigfoodtimedout',handleBigTimedout);
socket.on('smallfoodeaten',handleSmallFoodEaten);

const gameScreen = document.getElementById('gameScreen'); 
const BG_COLOR = '#231f20';
const SNAKE_COLOR ='#c2c2c2';
const FOOD_COLOR ='#e66916';
let ctx, canvas, score,playAgainBtn,bestScore,startBtn,gameOverSpan,progressBar,progressBarYellow;
function handleBigTimedout(){
    progressBar.style.display ="none"; 
    progressBarYellow.style.animationPlayState ='initial'; 
}
function handlegameOver(scores){
    document.getElementById('gameoverScore').innerHTML ="Score : " +  scores.score;
    document.getElementById('gameoverBestScore').innerHTML ="Best Score : " +  scores.bestScore;
    playAgainBtn.style.display = "inline";
    
    gameOverSpan.style.display = "block";
}
function handleBigFoodEaten(){
    var audio = new Audio("zapsplat_animals_snake_spit_001_14695.mp3");
    audio.play();
    progressBar.style.display ="none"; 
    progressBarYellow.style.animationPlayState ='initial'; 
}
function handleSmallFoodEaten(){
    var audio = new Audio("zapsplat_animals_snake_spit_001_14695.mp3");

    audio.play();
    
}
function handleBigFoodAvailable(){
   progressBarYellow.style.animationPlayState ='running'; 
    //console.log("animation :"+progressBar.style.animationPlayState);
    var audio = new Audio("show_big_food.wav");
    audio.play();
    progressBar.style.display ="inline"; 
    
    //
}
function handlegameState(gameState){
gameState=JSON.parse(gameState);
//requestAnimationFrame(()=>paintGame(gameState));
paintGame(gameState);
}
function handleinit(msg){

    
}

function init(){
    canvas = document.getElementById('canvas');
    ctx =canvas.getContext('2d');
    canvas.width = canvas.height = 500;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    score = document.getElementById("score");
    gameOverSpan = document.getElementById('gameOver');
    progressBar = document.getElementById('progressBar');
    bestScore = document.getElementById("bestScore");
    playAgainBtn = document.getElementById('playAgain');
    progressBarYellow = document.getElementById('progressYellow');
    startBtn = document.getElementById('start');
    startBtn.addEventListener('click',start);
    playAgainBtn.addEventListener('click',playAgain);


  document.addEventListener('keydown', keydown);

}
function start(e)
{
    socket.emit('start');   
    startBtn.style.display ="none";
    
}
function playAgain(e){
    
    socket.emit('replay');
    playAgainBtn.style.display = "none";
    gameOverSpan.style.display = "none";
}
function keydown(e){
    console.log("keydown");
    socket.emit('keydown',e.keyCode);
}

function paintPlayer(state,size, color){
    const snake = state.player.snake;
    score.innerHTML ="Score : " +  state.score;
    bestScore.innerHTML ="Best Score : " +  state.bestScore;
    //console.log(snake); 
    ctx.fillStyle = color;
     
    for (let cell of snake){
        ctx.fillRect(cell.x*size, cell.y*size,size,size);
       //console.log(cell); 
    }

}
function paintGame(state){
    ctx.fillStyle=BG_COLOR;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    const food = state.food;
    const bigFood = state.bigFood;
    const gridSize = state.gridSize;
    const size = canvas.width/gridSize;
    ctx.fillStyle=FOOD_COLOR;
    if (state.bigFood.isAvailable){
        ctx.fillRect(state.bigFood.x*size,state.bigFood.y*size,size*2,size*2) ;
    }
    ctx.fillRect(food.x*size,food.y*size,size,size) ;
    paintPlayer(state,size,SNAKE_COLOR);
}
init();
paintGame(gameState);