var AIMove = new XMLHttpRequest();
var getArmy = new XMLHttpRequest();

var boardSizeClicked = 0;
var themeClicked = 0;



function checkOnePlyrBoard() {
    if (boardSizeClicked == 0) {
        alert("Please choose a board size.");
    }
    if (themeClicked == 0) {
        alert("Please choose a theme.");  
    }else if(boardSizeClicked == 1) {
        window.location.href="login/login.html";
    }
}

//working on this for board size from dropdown
function setBoard(size) {
    boardSizeClicked = 1;
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
   //decrypt coordinate of placed token
    var numOfPix = ((500)/(state.size-1));
    var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 0.8);
    var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 0.8);
    //console.log(xCoord);
    //console.log(yCoord);

    //check for illegal move on players part
    if(check_illegal_move(xCoord, yCoord, 2) == 0){
            alert("Illegal move!");
    }else{  
        console.log("what is x: ",x) 
        x.setAttribute("fill", "black");
        //update board
        state.board[xCoord][yCoord] = 2;
        checkMove = 1;
        x.removeAttribute("fill-opacity");
        x.removeAttribute("onmouseover");
        x.removeAttribute("onmouseout");
        x.removeAttribute("onclick");
    }

    //update board state
    state.board[xCoord][yCoord] = 2;
    console.log(state.board);
    state.last.x = xCoord;
    state.last.y = yCoord;
    console.log(state.last);

    //send updated state to server
    capture(x);
    sendBoard();

    //call get army
    getArmy.open("GET", "/army", true);
    getArmy.send();
   
    //call AI
    AIMove.open("GET", "/move", true);
    AIMove.send();

}


//pass
function getMove(){
	if (state.last.pass == true){//two passes in a row = game over
		gameOver();
	}else{
		state.last.pass = true;
	}
	state.last.x = 0;
    state.last.y = 0;
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
            //update last
            if (!move["pass"]){//if AI did not pass
                 
                 if(check_illegal_move(move["x"], move["y"], 1) == 0){
                        //alert("Illegal move!");
                        //call AI
                        AIMove.open("GET", "/move", true);
                        AIMove.send();

                 } else {
                     state.board[move["x"]][move["y"]] = move["c"];
    			     state.last.x = move["x"];
    			     state.last.y = move["y"];
    			     state.last.pass = false;
                 }

    		}else{//if AI did pass
    			console.log("AI did pass");
    			if (state.last.pass == true){//two passes in a row = gameOver
    				gameOver();
    			}
    			state.last.x = 0;
    			state.last.y = 0;
				state.last.pass = true;
			}
            sendBoard();

            drawBoard(state);


        }
}

//Upon AI request return
getArmy.onreadystatechange = function() {
        if(getArmy.readyState == 4 && getArmy.status == 200) {
            var temp = JSON.parse(getArmy.responseText);
            army = temp["armies"];

            console.log("number of armies: " + army.length);

            //for each army, check its liberties
            for(var i = 0; i < army.length; i ++){
                //if an army has no liberties, delete it 
                /*NOTE : this should be set to zero for proper functionality
                but it crashes the server because an army with no liberties cannot be sent to the AI */
                if (army[i].liberties.length === 1){
                    //give black points for capturing territory
                    if(army[i].colour == 2)
                        state.white += army[i].size;

                    //give white points for capturing territory
                    if(army[i].colour == 1)
                        state.black += army[i].size;
                    
                    removeTokens(army[i].tokens);
                    //console.log("number of liberties: " + army[i].liberties.length)

                }
            }
        }     
}

//deletes liberties
function removeTokens(tokens){
    for(var i = 0; i < tokens.length; i ++){
        var x = tokens[i].position[1];
        var y = tokens[i].position[0];
        console.log("remove x: " + y);
        console.log("remove y: " + x);
        
        state.board[y][x] = 0;
        
        console.log(state.board);
        
    }
    sendBoard();
    drawBoard(state);
}





function gameOver(){
    
    //tells player who wins then goes back home
    if(state.black > state.white) {
        alert("You Won! You now have ? wins!");
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
    else {
        alert("AI Won...")
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
}




