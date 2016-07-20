var checkMove = 2;// starts with black
var boardSizeClicked = 0; // board size hasn't been chosen
var moveUndone = false;
var themeClicked = 0;


function checkTwoPlyrBoard() {
    if (boardSizeClicked == 0) {
        alert("Please choose a board size.");
    }
    if (themeClicked == 0) {
        alert("Please choose a theme.");  
    }else if(boardSizeClicked == 1) {
        window.location.href="twoplayer/twoplayer.html";
    }
}

//working on this for board size from dropdown
function setBoard(size) {
    boardSizeClicked = 1;
    state.size = size;

    //send board state to the server
    sendBoard();
}


//on mouse over for clicking
function changeColor(x){
	//checks who goes
	if (checkMove == 2){
		x.setAttribute("fill", "black");
	}else{
		x.setAttribute("fill", "white");
		x.setAttribute("stroke", "black");
    	x.setAttribute("stroke-width", 1);
	}
	x.setAttribute("fill-opacity", "1");
}

function changeColorBack(x){
	x.removeAttribute("stroke");
	x.setAttribute("fill-opacity", "0");
}


//on mouse click
function makeMove(x){

    //decrypt coordinate of placed token
    if (state.size == 19){
    	var numOfPix = ((500)/(state.size-1));//27.777777
    	var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 1.8);
    	var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 1.8);
    	console.log(xCoord);
    	console.log(yCoord);
    }else{
    	var numOfPix = ((500)/(state.size-1));//41.6666666
    	var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 0.8);
    	var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 0.8);
    	console.log(xCoord);
    	console.log(yCoord);
    }
	
    //if move is black
	if (checkMove == 2){
        //legal checks
        if(check_illegal_move(xCoord, yCoord, checkMove) == 0){
            alert("Illegal move!");
        }
        else if(checkTerr(xCoord, yCoord, 1) == false){
            alert("Illegal move!");
        }
        //if the move is valid
        else{ 
            console.log("what is x: ",x) 
            x.setAttribute("fill", "black");
            
            //update board
            state.board[xCoord][yCoord] = 2;
            checkMove = 1;
            x.removeAttribute("fill-opacity");
            x.removeAttribute("onmouseover");
            x.removeAttribute("onmouseout");
            x.removeAttribute("onclick");

            //update last
            state.last.x = xCoord;
            state.last.y = yCoord;
            state.last.pass = false;

            //if army surrounded
             for(var i = 0; i < state.keyLiberties.length; i++){
                    if(state.keyLiberties[i].place[0] == xCoord && state.keyLiberties[i].place[1] == yCoord && state.keyLiberties[i].colour == 1){

                        //remove tokens, give team points, remove keyLiberty from keyLiberties
                        removeTokens(state.keyLiberties[i].army, 2);
                        state.white -= state.keyLiberties[i].size
                        state.keyLiberties.splice(i,1);
                        //alert("AI's army has been captured!");
                    }
            }
        }
    //if move is white
	}else{
        //legal checks
        if(check_illegal_move(xCoord, yCoord, checkMove) == 0){
            alert("Illegal move!");
        }
        else if(checkTerr(xCoord, yCoord, 2) == false){
            alert("Illegal move!");
        }
        //if the move is valid
        else{
            x.setAttribute("fill", "white");
            x.setAttribute("stroke", "black");
            x.setAttribute("stroke-width", 1);
            
            //update board
            state.board[xCoord][yCoord] = 1;
            checkMove = 2;
            x.removeAttribute("fill-opacity");
            x.removeAttribute("onmouseover");
            x.removeAttribute("onmouseout");
            x.removeAttribute("onclick");

            //update last
            state.last.x = xCoord;
            state.last.y = yCoord;
            state.last.pass = false;

            //if army surrounded
            for(var i = 0; i < state.keyLiberties.length; i++){
                 if(state.keyLiberties[i].place[0] == xCoord && state.keyLiberties[i].place[1] == yCoord && state.keyLiberties[i].colour == 2){

                    //remove tokens, give team points, remove keyLiberty from keyLiberties
                    removeTokens(state.keyLiberties[i].army, 1);
                    state.black -= state.keyLiberties[i].size
                    state.keyLiberties.splice(i,1);
                    //alert("AI's army has been captured!");
                }
            }
        }
	}
    sendBoard();
    console.log(state.board);

    //call get army
    getArmy.open("GET", "/army", true);
    getArmy.send(); 

    //send updated state to server
    drawBoard(state);

}

//pass
function getMove(){
	if (state.last.pass == true){//two passes in a row = game over
		gameOver();
	}else{
		state.last.pass = true;
	}
	if (checkMove == 1){
		checkMove = 2;//changes the turn
	}else{
		checkMove = 1;//changes turn
	}
    //send updated state to server
    sendBoard();
}

function undoMove(){
	//remove last move from board
	if(!moveUndone){
		state.board[state.last.x][state.last.y] = 0;
		moveUndone = true;

		//sets token to previous colour
		if(checkMove == 1)
			checkMove = 2;
		else
			checkMove = 1;

		//send and draw
		sendBoard();
		drawBoard(state);
	}
	else
		alert("Can't undo move after next player has already begun turn")
}

function gameOver(){

    //count number of territories here and add to score for each here
    var terr = checkTerritory();
    state.white += terr[0];
    state.black += terr[1];

    //tells player who wins then goes back home
    if(state.black > state.white) {
        alert("Black Won!\nBlack's Score: " + state.black + " \nWhite's Score: " + state.white);
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
    if(state.white > state.black) {
        alert("Black Won!\nBlack's Score: " + state.black + " \nWhite's Score: " + state.white);
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
    if (state.white == state.black) {
        alert("Tie!\nBlack's Score: " + state.black + " \nWhite's Score: " + state.white);
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
}


