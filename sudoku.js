function sudoku_print(board,size){
    var str = "";
    for(var i = 0 ; i < size ; i++){
	for(var j = 0 ; j < size ; j++){
	    str += board[i][j].toString() + " "
	}
	str += "\n"
    }
    console.log(str)
}

function board_generator(size){
    var board = []
    for(var i = 0;i < size;i++){
	var x = []
	for(var j = 0; j< size;j++){
	    x.push(0)
	}
	board.push(x)
    }
    return board
}
function get_col(board,j,size){
    var x = []
    for(var i = 0 ; i < size ; i++){
	x.push(board[i][j])
    }
    return x
}
function check_element(array1,array2,array3,size){
    var x = []
    for(var i = 0;i < size ;i++){
	if (x.indexOf(array1[i]) < 0 && array1[i] != 0)
	    x.push(array1[i])
    }
    for(var i = 0; i < size ; i++){
	if (x.indexOf(array2[i]) < 0 && array2[i] != 0)
	    x.push(array2[i])
    }
    for(var i = 0; i < size ; i++){
	if (x.indexOf(array3[i]) < 0 && array3[i] != 0)
	    x.push(array3[i])
    }
    return x
    
}
function get_square(board,size,i,j){
    var index_row = Math.floor(Math.floor(i/Math.sqrt(size))*Math.sqrt(size))
    var index_col = Math.floor(Math.floor(j/Math.sqrt(size))*Math.sqrt(size))
    var x = []
    for( k = index_row ; k < index_row + 3 ; k ++){
	for( l = index_col ; l < index_col + 3 ; l++){
	    x.push(board[k][l])
	}
    }
    return x
}
function find_last(check , size){
    for(var i = 1 ; i <= size ; i++){
	if (check.indexOf(i) < 0){
	    return i
	}
    }
}
function sudoku_generator(board,size){
    for(var i = 0 ; i < size ; i ++ ){
	for (var j = 0 ; j < size ; j ++){
	    row = board[i]
	    col = get_col(board,j,size)
	    square = get_square(board,size,i,j)
	    while(true){
		var x = Math.round(Math.random()*(size-1)) + 1
		var check = check_element(row,col,square,size)
		if (check.length == size - 1){
		    x = find_last(check,size)
		    board[i][j] = x
		    break
		}
		else if (check.length == size){ 
		    return [true,board]
		}
		else if (row.indexOf(x) < 0 && col.indexOf(x) < 0 && square.indexOf(x) < 0){
		    board[i][j] = x
		    break
		}
	    }
	}
    }
    return [false,board]
}
function main(){
    var size = 9;
    var board = board_generator(size)
    var x = [true,board]
    while(x[0]){
	board = board_generator(size)
	x = sudoku_generator(board,size)
    }
    sudoku_print(board,size)
}
main()
