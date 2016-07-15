/*BEGIN SHARED BOARD LOGIC HERE */

var postXhr = new XMLHttpRequest();
var xhr = new XMLHttpRequest();
var colorBoard;//base color
var moveUndone = false;
var theme = 0;

var state = {
   "size": 0,
   "board": [],
   "last": {
        "x" : 0,
        "y" : 0,
        "c" : 2,
        "pass" : false,
    },
   "handiCap": false,
   "refresh": false,
   "theme": 0,
   "colour": 0,
}


function setTheme(val){
    themeClicked = 1;
    state.theme = val;
    //console.log(val);
    
    if(state.theme == 1)
        state.colour = "#C44141";
    if(state.theme == 2)
        state.colour = "#4574BF";
    
    sendBoard();
}


function drawBoard(state){

    var canvas = $("#canvas");
    //height and width of the board
    var W = 600, H = 600;
    canvas.css("height", H);
    canvas.css("width", W);

    var svg = $(makeSVG(W, H));
    svg.append(makeRectangle(0, 0, H, W, colorBoard));


    var numOfPix = ((W-100)/(state.size-1));//so that the board has 50 pix of room on each side

    //token size
    var tsize;
    if(state.size == 9)
    tsize = 20;
    else if(state.size == 13)
    tsize = 15;
    else//size is 13
	tsize = 13;


    var x1 = 0;
    var y1 = 0;

    //makes the majority of the board
    for(x = 50; x<(W-50); x += numOfPix){//50 to 550 with a 50 pix boarder

        for(y = 50; y<(W-50);y += numOfPix){

            svg.append(makeLine(x, y, x+numOfPix, y));
            svg.append(makeLine(x, y, x, y+numOfPix));

            svg.append(makeCircle(x, y, tsize, state.board[y1][x1]));//makes a board
            y1++;
        }
        y1 = 0;
        x1++;
    }


	//makes the last x line (bottom line)
	var x1 = 0;
	for(x = 50; x<(W-50); x += numOfPix){//50 to 550 with a 50 pix boarder
    	svg.append(makeLine(x, W-50, x+numOfPix, W-50));

        svg.append(makeCircle(x, W-50, tsize, state.board[state.size-1][x1]));//bottom of the y array
        x1++;
    }

    //makes the last y line (right line)
	var y1 = 0;
	for(y = 50; y<(W-50); y += numOfPix){//50 to 550 with a 50 pix boarder
    	svg.append(makeLine(W-50, y,W-50, y+numOfPix));

        svg.append(makeCircle(W-50,y, tsize, state.board[y1][state.size-1]));//right of the x array
        y1++;
    }

    //makes the last circle at the bottom right
    svg.append(makeCircle(W-50,W-50, tsize, state.board[state.size-1][state.size-1]));


    canvas.empty().append(svg);
}


//sends board state to the server
function sendBoard(){
    postXhr.open("POST", "/board", true);
    postXhr.setRequestHeader("Content-type", "application/json");
    postXhr.responseType = 'text';
    postXhr.send(JSON.stringify(state));
}

function handiCap(element) {
   if(element.checked){
        state.handiCap = true;
   }
   else {
        state.handiCap = false;
   }
    //send board state to the server
    sendBoard();
}


function generateBoard(size){

    var tmp = [];

    // determined locations where HandiCap tokens should be put
    var hcToken = Math.round((state.size)/3);
    var hcTokenSecond;
    if(state.size == 9) {
        hcToken--;
        hcTokenSecond = 3*hcToken;
    }
    else
        hcTokenSecond = 2*hcToken;


    console.log(hcToken);
    var hc = state.handiCap;
    var set = false;

    for(var i = 0; i < state.size; i++){
        tmp = [];
        if(i == hcToken || i == hcTokenSecond)
            set = true;
        else
            set = false;
        for(var j = 0; j < state.size; j++){
            if(hc == true && set == true && (j == hcToken || j == hcTokenSecond))
                tmp.push(1);
            else
                tmp.push(0);
        }
        state.board.push(tmp);
    }

    //prevent duplicate boards
    sendBoard();

    return state;
}

function isValid(board,move){
	if(move.x > board.size || move.y > board.size||move.x < 0 || move.y < 0){//checks to see if move is in the board
		return false;
	}
	if(board.board[move.x][move.y] != 0){ //checks it see if space it taken
		return false;
	}
	return true;
}

function logoutConfirm() {
    if(window.confirm('Really log out and go to home page? Current game progress will be lost.')){
        window.location.href="../index.html";
    }
}

//part of board size from dropdown
function init(){
    var temp;
    xhr.open("GET", "/board", true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {

            temp = JSON.parse(xhr.responseText);
            state.size = temp["size"];
            state.board = temp["board"];
            state.last = temp["last"];
            state.handiCap = temp["handiCap"];
            state.refresh = temp["refresh"];

            //set theme info
            state.theme = temp["theme"];
            state.colour = temp["colour"];
            theme = temp["theme"];
            colorBoard = temp["colour"];
            
            //create board and prevent new board from being created
            if(state.refresh == false)
                drawBoard(generateBoard(state.size));
            else
                drawBoard(state);

        }
        if(theme ==1){
            document.body.style.backgroundImage = "url('../img/geisha.jpg')";
            document.body.style.backgroundRepeat = "repeat-y";
            document.body.style.backgroundPosition = "center right";
        }
        if(theme == 2){
            document.body.style.backgroundImage = "url('../img/sam.jpg')";
            document.body.style.backgroundRepeat = "repeat-y";
            document.body.style.backgroundPosition = "center right";
         }
    }

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

function check_illegal_move(x, y, color){
    var liberty = 4;
    //check for white token
    if(color == 1){
        if(x != 0){
            if(state.board[x-1][y] == 2)
                liberty--;
        }else{
            liberty--;
        }

        if(x != state.size - 1){
            if(state.board[x+1][y] == 2)
                liberty--;
        }else{
            liberty--;
        }

        if(y != 0){
            if(state.board[x][y-1] == 2)
                liberty--;
        }else{
            liberty--;
        }

        if(y != state.size -1){
            if(state.board[x][y+1] == 2)
                liberty--;
        }else{
            liberty--;
        }
    }

    //check for black token
    if(color == 2){
        if(x != 0){
            if(state.board[x-1][y] == 1)
                liberty--;
        }else{
            liberty--;
        }

        if(x != state.size - 1){
            if(state.board[x+1][y] == 1)
                liberty--;
        }else{
            liberty--;
        }

        if(y != 0){
            if(state.board[x][y-1] == 1)
                liberty--;
        }else{
            liberty--;
        }

        if(y != state.size -1){
            if(state.board[x][y+1] == 1)
                liberty--;
        }else{
            liberty--;
        }
    }
    return liberty;
}

function capture(x){
    console.log("find capture x: ", x)
    for(i = 0; i < state.size; i++){
        for(j = 0; j < state.size; j++){
            if(check_illegal_move(i,j,state.board[i][j]) == 0){
                alert(state.board[i][j] + " "+ i + " " + j+ "is captured");
                state.board[i][j] = 0;

                //Here is a problem we can write in report
                //We must refresh the page after drawBoard.
                //Otherwise, another board will be drawn below current board.
                 drawBoard(state);
                 location.reload();
            }
        }
    }

    console.log("AFTER MOVE", state.board)
}



/*END GAME LOGIC*/
