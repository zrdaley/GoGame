var checkMove = 2;// starts with black
var boardSizeClicked = 0; // board size hasn't been chosen


function checkTwoPlyrBoard() {
    if (boardSizeClicked == 0) {
        alert("Please choose a board size.");
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
    var numOfPix = ((500)/(state.size-1));
    var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 0.8);
    var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 0.8);
    console.log(xCoord);
    console.log(yCoord);

    //update last
    state.last.x = xCoord;
    state.last.y = yCoord;
	state.last.pass = false;

    //checks who goes
	if (checkMove == 2){
		x.setAttribute("fill", "black");
        //update board
        state.board[xCoord][yCoord] = 2;
		checkMove = 1;
	}else{
		x.setAttribute("fill", "white");
		x.setAttribute("stroke", "black");
    	x.setAttribute("stroke-width", 1);
        //update board
        state.board[xCoord][yCoord] = 1;
		checkMove = 2;
	}
	x.removeAttribute("fill-opacity");
	x.removeAttribute("onmouseover");
	x.removeAttribute("onmouseout");
	x.removeAttribute("onclick");

    console.log(state.board);

    //send updated state to server
    sendBoard();

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

function gameOver(){
	//need to count points and display them somewhere

	var canvas = $("#canvas");
    canvas[0].childNodes[0].childNodes[0].style.fill =("red");
}

