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
var aiDelay = 100; //ai vs ai delay in ms
var whiteDepth = 2; var blackDepth = 2;
var scoringIterations = 0;

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

      if(whiteWinsCount + blackWinsCount == 40){
        console.log("SCORE: White " + whiteWinsCount + " Black " + blackWinsCount);
      }
      return 1;
    }
    return 0;
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
      makeAiMove(turn, blackPlayerType, blackDepth);
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
      makeAiMove(turn, whitePlayerType, whiteDepth);
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
        makeAiMove(turn, whitePlayerType, whiteDepth);
        turn = 2;

        getValidMoves(turn);
        if(checkGameEnd() == 1){
          drawBoard();
          updateInfo();
          return;
        }
        drawBoard();
        updateInfo();
        whiteFinishFlag = 1;
        globalWait = 0;

        aiRecentx = -1;
        aiRecenty = -1;
        globalWait = 1;
        if(turn == 2){
          setTimeout(function(){
            makeAiMove(turn, blackPlayerType, blackDepth);
            turn = 1;

            getValidMoves(turn);
            if(checkGameEnd() == 1){
              drawBoard();
              updateInfo();
              return;
            }
            drawBoard();
            updateInfo();
            blackFinishFlag = 1;
            globalWait = 0;
            if(whiteFinishFlag == 1 && blackFinishFlag == 1 && gameOver != 1){
              play();
            }
          }, aiDelay)
        }
      }, aiDelay)
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
   globalWait = 0;
   if(whitePlayerType != 0 && blackPlayerType == 0){
     globalWait = 1;
     setTimeout(function(){
       makeAiMove(turn, whitePlayerType, whiteDepth);
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
  whiteDepth = document.getElementById("SelectWhiteDepth").value;
  blackDepth = document.getElementById("SelectBlackDepth").value;
  aiDelay = document.getElementById("SelectDelay").value;
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
function makeAiMove(player, aiType, depth){
  //coords that the ai has chosen
  var xChoice = -1;
  var yChoice = -1;
  var nodesSearched = 0;
  var opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }

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

    aiRecentx = xChoice;
    aiRecenty = yChoice;
    placeTile(xChoice, yChoice, player);
  }

  if(aiType >= 2){
        //minimax with AB pruning
        //node object, declare ex: let newNode = new Node(params);
    var depthLimit = depth;

    board = MINIMAXDECISION();
    return;
    function Node(state, score, depth, par) {
    	this.state = state;
    	this.score = score;
    	this.depth = depth;
    	this.parent = par;
    	this.children = [];
    }

    // minimax algorithm, takes current board (game)
    function MINIMAXDECISION(){
    	let b = JSON.parse(JSON.stringify(board));
    	let root = new Node (b, 0, 0, null);

    	let v = MAXVALUE(root, -Infinity, Infinity);
    	for(let i = 0; i < root.children.length; i++){
    		if(root.children[i].score == v){
          for(let k = 0; k < validMoves.length; k++){
            if(root.children[i].state[validMoves[k][0]][validMoves[k][1]] == player){
              aiRecentx = validMoves[k][1];
              aiRecenty = validMoves[k][0];
            }
          }
          console.log("Nodes Searched for move: " + nodesSearched);
          console.log("Iterations for move: " + scoringIterations);
          scoringIterations = 0;
    			return root.children[i].state; //returns move board
    		}
    	}
    	return null;
    }

    //maximum function for minmax
    function MAXVALUE(node, alpha, beta){
    	let b = JSON.parse(JSON.stringify(node.state));
    	let v = -Infinity;

    	if (node.depth >= depthLimit){
    		return scoreBoard(node.state, player, aiType);
    	}
      let statePossibleMoves = simulateValidMoves(b, player);
    	for(let c = 0; c < statePossibleMoves.length; c++){
          nodesSearched++;
    			let newState = simulateBoard(b,statePossibleMoves[c][0],statePossibleMoves[c][1],player);
    			let newScore = 0;
    			let newNode = new Node(newState, newScore, node.depth + 1, node);
    			node.children.push(newNode);

    			newNode.score = MINVALUE(newNode, alpha, beta);

    			v = Math.max(v, newNode.score);
    			if(v >= beta){
    				return v;
    			}
    			alpha = Math.max(alpha,v);


    	}

    	return v;
    }


    function MINVALUE(node, alpha, beta){
    	let b = JSON.parse(JSON.stringify(node.state));
    	let v = Infinity;

    	if (node.depth >= depthLimit){
    		return scoreBoard(node.state, opponent, aiType);
    	}

      let statePossibleMoves = simulateValidMoves(b, opponent);
    	for(let c = 0; c < statePossibleMoves.length; c++){
          nodesSearched++;
    			let newState = simulateBoard(b,statePossibleMoves[c][0],statePossibleMoves[c][1],opponent);
    			let newScore = 0;
    			let newNode = new Node(newState, newScore, node.depth + 1, node);
    			node.children.push(newNode);
    			newNode.score = MAXVALUE(newNode, alpha, beta);
    			v = Math.min(v, newNode.score);

    			if(v <= alpha){
    				return v;
    			}
    			beta = Math.min(beta,v);

    	}

    	return v;
    }

  }

  return;
}

//state simulation, takes a valid move and board, returns a possible board after playing that valid move
function simulateBoard(bIn,i,j,player){
  let b = JSON.parse(JSON.stringify(bIn));
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }
  try {
    if (b[i+1][j] == opponent){
      if (simulateCheckValid(j, i, 0, 1, player, b)){simulateFlipLine(j, i, 0, 1, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i-1][j] == opponent){
      if (simulateCheckValid(j, i, 0, -1, player, b)){simulateFlipLine(j, i, 0, -1, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i][j+1] == opponent){
      if (simulateCheckValid(j, i, 1, 0, player, b)){simulateFlipLine(j, i, 1, 0, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i][j-1] == opponent){
      if (simulateCheckValid(j, i, -1, 0, player, b)){simulateFlipLine(j, i, -1, 0, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i+1][j-1] == opponent){
      if (simulateCheckValid(j, i, -1, 1, player, b)){simulateFlipLine(j, i, -1, 1, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i-1][j+1] == opponent){
      if (simulateCheckValid(j, i, 1, -1, player, b)){simulateFlipLine(j, i, 1, -1, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i+1][j+1] == opponent){
      if (simulateCheckValid(j, i, 1, 1, player, b)){simulateFlipLine(j, i, 1, 1, player, b);}
    }
  }
  catch(e){}
  try {
    if (b[i-1][j-1] == opponent){
      if (simulateCheckValid(j, i, -1, -1, player, b)){simulateFlipLine(j, i, -1, -1, player, b);}
    }
  }
  catch(e){}
  return b;
}

function simulateFlipLine(x, y, xDir, yDir, player, b){
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }
  b[y][x] = player;
  let i = 1;
  while(1){
    if(b[y+(yDir*i)][x+(xDir*i)] == player){
      //when we reach our end tile we are done
      return 0;
    }
    else if (b[y+(yDir*i)][x+(xDir*i)] == opponent){
      //convert opponent tiles to ours
      b[y+(yDir*i)][x+(xDir*i)] = player;
      i++;
      continue;
    }
  }
}

//returns list of valid moves for given board and given player
function simulateValidMoves(bIn,p){
  let b = JSON.parse(JSON.stringify(bIn));
  var retValidMoves = [];
  let opponent = 0;
  if(p == 1){ opponent = 2; }
  else{ opponent = 1; }
  //for every tile, check all directions to the end of the board and search for another
  //same color piece

  for(let i = 0; i < b.length; i++){
    for(let j = 0; j < b[0].length; j++){
      scoringIterations++;
      if(b[i][j] == 0){
          try {
            if (b[i+1][j] == opponent){
              if (simulateCheckValid(j, i, 0, 1, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i-1][j] == opponent){
              if (simulateCheckValid(j, i, 0, -1, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i][j+1] == opponent){
              if (simulateCheckValid(j, i, 1, 0, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i][j-1] == opponent){
              if (simulateCheckValid(j, i, -1, 0, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i+1][j-1] == opponent){
              if (simulateCheckValid(j, i, -1, 1, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i-1][j+1] == opponent){
              if (simulateCheckValid(j, i, 1, -1, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i+1][j+1] == opponent){
              if (simulateCheckValid(j, i, 1, 1, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
          try {
            if (b[i-1][j-1] == opponent){
              if (simulateCheckValid(j, i, -1, -1, p, b)){retValidMoves.push([i,j]);}
            }
          }
          catch(e){}
        }

      }
    }

    return retValidMoves;
}

function simulateCheckValid(x, y, xDir, yDir, player, bIn){
  let b = JSON.parse(JSON.stringify(bIn));
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }
  let i = 2;
  while(i < 8){
    scoringIterations++;
    if(b[y+(yDir*i)][x+(xDir*i)] == 0){
      return 0;
    }
    else if (b[y+(yDir*i)][x+(xDir*i)] == player){
      return 1;
    }
    else if (b[y+(yDir*i)][x+(xDir*i)] == opponent){
      i++;
      continue;
    }
    else{
      return 0;
    }
  }
  return 0;
}

//SCORING SYSTEMS START HERE
//TAKE IN A BOARD AND RETURN A SCORE OF EACH
function scoreBoard (stateBoard, player, method){
  let opponent = 0;
  if(player == 1){ opponent = 2; }
  else{ opponent = 1; }

  if(method == 2){
    //counting number of player tiles vs opponent tiles
    let score = 0;
    for(let i = 0; i < stateBoard.length; i++){
      for(let j = 0; j < stateBoard[0].length; j++){
        scoringIterations++;
        if(stateBoard[i][j] == player){score++;}
        else if(stateBoard[i][j] == opponent){score--;}
      }
    }
    return score;
  }

  if(method == 3){
    //prioritize corners
    let score = 0;
    for(let i = 0; i < stateBoard.length; i++){
      for(let j = 0; j < stateBoard[0].length; j++){
        scoringIterations++;
        if(i == 0 && j == 0){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(i == 7 && j == 0){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(i == 7 && j == 7){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(i == 0 && j == 7){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(stateBoard[i][j] == player){score++;}
        else if(stateBoard[i][j] == opponent){score--;}
      }
    }
    return score;
  }

  if(method == 4){
    //mobility (number of valid moves for player, vs number of valid moves for opponent)
    var playerValidSet = simulateValidMoves(stateBoard, player);
    var opponentValidSet = simulateValidMoves(stateBoard, opponent);
    var score = 0;

    score = score + playerValidSet.length;
    score = score - opponentValidSet.length;

    return score;
  }

  if(method == 5){
    //mobility (number of valid moves for player, vs number of valid moves for opponent)
    // and corners

    let score = 0;
    for(let i = 0; i < stateBoard.length; i++){
      for(let j = 0; j < stateBoard[0].length; j++){
        if(i == 0 && j == 0){
          scoringIterations++;
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(i == 7 && j == 0){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(i == 7 && j == 7){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(i == 0 && j == 7){
          if(stateBoard[i][j] == player){
            score = score + 100;
          }
          else if(stateBoard[i][j] == opponent){
            score = score - 100;
          }
        }
        else if(stateBoard[i][j] == player){score++;}
        else if(stateBoard[i][j] == opponent){score--;}
      }
    }

    var playerValidSet = simulateValidMoves(stateBoard, player);
    var opponentValidSet = simulateValidMoves(stateBoard, opponent);

    score = score + playerValidSet.length;
    score = score - opponentValidSet.length;

    return score;
  }

}
