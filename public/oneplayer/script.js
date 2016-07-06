
var boardState = null; 


function drawBoard(state){

    var canvas = $("#canvas"); 
    //height and width of the board
    var W = 600, H = 600; 
    canvas.css("height", H); 
    canvas.css("width", W); 
    var svg = $(makeSVG(W, H));
    svg.append(makeRectangle(0, 0, H, W, "#dab44a"));


    var numOfPix = ((W-100)/(state.size-1));//so that the board has 50 pix of room on each side

    var x1 = 0;
    var y1 = 0;
    for(x = 50; x<(W-50); x += numOfPix){//50 to 550 with a 50 pix boarder
        
        for(y = 50; y<(W-50);y += numOfPix){

            svg.append(makeLine(x, y, x+numOfPix, y));
            svg.append(makeLine(x, y, x, y+numOfPix));

            if (state.board[y1][x1] != 0)
                svg.append(makeCircle(x, y, 20, state.board[y1][x1]));//makes a board
            y1++;
        }
        y1 = 0;
        x1++;
    }



    canvas.append(svg);
}

function init(){

    // do page load things here...

    console.log("Initalizing Page...."); 
    
    drawBoard(generateBoard(9)); 
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
