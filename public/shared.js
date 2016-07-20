/*BEGIN SHARED BOARD LOGIC HERE */

var postXhr = new XMLHttpRequest();
var xhr = new XMLHttpRequest();
var getArmy = new XMLHttpRequest();


var colorBoard;//base color
var moveUndone = false;
var theme = 0;

//holds all the boards information
var state = {
   "size": 0,
   "board": [],
   "tboard":[],
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
   "black": 0,
   "white": 6,
    "keyLiberties": [],
}

//class for creating important liberties
class keyLiberty {
    constructor(place, colour, army, size){
        this.place = place,
        this.colour = colour;
        this.army = army;
        this.size = size;
    }
}

//initializes game state
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
            
            //update score
            state.white = temp["white"];
            state.black = temp["black"];

            //set theme info
            state.theme = temp["theme"];
            state.colour = temp["colour"];

            state.tboard = temp["tboard"];
            
            theme = temp["theme"];
            colorBoard = temp["colour"];

            //create board and prevent new board from being created
            if(state.refresh == false) {
                drawBoard(generateBoard(state.size));

                //create temp board which stores captured territory
                var tmp = [];
                for(var i = 0; i < state.size; i++){
                    tmp = []
                    for(var j = 0; j < state.size; j++)
                        tmp.push(0);
                   
                    state.tboard.push(tmp);
                }

                console.log(state.tboard);
                sendBoard();
            }
            else
                drawBoard(state);

        }
        if(theme ==1){
            document.body.style.backgroundImage = "url('../img/geisha.jpg')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundPosition = "center right";
        }
        if(theme == 2){
            document.body.style.backgroundImage = "url('../img/sam.jpg')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundPosition = "center right";
         }
    }

}



//on home page click
function logoutConfirm() {
    if(window.confirm('Really log out and go to home page? Current game progress will be lost.')){
        window.location.href="../index.html";
    }
}

//deletes an army that has been captured
function removeTokens(tokens, colour){
    for(var i = 0; i < tokens.length; i ++){
        var x = tokens[i].position[1];
        var y = tokens[i].position[0];
        console.log("remove x: " + y);
        console.log("remove y: " + x);
        
        state.board[y][x] = 0;

        state.tboard[y][x] = colour;
        
        console.log(state.board);
        
    }
    sendBoard();
    drawBoard(state);
}

//sets theme functionality
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

//draws the board on the UI
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

//sets handicaps if enabled
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

//generates a new board
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
    state.refresh = true;
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

//checks if a token is trying to be placed in the middle of four opposing tokens
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

//check if trying to place opposite token in captured territory 
function checkTerr(x, y, c){
     var liberty = 4;
    //check for white token
    if(x != 0){
        if(state.board[x+1][y] != 0)
            liberty--;

        if(state.board[x-1][y] != 0)
            liberty--;
      
        if(state.board[x][y-1] != 0)
            liberty--;
   
        if(state.board[x][y+1] != 0)
            liberty--;
    }
   
    //if territory not surrounded and captured territory does not equal colour
    if(state.tboard[x][y] == c && liberty == 0)
        return false;
    return true;
}

function capture(x){
    console.log("find capture x: ", x)
    for(i = 0; i < state.size; i++){
        for(j = 0; j < state.size; j++){
            if(check_illegal_move(i,j,state.board[i][j]) == 0){
                //alert("Token has been captured!");
                state.board[i][j] = 0;

                //update score and tboard to account for captured territory
                if(checkMove == 1){
                    state.white--;
                    state.tboard[i][j] == 2;
                }
                if(checkMove == 2){
                    state.black--;
                    state.tboard[i][j] == 1;
                }

                //console.log("score")

                drawBoard(state);
                sendBoard();
            }
        }
    }
}


//Upon getArmy request return
getArmy.onreadystatechange = function() {
        if(getArmy.readyState == 4 && getArmy.status == 200) {
            if(getArmy.responseText == 400){
                console.log("BAD AI Army request")
            }
            else{
                var temp = JSON.parse(getArmy.responseText);
                var army = temp["armies"];

                console.log("number of armies: " + army.length);
                state.keyLiberties = [];

                //for each army, check its liberties, if an army only had one liberty, it is stored as a key liberty
                for(var i = 0; i < army.length; i ++){
                     if(army[i].liberties.length === 1){
                        var newKey = new keyLiberty(army[i].liberties[0], army[i].colour, army[i].tokens, army[i].size);
                        
                        //console.log(newKey);
                        state.keyLiberties.push(newKey);
                    }
                }   
                sendBoard();
            }   
        }  
}


/*BEGIN CHECK TERRITORY CODE*/


function contains(a ,obj){
    var i = a.length;
    while (i--) {
            //alert(i+ " here>>>" + a[i]);
            //alert(i+ " here>>>" + obj);
       if (a[i][0] == obj[0] && a[i][1] == obj[1]) {
            return true;
       }
    }
    return false;
}

//use Breadth First Search for counting territory
function bfs(i,j,visited){
    var queue = [];
    var curr_node = [i,j];
    //store visited node in this bfs
    var local_visited = [[i,j]];
    var edge = [];
    var territory = 1;
    //var count = 0;

    while(curr_node){
        var x = curr_node[0];
        var y = curr_node[1];
        if(x != 0){
            if(contains(local_visited, [x-1,y]) == false){
                 if(state.board[x-1][y] == 0){
                     local_visited.push([x-1,y]);
                     visited.push([x-1,y]);
                     queue.push([x-1,y]);
                     territory++;
                     //alert("territory: " +territory + "  " +[x-1,y]);
                 }
                 else{
                    //alert("edge + " + [x-1, y]);
                    edge.push(state.board[x-1][y]);

                 }
             }
        }

        if(x != state.size - 1){
            if(contains(local_visited, [x+1,y]) == false){
                if(state.board[x+1][y] == 0){
                    local_visited.push([x+1,y]);
                    visited.push([x+1,y]);
                    queue.push([x+1,y]);
                    territory++;
                    //alert("territory: " +territory + "  " +[x+1,y]);
                }
                else{ 
                    //alert("edge is " + [x+1,y]);
                    edge.push(state.board[x+1][y]);
                }
            }
        }

        if(y != 0){
            if(contains(local_visited, [x,y-1]) == false){
                if(state.board[x][y-1] == 0){
                    local_visited.push([x,y-1]);
                    visited.push([x,y-1]);
                    queue.push([x,y-1]);
                    territory++;
                    //alert("territory: " +territory + "  " +[x,y-1]);
                 
                }
                else{
                    //alert("edge is " + [x, y-1]);
                    edge.push(state.board[x][y-1]);
                }
            }

        }

        if(y != state.size -1){
            if(contains(local_visited, [x,y+1]) == false){
                if(state.board[x][y+1] == 0){
                    local_visited.push([x,y+1]);
                    visited.push([x,y+1]);
                    queue.push([x,y+1]);
                    territory++;
                    //alert("territory: " +territory + "  " +[x,y+1]);
                 
                }
                else{
                    //alert("edge is " + [x, y+1]);
                    edge.push(state.board[x][y+1]);
                }
            }
        }
        //count++;

        curr_node = queue.shift();
    }


    var i = edge.length;

    //check if this area is surrounded by same color tokens
    //if it is not, it is not a valid territory
    while(i--){
        if(edge[i] != edge[0]){
            territory = 0;
            break;
        }
    }
    if (territory != 0)

        return [territory, edge[0]];
    else{
        //alert(curr_node);
        return [territory, 0];
    }
}


function checkTerritory(){
    //to store all visited intersections
    var visited = [];
    var t_white = 0;
    var t_black = 0;

    //traverse all blank intersections
    for(var i = 0; i < state.size; i++){
        for(var j = 0; j < state.size; j++){
            if(state.board[i][j] == 0 && contains(visited,[i,j]) == false){
                var temp_territory = bfs(i,j,visited);
                if(temp_territory[1] == 1)
                    t_white += temp_territory[0];
                if(temp_territory[1] == 2)
                    t_black += temp_territory[0];
            }
        }
    }

    var ret = [t_white, t_black];
    return ret;

}

/*END TERRITORY CODE*/
