var AIMove = new XMLHttpRequest();

var boardSizeClicked = 0;



function checkOnePlyrBoard() {
    if (boardSizeClicked == 0) {
        alert("Please choose a board size.");
    }else if(boardSizeClicked == 1) {
        window.location.href="login/login.html";
    }
}

//working on this for board size from dropdown
function setBoard(size) {
    state.size = size;
    sendBoard();
}


//on mouse over for clicking
function changeColor(x){
	x.setAttribute("fill-opacity", "1");
}

function changeColorBack(x){
	x.setAttribute("fill-opacity", "0");
}

function makeMove(x){
	x.setAttribute("fill", "black");
	x.setAttribute("fill-opacity", "1");
	x.setAttribute("onmouseover","");//to nothing
	x.setAttribute("onmouseout","");

   //decrypt coordinate of placed token
    var numOfPix = ((500)/(state.size-1));
    var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 0.8);
    var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 0.8);
    console.log(xCoord);
    console.log(yCoord);

    //update board state
    state.board[xCoord][yCoord] = 2;
    console.log(state.board);
    state.last.x = xCoord;
    state.last.y = yCoord;
    console.log(state.last);

    //send updated state to server
    sendBoard();

    //call AI
    AIMove.open("GET", "/move", true);
    AIMove.send();

}

//Upon AI request return
AIMove.onreadystatechange = function() {
        if(AIMove.readyState == 4 && AIMove.status == 200) {
            //update board
            var move = JSON.parse(AIMove.responseText);
            state.board[move["x"]][move["y"]] = move["c"];
            sendBoard();

            drawBoard(state);
        }
}




