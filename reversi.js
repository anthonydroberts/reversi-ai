var board = [[0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0]];

var gameMode = 0; //0 for player vs player, 2 for player vs ai, 3 for ai vs ai
var whitePlayerType = 0;
var blackPlayerType = 0;
var turn = 1; //indicates player turn, 1 or 2
var validMoves = [];
var whiteCount = 0;
var blackCount = 0;
var gameOver = 0;
var globalWait = 0; //set to 1 when user has to wait to click
var loop = 0; //resets game with same params on gameEnd
var aiRecentx = -1; var aiRecenty = -1;
var whiteWinsCount = 0; var blackWinsCount = 0;

function drawBoard(){
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[i].length; j++){
      if(JSON.stringify(validMoves).includes([i,j]) && gameOver == 0){
        if(turn == 1){
          let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'white');
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '0.3');
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('box-shadow', '0 0 0px 0px #0ff');
        }
        else{
          let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'black');
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '0.4');
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('box-shadow', '0 0 0px 0px #0ff');
        }
      }
      else if(aiRecentx == j && aiRecenty == i){
        let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('box-shadow', '0 0 5px 5px #0ff');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '1.0');
        if(board[i][j] == 1){
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'white');
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '1.0');
        }
        else if(board[i][j] == 2){
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'black');
          cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '1.0');
        }
      }
			else if(board[i][j] == 0){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'transparent');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '1.0');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('box-shadow', '0 0 0px 0px #0ff');
			}
			else if(board[i][j] == 1){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'white');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '1.0');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('box-shadow', '0 0 0px 0px #0ff');
			}
			else if(board[i][j] == 2){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'black');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('opacity', '1.0');
        cell = $("tr:eq(" + i + ")").find('td').eq(j).css('box-shadow', '0 0 0px 0px #0ff');
			}
		}
	}
}

//get a list of valid moves (coordinates of move) for that player
function getValidMoves(player){
  validMoves = [];
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }
  //for every tile, check all directions to the end of the board and search for another
  //same color piece

  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[0].length; j++){
      if(board[i][j] == 0){
          try {
            if (board[i+1][j] == opponent){
              if (checkValid(j, i, 0, 1, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i-1][j] == opponent){
              if (checkValid(j, i, 0, -1, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i][j+1] == opponent){
              if (checkValid(j, i, 1, 0, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i][j-1] == opponent){
              if (checkValid(j, i, -1, 0, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i+1][j-1] == opponent){
              if (checkValid(j, i, -1, 1, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i-1][j+1] == opponent){
              if (checkValid(j, i, 1, -1, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i+1][j+1] == opponent){
              if (checkValid(j, i, 1, 1, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (board[i-1][j-1] == opponent){
              if (checkValid(j, i, -1, -1, player)){validMoves.push([i,j]);}
            }
          }
          catch(e){}
        }

      }
    }
  }


//takes in positions and directions,and player, then returns 1 if move is valid 0 else
function checkValid(x, y, xDir, yDir, player){
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }

  let i = 2;
  while(i < 8){
    if(board[y+(yDir*i)][x+(xDir*i)] == 0){
      return 0;
    }
    else if (board[y+(yDir*i)][x+(xDir*i)] == player){
      return 1;
    }
    else if (board[y+(yDir*i)][x+(xDir*i)] == opponent){
      i++;
      continue;
    }
    else{
      return 0;
    }
  }
  return 0;
}

//takes in positions and directions, and flips the line in that direction, assumes valid
function flipLine(x, y, xDir, yDir, player){
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }

  board[y][x] = player;
  let i = 1;
  while(1){
    if(board[y+(yDir*i)][x+(xDir*i)] == player){
      //when we reach our end tile we are done
      return 0;
    }
    else if (board[y+(yDir*i)][x+(xDir*i)] == opponent){
      //convert opponent tiles to ours
      board[y+(yDir*i)][x+(xDir*i)] = player;
      i++;
      continue;
    }
  }
}

//takes newly placed tile and flips neighbours accordingly, comes after getValidMoves
function placeTile(j, i, player){
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }

  try {
    if (board[i+1][j] == opponent){
      if (checkValid(j, i, 0, 1, player)){flipLine(j, i, 0, 1, player);}
    }
  }
  catch(e){}
  try {
    if (board[i-1][j] == opponent){
      if (checkValid(j, i, 0, -1, player)){flipLine(j, i, 0, -1, player);}
    }
  }
  catch(e){}
  try {
    if (board[i][j+1] == opponent){
      if (checkValid(j, i, 1, 0, player)){flipLine(j, i, 1, 0, player);}
    }
  }
  catch(e){}
  try {
    if (board[i][j-1] == opponent){
      if (checkValid(j, i, -1, 0, player)){flipLine(j, i, -1, 0, player);}
    }
  }
  catch(e){}
  try {
    if (board[i+1][j-1] == opponent){
      if (checkValid(j, i, -1, 1, player)){flipLine(j, i, -1, 1, player);}
    }
  }
  catch(e){}
  try {
    if (board[i-1][j+1] == opponent){
      if (checkValid(j, i, 1, -1, player)){flipLine(j, i, 1, -1, player);}
    }
  }
  catch(e){}
  try {
    if (board[i+1][j+1] == opponent){
      if (checkValid(j, i, 1, 1, player)){flipLine(j, i, 1, 1, player);}
    }
  }
  catch(e){}
  try {
    if (board[i-1][j-1] == opponent){
      if (checkValid(j, i, -1, -1, player)){flipLine(j, i, -1, -1, player);}
    }
  }
  catch(e){}
}

function updateInfo(){
  if (gameOver != 1){
    if(turn == 1){
      document.getElementById("turn").innerHTML = "White's Turn";
      document.getElementById("turn").style.color = "White";
    }
    else{
      document.getElementById("turn").innerHTML = "Black's Turn";
      document.getElementById("turn").style.color = "Black";
    }
  }

  document.getElementById("numTiles").innerHTML = "White Tiles: " + whiteCount +
  " Black Tiles: " + blackCount;

}

//check the game end and alert accordingly
function checkGameEnd(){
    whiteCount = 0;
    blackCount = 0;
    for(let i = 0; i < board.length; i++){
      for(let j = 0; j < board[0].length; j++){
        if(board[i][j] == 1){
          whiteCount++;
        }
        else if(board[i][j] == 2){
          blackCount++;
        }
      }
    }

    if(validMoves == 0){
      gameOver = 1;
      //game over
      console.log("White tiles = " + whiteCount);
      console.log("Black tiles = " + blackCount);
      if(whiteCount == blackCount){
        document.getElementById("turn").innerHTML = "Draw";
        document.getElementById("turn").style.color = "Grey";
      }
      else if (whiteCount > blackCount){
        document.getElementById("turn").innerHTML = "White Wins!";
        document.getElementById("turn").style.color = "White";
        whiteWinsCount++;
      }
      else if (whiteCount < blackCount){
        document.getElementById("turn").innerHTML = "Black Wins!";
        document.getElementById("turn").style.color = "Black";
        blackWinsCount++;
      }
      else{
        alert("ERROR")
      }

      document.getElementById("numWins").innerHTML = "White Wins: " + whiteWinsCount +
      " Black Wins: " + blackWinsCount;
      if(loop == 1){
        init();
      }
    }
}

$('#board td').click(boardClick);
function boardClick(){
  if(globalWait == 1){
    console.log("Making ai move, click will not do anything");
    return;
  }

  if(gameOver == 1){
    console.log("Gameover, can't click board");
    return;
  }

  let y = $('#board tr').index($(this).closest('tr'));
  let x = $(this).closest('tr').find('td').index($(this).closest('td'));

  //check if they are attempting a valid move
  if(!(JSON.stringify(validMoves).includes([y,x]))){
    console.log("attempted an invalid move");
    return;
  }

  if(whitePlayerType == 0 && blackPlayerType == 0){
    //player vs player
    if(turn == 1){
      placeTile(x, y, turn);
      turn = 2;
    }
    else if(turn == 2){
      placeTile(x, y, turn);
      turn = 1;
    }
    getValidMoves(turn);
    checkGameEnd();
    drawBoard();
    updateInfo();
  }
  else if(whitePlayerType == 0 && blackPlayerType != 0){
    //player vs ai
    if(turn == 1){
      placeTile(x, y, turn);
      turn = 2;
    }
    aiRecentx = -1;
    aiRecenty = -1;
    getValidMoves(turn);
    checkGameEnd();
    drawBoard();
    updateInfo();
    globalWait = 1;
    setTimeout(function(){
      makeAiMove(turn, blackPlayerType);
      turn = 1;

      getValidMoves(turn);
      checkGameEnd();
      drawBoard();
      updateInfo();
      globalWait = 0;
    }, 1000)
  }

  else if(whitePlayerType != 0 && blackPlayerType == 0){
    //ai vs player
    if(turn == 2){
      placeTile(x, y, turn);
      turn = 1;
    }
    aiRecentx = -1;
    aiRecenty = -1;
    getValidMoves(turn);
    checkGameEnd();
    drawBoard();
    updateInfo();
    globalWait = 1;
    setTimeout(function(){
      makeAiMove(turn, whitePlayerType);
      turn = 2;

      getValidMoves(turn);
      checkGameEnd();
      drawBoard();
      updateInfo();
      globalWait = 0;
    }, 1000)
  }

  else if(whitePlayerType != 0 && blackPlayerType != 0){
    //ai vs ai, click should not handle this, do this in init or something

  }

}

//runs when game is set to any ai vs any ai
function aiGame(){

  play();

  function play(){
    //ai vs ai
    var whiteFinishFlag = 0;
    var blackFinishFlag = 0;
    aiRecentx = -1;
    aiRecenty = -1;
    globalWait = 1;
    if(turn == 1){
      setTimeout(function(){
        makeAiMove(turn, whitePlayerType);
        turn = 2;

        getValidMoves(turn);
        checkGameEnd();
        drawBoard();
        updateInfo();
        whiteFinishFlag = 1;
        globalWait = 0;

        aiRecentx = -1;
        aiRecenty = -1;
        globalWait = 1;
        if(turn == 2){
          setTimeout(function(){
            makeAiMove(turn, blackPlayerType);
            turn = 1;

            getValidMoves(turn);
            checkGameEnd();
            drawBoard();
            updateInfo();
            blackFinishFlag = 1;
            globalWait = 0;
            if(whiteFinishFlag == 1 && blackFinishFlag == 1 && gameOver != 1){
              play();
            }
          }, 500)
        }
      }, 500)
    }
  }
}

function init(){
  board = [[0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0],
               [0,0,0,1,2,0,0,0],
               [0,0,0,2,1,0,0,0],
               [0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0]];

   aiRecentx = -1;
   aiRecenty = -1;
   gameOver = 0;
   turn = 1;
   if(whitePlayerType != 0 && blackPlayerType == 0){
     globalWait = 1;
     setTimeout(function(){
       makeAiMove(turn, whitePlayerType);
       turn = 2;

       getValidMoves(turn);
       checkGameEnd();
       drawBoard();
       updateInfo();
       globalWait = 0;
     }, 1000)
     return;
   }

   if(whitePlayerType != 0 && blackPlayerType != 0){
     //ai vs ai
     getValidMoves(turn);
     checkGameEnd();
     drawBoard();
     updateInfo();
     aiGame();
     return;
   }

   getValidMoves(turn);
   checkGameEnd();
   drawBoard();
   updateInfo();
}

$('#initGame').click(function(){
  whitePlayerType = document.getElementById("SelectWhite").value;
  blackPlayerType = document.getElementById("SelectBlack").value;
  if(document.getElementById("loopBox").checked == true){loop = 1;}
  else{loop = 0;}
  document.getElementById("initGame").innerHTML = "Restart";
  init();
});

drawBoard();


//AI STUFF STARTS HERE
//this function will do everything for the ai's move
//it will place the tile and everything, etc
//takes in the player type that it is calculating for, and the type of move
//it should calcuate(E.G. 1 corresponds to dumb ai, 2 to something else, etc)
function makeAiMove(player, aiType){
  //coords that the ai has chosen
  var xChoice = -1;
  var yChoice = -1;
  if(gameOver == 1){
    return;
  }

  if(aiType == 1){
    //random ai type
    //we will just randomly choose a move from the list of valid moves
    getValidMoves(player);
    let moveChoice = Math.floor((Math.random() * validMoves.length) + 0);
    xChoice = validMoves[moveChoice][1];
    yChoice = validMoves[moveChoice][0];
  }

  if(aiType == 2){
    //minimax with AB pruning
  }

  aiRecentx = xChoice;
  aiRecenty = yChoice;
  placeTile(xChoice, yChoice, player);
  return;
}

//SCORING SYSTEMS START HERE
//TAKE IN A BOARD AND RETURN A SCORE OF EACH
