var boardState = null;
var boardSize;

//working on this for board size from dropdown
function setBoard(size) {
    var newSize = size;
    var postXhr = new XMLHttpRequest();
    postXhr.open("POST", "/dog", true);
    postXhr.setRequestHeader("Content-type", "application/json");
    postXhr.responseType = 'text';
    postXhr.send(JSON.stringify(newSize));
    // alert("Board size set!");
}

function drawBoard(state){

    var canvas = $("#canvas");
    //height and width of the board
    var W = 600, H = 600;
    canvas.css("height", H);
    canvas.css("width", W);
    var svg = $(makeSVG(W, H));
    svg.append(makeRectangle(0, 0, H, W, "#dab44a"));


    var numOfPix = ((W-100)/(state.size-1));//so that the board has 50 pix of room on each side

    //token size
    var tsize;
    if(state.size == 9)
    tsize = 20;
    else if(state.size == 11)
    tsize = 17;
    else//size is 13
	tsize = 15;


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


    canvas.append(svg);
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
}

//part of board size from dropdown
function init(){

    console.log("Initalizing Page....");
    console.log("Board Size: " + boardSize);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/dog", true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log("Response: " + JSON.parse(xhr.responseText));
            boardsize = JSON.parse(xhr.responseText);
        }
    }

    console.log(boardSize);


    drawBoard(generateBoard(boardSize));
}


function generateBoard(size){

    var state = {
        size : size,
        board  : [],
    }

    var tmp = [];
    for(var i = 0; i < state.size; i++){
        tmp = [];
        for(var j = 0; j < state.size; j++){
            tmp.push(0);
        }
        state.board.push(tmp);
    }

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
