const player = 'O' // -10
const computer = 'X' //+10

function makeBoard(){
    let board = [];
    for(let row=0; row<3; row++){
        let rowBoard = [];
        for(let column=0; column<3; column++){
            rowBoard.push(null);
        }
        board.push(rowBoard);
    }
    return board;
}

function isLeft(board){
    for(let row=0; row<3; row++){
        for(let column=0; column<3; column++){
            if(board[row][column] === null){
                return true;
            }
        }
    }
    return false;
}

function getPlayerTurn(board){
    alert("Your Turn")
    let row = prompt('Enter row number : ');
    row = row - 1

    if(isNaN(row) ||row > 2 || row < 0){
        alert('Enter valid row number :(');
        return [-1,-1];
    }

    let column = prompt('Enter column number : ');
    column = column - 1;

    if( isNaN(column) || column > 2 || column < 0){
        alert('Enter valid column number :(');
        return [-1,-1];
    }

    if(board[row][column] !== null){
        alert('Cell is already occupied :(');
        return [-1,-1];
    }

    return [row,column];
}

function isWin(board){

    //cheak for row win
    for(let row=0; row<3; row++){

        //if row is equal
        if(board[row][0] === board[row][1] && board[row][0] === board[row][2]){

            //if it is player
            if(board[row][0] === player){
                return -10
            }

            //if it is computer
            else if(board[row][0] === computer){
                return 10;
            }

            //if not both
            else {
                return 0;
            }
            
        }
    }

    //cheak for column win
    for(let column=0; column<3; column++){

        //if column is euqal
        if(board[0][column] === board[1][column] && board[0][column] === board[2][column]){

            //if is player
            if(board[0][column] === player){
                return -10;
            }

            //if it is computer
            else if(board[0][column] === computer){
                return 10;
            }

            //if not both
            else {
                return 0;
            }
            
        }
    }

    //cheak for right diagonal
    if(board[0][0] === board[1][1] && board[0][0] === board[2][2]){
        
        //if it is player
        if(board[0][0] === player){
            return -10;
        }

        //if it computer
        else if(board[0][0] === computer){
            return 10;
        }

        //if not both
        else {
            return 0;
        }
        
    }

    //cheak for left diagonal
    if(board[0][2] === board[1][1] && board[0][2] === board[2][0]){
        
        //if it is player
        if(board[0][2] === player){
            return -10;
        }

        //if it computer
        else if(board[2][0] === computer){
            return 10;
        }

        //if not both
        else {
            return 0;
        }
        
    }

    return 0;
}

function min(num1,num2){
    return num1>num2 ? num2 : num1;
}

function max(num1,num2){
    return num1>num2 ? num1 : num2;
}

function minMax(board, depth, isCom){

    let result = isWin(board);

    //chaeking for game status
    if(result === -10 || result === 10){
        return result;
    }
    else if( !(isLeft(board))){
        return 0;
    }

    //if computer's turn
    if (isCom){

        //computer is maxi 
        let bestScore = -1000

        for(let row=0; row<3; row++){
            for(let column=0; column<3; column++){
    
                //if cell is empty
                if (board[row][column] === null){
    
                    //let computer take turn on cell
                    board[row][column] = computer;
    
                    //what is score of win
                    bestScore = max(bestScore , minMax(board , depth+1 , !(isCom)) -1);
    
                    //undo move
                    board[row][column] = null;
                }
            }
        }

        return bestScore

    }

    //if player's turn
    else {

        //player is mini 
        let bestScore = 1000

        for(let row=0; row<3; row++){
            for(let column=0; column<3; column++){
    
                //if cell is empty
                if (board[row][column] === null){
    
                    //let player take turn on cell
                    board[row][column] = player;
    
                    //what is score of win
                    bestScore = min(bestScore , minMax(board , depth+1 , !(isCom)) -1);
    
                    //undo move
                    board[row][column] = null;
                }
            }
        }

        return bestScore

    }
}

function findBestMove(board){

    let bestScore = -1000
    let bestMove = [-1,-1]

    for(let row=0; row<3; row++){
        for(let column=0; column<3; column++){
            
            //if cell is empty
            if (board[row][column] === null){
                //let computer take turn on cell
                board[row][column] = computer;

                //what is score of win
                let score = minMax(board , 0 , false);

                //undo move
                board[row][column] = null;

                //if score is best than bestScore
                if(score > bestScore){

                    //new bestscore
                    bestScore = score;

                    //new bestMove
                    bestMove = [row,column];
                }
            }
        }
    }
    return bestMove;
}

function printBoard(board){
    console.table(board)
}

board = makeBoard()
while( isLeft(board)){

    //player's turn
    let row,column;
    [row,column] = getPlayerTurn(board);
    if(row == -1 || column == -1){
        continue;
    }
    
    //player done with ture
    board[row][column] = player;

        //cheak for wining
        let result = isWin(board);

        //chaeking for game status
        if(result === -10){
            console.log('You win')
            break;
        }
        else if(result === 10){
            console.log('Computer win');
            break;
        }
        else if( !(isLeft(board))){
            console.log('Match Draw');
            break;
        }

        console.log('After your turn');
        printBoard(board);


    //Computer'S turn
    [row,column] = findBestMove(board);
    board[row][column] = computer;

    alert(`computer choose row : ${row} , column : ${column}`)
    console.log("After Computer's turn");
        printBoard(board);
        //cheak for wining
        result = isWin(board);

        //chaeking for game status
        if(result === -10){
            console.log('You win')
            break;
        }
        else if(result === 10){
            console.log('Computer win');
            break;
        }
        else if( !(isLeft(board))){
            console.log('Match Draw');
            break;
        }
        


}