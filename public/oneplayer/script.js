
var postXhr = new XMLHttpRequest();
var xhr = new XMLHttpRequest();

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
}


//working on this for board size from dropdown
function setBoard(size) {
    
    state.size = size;
    //send board state to the server

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
    postXhr.open("POST", "/board", true);
    postXhr.setRequestHeader("Content-type", "application/json");
    postXhr.responseType = 'text';
    postXhr.send(JSON.stringify(state));
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
    postXhr.open("POST", "/board", true);
    postXhr.setRequestHeader("Content-type", "application/json");
    postXhr.responseType = 'text';
    postXhr.send(JSON.stringify(state));

    //call AI

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
            //create board and prevent new board from being created
            if(state.refresh == false)
                drawBoard(generateBoard(state.size));
            else
                drawBoard(state.size);
        
        }
    }
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
    state.refresh == true;
    postXhr.open("POST", "/board", true);
    postXhr.setRequestHeader("Content-type", "application/json");
    postXhr.responseType = 'text';
    postXhr.send(JSON.stringify(state));
    
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
