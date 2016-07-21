var AIMove = new XMLHttpRequest();


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

function displayWins(){
    var userData = new XMLHttpRequest();
    userData.open("GET", "/userName", true);
    userData.send();

    userData.onreadystatechange = function() {
        if(userData.readyState == 4 && userData.status == 200) {
            var temp = JSON.parse(userData.responseText);
            var win = temp["wins"];
            document.getElementById("wins").innerHTML = "Wins: " + win;
        }
    }
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
    if (state.size == 19){
    	var numOfPix = ((500)/(state.size-1));//27.777777
    	var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 1.8);
    	var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 1.8);
    }else{
    	var numOfPix = ((500)/(state.size-1));//41.6666666
    	var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 0.8);
    	var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 0.8);
    }
    //console.log(xCoord);
    //console.log(yCoord);

    //check for illegal move on players part
    if(check_illegal_move(xCoord, yCoord, 2) == 0){
            alert("Illegal move on board!");
     }
//     //check if trying to place token in captured territory
    // else if(checkTerr(xCoord, yCoord, 1) == false){
    //         alert("Illegal move on board!");
    // }
//     //if the move is valid
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

        //update board state
        state.last.x = xCoord;
        state.last.y = yCoord;
        console.log(state.last);

		capture(x);

		//send updated state to server
		sendBoard();

		//if army surrounded
		for(var i = 0; i < state.keyLiberties.length; i++){
			 if(state.keyLiberties[i].place[0] == xCoord && state.keyLiberties[i].place[1] == yCoord && state.keyLiberties[i].colour == 1){

					//remove tokens, subtract captures from whites score, remove keyLiberty from keyLiberties
					removeTokens(state.keyLiberties[i].army, 1);
					state.white -= state.keyLiberties[i].size
					state.keyLiberties.splice(i,1);
					//alert("AI's army has been captured!");
			}
		}

		//call get army
		getArmy.open("GET", "/army", true);
		getArmy.send();

		//call AI
		AIMove.open("GET", "/move", true);
		AIMove.send();
		capture(x);

		//call get army
		getArmy.open("GET", "/army", true);
		getArmy.send();
    }

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
            if (move == 400){
            	// alert("Invalid respones from server, something is broken");
                AIMove.open("GET","/move", true);
                AIMove.send();
            }else if (!move["pass"]){//if AI did not pass
                 //check if legal move
                 if(check_illegal_move(move["x"], move["y"], 1) == 0){
                        //alert("Illegal move!");
                        //call AI
                        AIMove.open("GET", "/move", true);
                        AIMove.send();
                 }
                 //check if trying to place token in captured territory
                 // else if(checkTerr(move["x"], move["y"], 2) == false){
                 //         //alert("Illegal move!");
                 //        //call AI
                 //        AIMove.open("GET", "/move", true);
                 //        AIMove.send();

                 // }
                 //if the move is valid
                 else {
                     state.board[move["x"]][move["y"]] = move["c"];
    			     state.last.x = move["x"];
    			     state.last.y = move["y"];
    			     state.last.pass = false;

                     //if army surrounded
                    for(var i = 0; i < state.keyLiberties.length; i++){
                        if(state.keyLiberties[i].place[0] == move["x"] && state.keyLiberties[i].place[1] == move["y"] && state.keyLiberties[i].colour == 2){

                            //remove tokens, subtract captures from blacks score, remove keyLiberty from keyLiberties
                            removeTokens(state.keyLiberties[i].army, 2);
                            state.black -= state.keyLiberties[i].size
                            state.keyLiberties.splice(i,1);
                            //alert("Your army has been captured!");
                        }
                    }
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


function gameOver(){

    //count number of territories here and add to score for each here
    var terr = checkTerritory();
    state.white += terr[0];
    state.black += terr[1];

    //tells player who wins then goes back home
    if(state.black > state.white) {
        alert("You Won! You now have ? wins! \nYour Score: " + state.black + " \n AI's Score: " + state.white);
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
    if(state.white > state.black) {
        alert("AI Won...\nYour Score: " + state.black + " \nAI's Score: " + state.white)
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
    if(state.white == state.black) {
        alert("Tie!\nYour Score: " + state.black + " \nAI's Score: " + state.white)
        setTimeout(function(){window.location.href="../index.html"}, 0);
    }
}
