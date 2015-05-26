
/**
 * Solver Module
 * ============================================================================
 */

var sudokuTable = SudokuBoard.newBoard(3);
sudokuTable.board = 
	["3","3","","","","","","8","1",
	 "1","","9","","","","7","","4",
	 "","7","","","9","","","3","",
	 "","","","6","3","4","","","",
	 "","","1","2","","9","6","","",
	 "","","","7","1","8","","","",
	 "","3","","","7","","","4","",
	 "7","","8","","","","3","","2",
	 "2","1","","","","","","9","7"];

var Solver = (function () {

  'use strict';

  var n = 3;
	var sudokuTable;
	var sumFill = 0;

	var checkNumber = [];
	var NumberCheckerRow = [];
	var NumberCheckerCol = [];
	var SudokuSolved = false;
	var detailSolved = "";

	var LoggingEnabled = true;
	var LogSudokuTable = [];
	var LogCheckNumber = [];
	var LogAction = [];

	function CountSumFill() {
		for(var i = 0 ; i < n* n ; i++)
			for(var j = 0 ; j < n*n ; j++) {
				if(sudokuTable[i][j] == "")
					sumFill++;
			}
	}

	function CheckSolveTable() {
		for(var i = 0 ; i < n* n ; i++)
			for(var j = 0 ; j < n*n ; j++) {
				if(sudokuTable[i][j] == "")
					return false;
			}

		return true;
	}

	function CheckTableRowIsTrue() {

		for(var i = 0 ; i < n* n ; i++) {
			var checkRow = []
			for(var j = 0 ; j < n*n ; j++) {
				if(checkRow.indexOf(sudokuTable[i][j]) == -1) {
					checkRow.push(sudokuTable[i][j]);
				}
			}

			if(checkRow.length != 9)
				return false;
		}

		return true;
	}

	function CheckTableColIsTrue() {
		for(var i = 0 ; i < n* n ; i++) {
			var checkCol = []
			for(var j = 0 ; j < n*n ; j++) {
				if(checkCol.indexOf(sudokuTable[j][i]) == -1) {
					checkCol.push(sudokuTable[j][i]);
				}
			}

			if(checkCol.length != 9)
				return false;
		}

		return true;
	}

	function CheckTableBlockIsTrue() {
		for(var i = 0 ; i < n*n ; i+=3) {
			for(var j = 0 ; j < n*n ; j+=3) {


				var checkBlock = [];

				for(var k = i ; k < i+3 ; k++) {
					for(var l = j ; l < j+3 ; l++) {
						if(checkBlock.indexOf(sudokuTable[k][l]) == -1) {
							checkBlock.push(sudokuTable[k][l]);
						}
					}
				}

				if(checkBlock.length != 9)
					return false; 

			}
		}

		return true;
	}

	function CheckErrorTable() {
		for(var i = 0 ; i < n* n ; i++)
			for(var j = 0 ; j < n*n ; j++) {
				if(checkNumber[i][j].length == 0) {
					if(sudokuTable[i][j] == "") 
						return true;
				}
			}

		return false;
	}



	function InitCheckNumber(r) {
		checkNumber[r] = [];

		for(var i = 0 ; i < n*n ;i++) {
			checkNumber[r][i] = [];
		}
	}

	function InitAddNumbertoIntersect() {

		// init col
		for(var i = 0 ; i < n*n ; i++) {
			NumberCheckerCol[i] = [1,2,3,4,5,6,7,8,9];
			for(var j = 0 ; j < n*n ; j++) {
				if(sudokuTable[j][i] != "") {
					removeNumberInCheckerCol(i,sudokuTable[j][i]);
				}
			}
		}

		// init row
		for(var i = 0 ; i < n*n ; i++) {
			NumberCheckerRow[i] = [1,2,3,4,5,6,7,8,9];
			for(var j = 0 ; j < n*n ; j++) {
				if(sudokuTable[i][j] != "") {
					removeNumberInCheckerRow(i,sudokuTable[i][j]);
				}
			}
		}
	}

	function checkRow(r,c) {
		for(var i = 0 ; i < n*n ; i++) {
			if(sudokuTable[r][i] != "") {
				var found = checkNumber[r][c].indexOf(sudokuTable[r][i]);
				if(found == -1)
					checkNumber[r][c].push(sudokuTable[r][i]);
			}
		}
	}

	function checkCol(r,c) {
		for(var i = 0 ; i < n*n ; i++) {
			if(sudokuTable[i][c] != "") {
				var found = checkNumber[r][c].indexOf(sudokuTable[i][c]);
				if(found == -1)
					checkNumber[r][c].push(sudokuTable[i][c]);
			}
		}
	}

	function checkBlock(r,c) {
		var row_ratio = Math.floor(r/n);
		var col_ratio = Math.floor(c/n);

		for(var i = row_ratio * n ; i < (row_ratio+1) * n; i++) {
			for(var j = col_ratio * n ; j < (col_ratio+1) * n ; j++) {
				//console.log("Block at:" + i + "-" + j);
				if(sudokuTable[i][j] != "") {
					var found = checkNumber[r][c].indexOf(sudokuTable[i][j]);
					if(found == -1)
						checkNumber[r][c].push(sudokuTable[i][j]);
				}
			}
		} 
	}

	function RemainNumber(r,c) {
		var newArr = [];

		for(var i = 1 ; i <= 9 ; i++) {
			if(checkNumber[r][c].indexOf(i + "") == -1) {
				newArr.push(i);
			}
		}

		checkNumber[r][c] = newArr;
	}

	function checkEmpty(r,c) {
		if(checkNumber[r][c].length == "0") {
			if(sudokuTable[r][c] != "")
				console.log("Clear AT: (" + r + "," + c + ")");
			else
				console.log("Empty AT: (" + r + "," + c + ")");
		}
	}

	function removeNumberInRow(r,value) {
		for(var i = 0 ; i < n*n ; i++) {
			var index = checkNumber[r][i].indexOf(value);
			if(index != -1) {
				checkNumber[r][i].splice(index, 1);
				checkEmpty(r,i);
			}

		}
	}

	function removeNumberInCol(c,value) {
		for(var i = 0 ; i < n*n ; i++) {
			var index = checkNumber[i][c].indexOf(value);
			if(index != -1) {
				checkNumber[i][c].splice(index, 1);
				checkEmpty(i,c);
			}
		}
	}

	function removeNumberInBlock(r,c,value)  {
		var row_ratio = Math.floor(r/n);
		var col_ratio = Math.floor(c/n);

		for(var i = row_ratio * n ; i < (row_ratio+1) * n; i++) {
			for(var j = col_ratio * n ; j < (col_ratio+1) * n ; j++) {
				var index = checkNumber[i][j].indexOf(value);
				if(index != -1) {
					checkNumber[i][j].splice(index, 1);
					checkEmpty(i,j);
				}
			}
		} 
	}

	function removeNumberInCheckerRow(r,num) {
		//console.log("Row index: " + r);
		var index = NumberCheckerRow[r].indexOf(parseInt(num));
		//console.log("Remove index: " + index);
		NumberCheckerRow[r].splice(index,1);
	}

	function removeNumberInCheckerCol(c,num) {
		var index = NumberCheckerCol[c].indexOf(parseInt(num));
		NumberCheckerCol[c].splice(index,1);
	}

	function printTable(title) {
		for(var i = 0 ;i <  n*n; i++)
			for(var j = 0 ;j < n*n ;j++) {
				if(checkNumber[i][j].length == 0)
					if(sudokuTable[i][j] == "")
						console.log(title+": (" + (i+1) + "," + (j+1) + ") = " + sudokuTable[i][j] + "[error]");
					else
						console.log(title+": (" + (i+1) + "," + (j+1) + ") = " + sudokuTable[i][j] + "[result]");
				else
					console.log(title+": (" + (i+1) + "," + (j+1) + ") = " + checkNumber[i][j]);
			}
	}

	function showResultTable() {
		var display = "";
		display += "-------------------\n";
		for(var i = 0 ; i < n*n ; i++) {
			display += "|";
			for(var j = 0 ; j < n*n ;j++) {
				//display += "(" + (i+1) + "," + (j+1) + ") ";
				if(sudokuTable[i][j] == "")
					//display += "[" + checkNumber[i][j] + "]";
					display += "_";
				else
					display += sudokuTable[i][j];

				if(j % 3 == 2)
					display += "|";
				else
					display += " ";
			}

			display += "\n";

			if(i% 3 == 2) {
				display += "-------------------\n";
			}
		}
		
		console.log(display);
	}

	function showResultInputTable(sudoArr) {
		var display = "";
		display += "-------------------\n";
		for(var i = 0 ; i < n*n ; i++) {
			display += "|";
			for(var j = 0 ; j < n*n ;j++) {
				//display += "(" + (i+1) + "," + (j+1) + ") ";
				if(sudoArr[i][j] == "")
					//display += "[" + checkNumber[i][j] + "]";
					display += "_";
				else
					display += sudoArr[i][j];

				if(j % 3 == 2)
					display += "|";
				else
					display += " ";
			}

			display += "\n";

			if(i% 3 == 2) {
				display += "-------------------\n";
			}
		}
		
		console.log(display);
	}

	function getLoggingSudokuTableThisStep(index) {
		var currentSudokuTable;

		for(var i = 0 ; i < n*n ; i++) {
			for(var j = 0 ; j < n*n ; j++) {
				currentSudokuTable.push(LogSudokuTable[index][i][j]);
			}
		}

		return SudokuBoard.newBoard(3,currentSudokuTable);

	}

	function getLoggingSudokuCheckNumberThisStep(index) {
		var currentCheckNumber;

		for(var i = 0 ; i < n*n ; i++) {
			for(var j = 0 ; j < n*n ; j++) {
				currentCheckNumber.push(LogCheckNumber[index][i][j]);
			}
		}

		return SudokuBoard.newBoard(3,currentCheckNumber);
	}

	function getLoggingActionThisStep(index) {
		var currentAction = LogAction[index];

		return currentAction;
	}


	function getIndexChecknumber(arrCheckNumber,num) {
		var found = 0;
		var index = -1;
		for(var i = 0 ; i < n*n ; i++) {
			var current_index = arrCheckNumber[i].indexOf(num);
			if(current_index != -1) {
				index = i;
				found++;
			}

			if(found > 1) {
				index = -1;
				break;
			}
		}

		return index;
	}

	function getIndexFromRowCol(arrCheckNumber,num) {
		var index = [];

		for(var i = 0 ; i < n*n ; i++) {
			var current_index = arrCheckNumber[i].indexOf(num);
			if(current_index != -1)	 {
				index.push(i);
			}
		}

		return index;
	}

	function removeAll(r,c,value) {
		removeNumberInRow(r,value);
		removeNumberInCol(c,value);
		removeNumberInBlock(r,c,value);
		removeNumberInCheckerRow(r,value);
		removeNumberInCheckerCol(c,value);
	}

	function removeNumberInBlockOnlyRow(r,c,value) {
		for(var t = 0; t < 2 ; t++) {
			var i = r[t];

			for(var j = c ; j < c+3 ; j++) {
				var index = checkNumber[i][j].indexOf(value);
				//console.log("BlockAT: (" + (i+1) + "," + (j+1) + ") = " + checkNumber[i][j]);
				if(index != -1) {
					checkNumber[i][j].splice(index, 1);
					//console.log("SliceAT: (" + (i+1) + "," + (j+1) + ") = " + checkNumber[i][j]);
				}

			}
		}

	}

	function removeNumberInBlockOnlyCol(c,r,value) {
		for(var t = 0; t < 2 ; t++) {
			var i = c[t];

			for(var j = r ; j < r+3 ; j++) {
				var index = checkNumber[j][i].indexOf(value);
				//console.log("BlockAT: (" + (i+1) + "," + (j+1) + ") = " + checkNumber[j][i]);
				if(index != -1) {
					checkNumber[j][i].splice(index, 1);
					//console.log("SliceAT: (" + (i+1) + "," + (j+1) + ") = " + checkNumber[j][i]);
				}

			}
		}

	}

	function removeInRowWithoutThisBlock(block,r,value) {
		var init,end;
		init = block;
		end = block + 2;

		var operation = false;

		//console.log("Before Row AT: row = " + (r+1) + ", without = (" + (init+1) + "," + (end+1) + "), value = " + value);
		//console.log(checkNumber[r]);

		for(var i = 0 ; i < n*n ; i++) {

			if(i >= init && i <= end) continue;

			var index = checkNumber[r][i].indexOf(value);
			if(index != -1) {
				operation = true;
				checkNumber[r][i].splice(index, 1);
				checkEmpty(r,i);
				//console.log("Delete AT: col = " + (i+1) + ": " + checkNumber[r][i]);
			}
		}

		//console.log("After Row AT: row = " + (r+1) + ", without = (" + (init+1) + "," + (end+1) + "), value = " + value);
		//console.log(checkNumber[r]);


		removeNumberInCheckerRow(r,value);

		return operation;
	}

	function removeInRowWithoutColIndex(r,c,value) {
		//console.log("on remove: " + value);
		//console.log("except col: " + c);

		var operation = false;
		for(var i = 0 ; i < n*n ; i++) {
			for(var index_value = 0 ; index_value < value.length ; index_value++){

				var current_value = value[index_value];
				//console.log("on value: " + current_value);

				if(c.indexOf(i) == -1) {
					var index = checkNumber[r][i].indexOf(current_value);
					if(index != -1) {
						operation = true;
						checkNumber[r][i].splice(index, 1);
						checkEmpty(r,i);
					}
				}
			}
		}

		for(var index_value = 0 ; index_value < value.length ; index_value++)
			removeNumberInCheckerRow(r,value[index_value]);

		return operation;
	}

	function removeInColWithoutRowIndex(c,r,value) {
		//console.log("on remove: " + value);
		//console.log("except col: " + c);

		var operation = false;

		for(var i = 0 ; i < n*n ; i++) {
			for(var index_value = 0 ; index_value < value.length ; index_value++){

				var current_value = value[index_value];
				//console.log("on value: " + current_value);

				if(r.indexOf(i) == -1) {
					var index = checkNumber[i][c].indexOf(current_value);
					if(index != -1) {
						operation = true;
						checkNumber[i][c].splice(index, 1);
						checkEmpty(i,c);
					}
				}
			}
		}

		for(var index_value = 0 ; index_value < value.length ; index_value++)
			removeNumberInCheckerCol(c,value[index_value]);

		return operation;
	}

	function removeInBlockWithoutRowColIndex(r,c,index_except,value) {
		var row_index_arr = [index_except[0][0],index_except[1][0]];
		var col_index_arr = [index_except[0][1],index_except[1][1]];

		//console.log("ON BLOCK: (" + r + "," + c + ")");
		//console.log("row except: " + row_index_arr);
		//console.log("col except: " + col_index_arr);

		var operation = false;

		for(var i = r ; i < r+n ; i++) {
			for(var j = c ; j < c+n ; j++) {
				for(var index_value = 0 ; index_value < value.length ; index_value++){

					var current_value = value[index_value];
					//console.log("on value: " + current_value);

					if(row_index_arr.indexOf(i) == -1 && col_index_arr.indexOf(j) == -1) {
						var index = checkNumber[i][j].indexOf(current_value);
						if(index != -1) {
							operation = true;
							checkNumber[i][j].splice(index, 1);
							checkEmpty(i,j);
						}
					}
				}
			}
		}

		return operation;
	}


	function removeInColWithoutThisBlock(block,c,value) {
		var init,end;
		init = block;
		end = block + 2;

		for(var i = 0 ; i < n*n ; i++) {

			if(i >= init && i <= end) continue;

			var index = checkNumber[i][c].indexOf(value);
			if(index != -1) {
				checkNumber[i][c].splice(index, 1);
				checkEmpty(i,c);
			}
		}

		removeNumberInCheckerCol(c,value);
	}

	function getRowNumberInBlock(r,c,value) {

		var index = [];
		// row
		for(var i = r ; i < r + n ; i++) {
			for(var j = c ; j < c + n ; j++){


				var current_index = checkNumber[i][j].indexOf(value);
				if(current_index != -1) {
					index.push(i);
					break;
				}
			}
		}

		//console.log("(Row)Block AT: (" + (r+1) + "," + (c+1) + ") ON Value " + value +" = " + index);
		if(index.length == 1)
			return index[0];
		else
			return -1;

	}


	function getColNumberInBlock(r,c,value) {

		var index = [];
		


		for(var i = c ; i < c + n ; i++) {
			for(var j = r ; j < r + n ; j++){
				var current_index = checkNumber[j][i].indexOf(value);
				if(current_index != -1) {
					index.push(i);
					break;
				}
			}
		}

		//console.log("(Col)Block AT: (" + (r+1) + "," + (c+1) + ") ON Value " + value +" = " + index);
		if(index.length == 1)
			return index[0];
		else
			return -1;

	}

	function compareIntersect(arr1, arr2) {
	    var result = (arr2.length === _.intersection(arr2, arr1).length);
	    return result;
	}

	function addLogging(action) {

		if(LoggingEnabled) {

			var temp_sudokuTable = sudokuTable.map(function(arr) {
				return arr.slice();
			});

			LogSudokuTable.push(temp_sudokuTable);

			var temp_checkNumber = [];
			for(var i = 0 ; i < n*n ; i++) {
				temp_checkNumber[i] = [];
			}
			
			for(var i = 0 ; i < n*n ; i++) {
				for(var j = 0 ; j < n*n ; j++) {
					temp_checkNumber[i][j] = checkNumber[i][j].slice();
				}
			}

			LogCheckNumber.push(temp_checkNumber);
			LogAction.push(action);
		}
	}


	function executeTable() {

		while(true) {

			var nakedSingle = false;
			for(var i = 0 ; i < n*n ; i++) {
				for(var j = 0 ; j < n*n; j++) {
					if(checkNumber[i][j].length == 1 && sudokuTable[i][j] == "") {
						nakedSingle = true;
						var value = checkNumber[i][j][0];				
						sudokuTable[i][j] = value;
						checkNumber[i][j] = [];
						removeAll(i,j,value);
						//showResultTable();
						//console.log("(NakedSingle)Found At: (" + (i+1) + "," + (j+1) + ") = " + value);
						addLogging("(NakedSingle)Found At: (" + (i+1) + "," + (j+1) + ") = " + value);
					}
				}
			}

			//if(nakedSingle)
			//	printTable("New" + time++);
				

			var hiddenSingle = false;

			// check row
			for(var i = 0 ; i < n*n ; i++) {
				for(var num = 1; num <= n*n ; num++) {
					var index = getIndexChecknumber(checkNumber[i],num);
					if(index != -1) {
						sudokuTable[i][index] = num;
						checkNumber[i][index] = [];
						removeAll(i,index,num);
						//showResultTable();
						//console.log("(HiddenSingle)Found At: (" + (i+1) + "," + (index+1) + ") = " + num);
						addLogging("(HiddenSingle)Found At: (" + (i+1) + "," + (index+1) + ") = " + num);
						hiddenSingle = true;
					}
				}
			}

			// check column
			for(var j = 0 ; j < n*n ; j++) {
				for(var num = 1; num <= n*n ; num++) {

					var newCol = [];

					for(var k = 0 ; k < n*n ; k++) 
						newCol.push(checkNumber[k][j]);
					
					var index = getIndexChecknumber(newCol,num);	
					if(index != -1) {				
						sudokuTable[index][j] = num;
						checkNumber[index][j] = [];
						removeAll(index,j,num);
						//showResultTable();
						//console.log("(HiddenSingle)Found At: (" + (index+1) + "," + (j+1) + ") = " + num);
						addLogging("(HiddenSingle)Found At: (" + (index+1) + "," + (j+1) + ") = " + num);

						hiddenSingle = true;
					}
				}
			}

			// check block
			for(var i = 0 ; i < n*n ; i+= 3) {
				for(var num = 1; num <= n*n ; num++) {
					for(var j = 0 ; j < n*n ; j+=3) {
						var newBlock = [];
						var newXY = [];
						var row_ratio = Math.floor(i/n);
						var col_ratio = Math.floor(j/n);

						for(var in_i = row_ratio * n ; in_i < (row_ratio+1) * n; in_i++) {
							for(var in_j = col_ratio * n ; in_j < (col_ratio+1) * n ; in_j++) {
								newBlock.push(checkNumber[in_i][in_j]);
								newXY.push([in_i,in_j]);
							}
						} 	

						var index = getIndexChecknumber(newBlock,num);
						
						if(index != -1) {
							var new_x = newXY[index][0];
							var new_y = newXY[index][1];						
							sudokuTable[new_x][new_y] = num;
							checkNumber[new_x][new_y] = [];
							removeAll(new_x,new_y,num);
							//showResultTable();
							//console.log("(HiddenSingle)Found At: (" + (new_x+1) + "," + (new_y+1) + ") = " + num);
							addLogging("(HiddenSingle)Found At: (" + (new_x+1) + "," + (new_y+1) + ") = " + num);

							hiddenSingle = true;
						}

					}
				}
			}


			//if(hiddenSingle)
		//		printTable("New" + time++);


			

			var intersectCheckClaiming = false;

			// Locking Candidate Claiming
			// check row
			for(var i = 0 ; i < n*n ; i++) {
				for(var num_index = 0; num_index < NumberCheckerRow[i].length ; num_index++) {

					var num = NumberCheckerRow[i][num_index];
					var index = getIndexFromRowCol(checkNumber[i],num);


					if(index.length == 0) continue;
					var first_value = index[0]; 
					var last_value = index[index.length-1];


					var diff = false;
					if(first_value >= 0 && first_value <= 2 && last_value >= 0 && last_value <= 2) diff = true;
					else if(first_value >= 3 && first_value <= 5 && last_value >= 3 && last_value <= 5) diff = true;
					else if(first_value >= 6 && first_value <= 8 && last_value >= 6 && last_value <= 8) diff = true;

					var block_index = -1;
					var row_target = [];

					if(diff) {


						// choose block
						if(first_value < 3) 
							block_index = 0;
						else if(first_value < 6) 
							block_index = 3;
						else if(first_value < 9) 
							block_index = 6;

						
						// for(var k = 0 ; k < index.length ; k++) {
						// 	console.log("ThisBlockAT: (" + (i+1) + "," + (index[k]) + ") = " + checkNumber[i][index[k]]);
						// }

						if(i < 3) {
							for(var k = 0 ; k < 3 ; k++)
								if(k != i)
									row_target.push(k);
						}else if(i < 6) {
							for(var k = 3 ; k < 6 ; k++)
								if(k != i)
									row_target.push(k);
						}else if(i < 9) {
							for(var k = 6 ; k < 9 ; k++)
								if(k != i)
									row_target.push(k);
						}

						intersectCheckClaiming = true;
						removeNumberInBlockOnlyRow(row_target,block_index,num);
						NumberCheckerRow[i].splice(num_index,1);
						num_index--;

						//console.log("(IntersectClaiming)Found At: row = " + (i+1) + ", block = " + block_index + ", num = " + num);
						addLogging("(IntersectClaiming)Found At: row = " + (i+1) + ", block = " + block_index + ", num = " + num);
						
					}
				}
			}

			// check column
			for(var i = 0 ; i < n*n ; i++) {
				for(var num_index = 0; num_index < NumberCheckerCol[i].length ; num_index++) {

					var num = NumberCheckerCol[i][num_index];
					var newCol = [];

					for(var k = 0 ; k < n*n ; k++) 
						newCol.push(checkNumber[k][i]);

					var index = getIndexFromRowCol(newCol,num);
					if(index.length == 0) continue;
					var first_value = index[0]; 
					var last_value = index[index.length-1];


					var diff = false;
					if(first_value >= 0 && first_value <= 2 && last_value >= 0 && last_value <= 2) diff = true;
					else if(first_value >= 3 && first_value <= 5 && last_value >= 3 && last_value <= 5) diff = true;
					else if(first_value >= 6 && first_value <= 8 && last_value >= 6 && last_value <= 8) diff = true;

					var block_index = -1;
					var col_target = [];

					if(diff) {

						// choose block
						if(first_value < 3) 
							block_index = 0;
						else if(first_value < 6) 
							block_index = 3;
						else if(first_value < 9) 
							block_index = 6;

						

						// for(var k = 0 ; k < index.length ; k++) {
						// 	console.log("ThisBlockAT: (" + (index[k]) +","+ (i+1) + ") = " + checkNumber[i][index[k]]);
						// }

						if(i < 3) {
							for(var k = 0 ; k < 3 ; k++)
								if(k != i)
									col_target.push(k);
						}else if(i < 6) {
							for(var k = 3 ; k < 6 ; k++)
								if(k != i)
									col_target.push(k);
						}else if(i < 9) {
							for(var k = 6 ; k < 9 ; k++)
								if(k != i)
									col_target.push(k);
						}

						intersectCheckClaiming = true;
						removeNumberInBlockOnlyCol(col_target,block_index,num);
						NumberCheckerCol[i].splice(num_index,1);
						num_index--;

						//console.log("(IntersectClaiming)Found At: col = " + (i+1) + ", block = " + block_index + ", num = " + num);
						addLogging("(IntersectClaiming)Found At: col = " + (i+1) + ", block = " + block_index + ", num = " + num);
						
					}
				}
			}


			var intersectPointing = false;
			// Locking Candidate Point
			for(var i = 0 ; i < n*n ;i += n) {
				for(var j = 0 ; j < n*n ; j+=n) {
					for(var num = 1 ; num <= 9 ; num++) {
						//row
						var index1 = getRowNumberInBlock(i,j,num);
						if(index1 != -1) {
							intersectPointing = removeInRowWithoutThisBlock(j,index1,num);
							if(intersectPointing) {
								//console.log("(IntersectPointing)Found At: row = " + (index1+1) + ", block = (" + (i+1) + "," + (j+1) + ")" + ", num = " + num);
								addLogging("(IntersectPointing)Found At: row = " + (index1+1) + ", block = (" + (i+1) + "," + (j+1) + ")" + ", num = " + num);
							}
							
						}

						// column
						var index2 = getColNumberInBlock(i,j,num);
						if(index2 != -1) {
							intersectPointing = removeInColWithoutThisBlock(i,index2,num);
							if(intersectPointing) {
								//console.log("(IntersectPointing)Found At: col = " + (index2+1) + ", block = (" + (i+1) + "," + (j+1) + ")" + ", num = " + num);
								addLogging("(IntersectPointing)Found At: col = " + (index2+1) + ", block = (" + (i+1) + "," + (j+1) + ")" + ", num = " + num);							
							}
								
						}
						
					}
					
					
				}
			}

			

			
			var nakedPair = false;

			// row
			for(var i = 0 ; i < n*n ; i++) {
				var findPair = [];
				var indexPair = [];
				for(var j = 0 ; j < n*n ; j++) {

					if(checkNumber[i][j].length == 2) {
						findPair.push(checkNumber[i][j]);
						indexPair.push(j);
					}
				}

				//console.log(findPair);

			
				if(findPair.length >= 2) {
					var max_length = findPair.length;
					for(var k = 0 ; k < max_length ; k++) {
						for(var l = k+1 ; l < max_length ; l++) {
							var check = compareIntersect(findPair[k],findPair[l]);

							if(check){
								nakedPair = removeInRowWithoutColIndex(i,[indexPair[k],indexPair[l]],findPair[k]);
								if(nakedPair) {
									//console.log("(NakedPair)Found At: (" + (i+1) + "," + (indexPair[k]+1) + "),(" + (i+1) + "," + (indexPair[l]+1) + "), num = " + findPair[k]);
									addLogging("(NakedPair)Found At: (" + (i+1) + "," + (indexPair[k]+1) + "),(" + (i+1) + "," + (indexPair[l]+1) + "), num = " + findPair[k]);
								}
								
							}
						}
					}

				}
			}


			// column
			for(var i = 0 ; i < n*n ; i++) {
				var findPair = [];
				var indexPair = [];
				for(var j = 0 ; j < n*n ; j++) {

					if(checkNumber[j][i].length == 2) {
						findPair.push(checkNumber[j][i]);
						indexPair.push(j);
					}
				}

				//console.log(findPair);

			
				if(findPair.length >= 2) {
					var max_length = findPair.length;
					for(var k = 0 ; k < max_length ; k++) {
						for(var l = k+1 ; l < max_length ; l++) {
							var check = compareIntersect(findPair[k],findPair[l]);

							if(check){
								nakedPair = removeInColWithoutRowIndex(i,[indexPair[k],indexPair[l]],findPair[k]);
								if(nakedPair){
									//console.log("(NakedPair)Found At: (" + (indexPair[k]+1) + "," + (i+1)  + "),(" + (indexPair[l]+1) + "," + (i+1) + "), num = " + findPair[k]);
									addLogging("(NakedPair)Found At: (" + (indexPair[k]+1) + "," + (i+1)  + "),(" + (indexPair[l]+1) + "," + (i+1) + "), num = " + findPair[k]);
								}
								
							}
						}
					}

				}
			}

			// block
			for(var i = 0 ; i < n*n ; i+=n) {
				for(var j = 0 ; j < n*n ; j+=n) {
					var findPair = [];
					var indexPair = [];

					for(var k = i  ; k < i + n ; k++) {
						for(var l = j ; l < j + n ; l++) {
							if(checkNumber[k][l].length == 2) {
								findPair.push(checkNumber[k][l]);
								indexPair.push([k,l]);
							}
						}
					}
					

					if(findPair.length >= 2) {
						var max_length = findPair.length;
						for(var k = 0 ; k < max_length ; k++) {
							for(var l = k+1 ; l < max_length ; l++) {
								var check = compareIntersect(findPair[k],findPair[l]);

								if(check){
									nakedPair = removeInBlockWithoutRowColIndex(i,j,[indexPair[k],indexPair[l]],findPair[k]);
									if(nakedPair) {
										//console.log("(NakedPair)Found At: (" + (indexPair[k][0]+1) + "," + (indexPair[k][1]+1)  + "),(" + (indexPair[l][0]+1) + "," + (indexPair[l][1]+1) + "), num = " + findPair[k]);
										addLogging("(NakedPair)Found At: (" + (indexPair[k][0]+1) + "," + (indexPair[k][1]+1)  + "),(" + (indexPair[l][0]+1) + "," + (indexPair[l][1]+1) + "), num = " + findPair[k]);
									}
									
								}
							}
						}

					}
				}		
			}


			if(!nakedSingle && !hiddenSingle && !intersectCheckClaiming && !intersectPointing && !nakedPair)
				break;
			
		}
	}

	function BacktrackingSolvingFalse(index,old_temp_sudokuTable,old_temp_NumberCheckerCol,old_temp_NumberCheckerRow,old_temp_checkNumber) {
		if(SudokuSolved) return;

		executeTable();

		var checkSolve = CheckSolveTable();
		var random_index = index;
		var random_x,random_y;

		//console.log("CheckSolve: " + checkSolve);

		if(!checkSolve) {

				// create temp
				var temp_sudokuTable,temp_NumberCheckerRow,temp_NumberCheckerCol,temp_checkNumber = [];
				
				temp_sudokuTable = sudokuTable.map(function(arr) {
					return arr.slice();
				});

				temp_NumberCheckerRow = NumberCheckerRow.map(function(arr) {
					return arr.slice();
				});


				temp_NumberCheckerCol = NumberCheckerCol.map(function(arr) {
					return arr.slice();
				});


				for(var i = 0 ; i < n*n ; i++) {
					temp_checkNumber[i] = [];
				}

				//console.log("CheckNumber On False");
				
				for(var i = 0 ; i < n*n ; i++) {
					for(var j = 0 ; j < n*n ; j++) {
						temp_checkNumber[i][j] = checkNumber[i][j].slice();
					}
				}

				// choose random number 
				random_index = 0;
				random_x = -1;
				random_y = -1;

				var pairFound = false;
				
				for(var i = 0 ; i < n*n ; i++) {
					for(var j = 0 ; j < n*n ; j++) {
						if(checkNumber[i][j].length == 2) {
							var value = checkNumber[i][j][random_index];
							random_x = i;
							random_y = j;
							//console.log("(Unknown Case -> New Random) At: (" + (random_x+1) + "," + (random_y+1) + ") = " + value);
							addLogging("(Unknown Case -> New Random) At: (" + (random_x+1) + "," + (random_y+1) + ") = " + value);
							sudokuTable[i][j] = value;
							checkNumber[i][j] = [];
							removeAll(i,j,value);
							//showResultTable();
							BacktrackingSolvingTrue(random_index+1,random_x,random_y,temp_sudokuTable,temp_NumberCheckerCol,temp_NumberCheckerRow,temp_checkNumber);
						}
					}
				}

				if(!SudokuSolved) {
					// not found
					sudokuTable = old_temp_sudokuTable.map(function(arr) {
						return arr.slice();
					});

					NumberCheckerRow = old_temp_NumberCheckerRow.map(function(arr) {
						return arr.slice();
					});

					NumberCheckerCol = old_temp_NumberCheckerCol.map(function(arr) {
						return arr.slice();
					});

					//console.log(checkNumber);
					//checkNumber = temp_checkNumber;
					checkNumber = []
					for(var i = 0 ; i < n*n ; i++) {
						checkNumber[i] = [];
					}
					
					for(var i = 0 ; i < n*n ; i++) {
						for(var j = 0 ; j < n*n ; j++) {
							checkNumber[i][j] = old_temp_checkNumber[i][j].slice();
						}
					}
				}

				return ;
		}else {
			SudokuSolved = true;
			return ;
		}
	}

	function BacktrackingSolvingTrue(index,x,y,temp_sudokuTable,temp_NumberCheckerCol,temp_NumberCheckerRow,temp_checkNumber) {
		if(SudokuSolved) return;

		executeTable();

		var checkSolve = CheckSolveTable();
		var random_index = index;

		if(!checkSolve) {

			var checkError = CheckErrorTable();
			//console.log("Error: " + checkError);

			if(checkError) {
				//console.log(temp_sudokuTable);
				sudokuTable = temp_sudokuTable.map(function(arr) {
					return arr.slice();
				});

				NumberCheckerRow = temp_NumberCheckerRow.map(function(arr) {
					return arr.slice();
				});

				NumberCheckerCol = temp_NumberCheckerCol.map(function(arr) {
					return arr.slice();
				});

				//console.log(checkNumber);
				//checkNumber = temp_checkNumber;
				checkNumber = []
				for(var i = 0 ; i < n*n ; i++) {
					checkNumber[i] = [];
				}

				//console.log("CheckNumber On True");
				//console.log("Test: (" + x + "," + y + ")");
				
				for(var i = 0 ; i < n*n ; i++) {
					for(var j = 0 ; j < n*n ; j++) {
						checkNumber[i][j] = temp_checkNumber[i][j].slice();
					}
				}


				var value = checkNumber[x][y][random_index];
				//console.log("(Wrong Case -> Random Again) At: (" + (x+1) + "," + (y+1) + ") = " + value);
				addLogging("(Wrong Case -> Random Again) At: (" + (x+1) + "," + (y+1) + ") = " + value);

				sudokuTable[x][y] = value;
				checkNumber[x][y] = [];
				removeAll(x,y,value);
				//showResultTable();
				return ;

			}else {
				BacktrackingSolvingFalse(0,temp_sudokuTable,temp_NumberCheckerCol,temp_NumberCheckerRow,temp_checkNumber);
			}
		}else {
			SudokuSolved = true;
			return ;
		}
			
	}

	function solved(sudokuArr,LoggingLogin) {
		sudokuTable = sudokuArr;
		LoggingEnabled = LoggingLogin;

		SudokuSolved = false;
		// start search
		for(var i = 0 ; i < n*n ; i++) {
			InitCheckNumber(i);
			for(var j = 0 ; j < n*n ; j++) { 
				if(sudokuTable[i][j] == "") {
					checkRow(i,j);
					checkCol(i,j);
					checkBlock(i,j);
					RemainNumber(i,j);
				}
			}
		}
		//console.log("Initialize");
		//showResultTable();
		InitAddNumbertoIntersect();

		// fill Naked Single

		var randomVariable = false;
		var random_x,random_y;
		var random_index = 0;

		BacktrackingSolvingFalse(0,sudokuTable,NumberCheckerCol,NumberCheckerRow,checkNumber);

		//console.log("Sum Log: " + LogSudokuTable.length);
		//showResultTable();
		var checkTableRow = CheckTableRowIsTrue();
		var checkTableCol = CheckTableColIsTrue();
		var checkTableBlock = CheckTableBlockIsTrue();

		// console.log("Check Table Row: " + checkTableRow);
		// console.log("Check Table Col: " + checkTableCol);
		// console.log("Check Table Block: " + checkTableBlock);
		// console.log("Solved: " + SudokuSolved);
		// printTable("Last Result");

		return (SudokuSolved && checkTableRow && checkTableCol && checkTableBlock);

	}


	return {
		makeSolve: function(sudoArr,LoggingLogin) {
			return solved(sudoArr,LoggingLogin);
		},
		print : function(sudoArr) {
			showResultInputTable(sudoArr);
		},
		getLogBoard : function(index) {
			return getLoggingSudokuTableThisStep(index);
		},
		getLogMarkBoard : function(index) {
			return getLoggingSudokuCheckNumberThisStep(index);
		},
		getLogAction : function(index) {
			return getLoggingActionThisStep(index);
		}
	}
}());


