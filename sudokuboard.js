

/**
 * SudokuBoard Module
 * ============================================================================
 */

var SudokuBoard = (function () {

  'use strict';

  function Board(size, data) {
    this.size   = size;
    this.board  = [];
    if (typeof data !== 'undefined') {
      this.board = data;
    } else {
      var index;
      for (index = 0; index < size * size * size * size; index += 1) {
        this.board.push('0');
      }
    }
  }

  Board.prototype.toRowHouse = function () {
    var map, row, rowIndex, colIndex, board, sqSize;
    map    = [];
    board  = this.board;
    sqSize = this.size * this.size;
    for (rowIndex = 0; rowIndex < sqSize; rowIndex += 1) {
      row = [];
      for (colIndex = 0; colIndex < sqSize; colIndex += 1) {
        row.push(board[rowIndex * sqSize + colIndex]);
      }
      map.push(row);
    }
    return map;
  }

  Board.prototype.toColHouse = function () {
    var map, col, rowIndex, colIndex, board, sqSize;
    map    = [];
    board  = this.board;
    sqSize = this.size * this.size;
    for (colIndex = 0; colIndex < sqSize; colIndex += 1) {
      col = [];
      for (rowIndex = 0; rowIndex < sqSize; rowIndex += 1) {
        col.push(board[rowIndex * sqSize + colIndex]);
      }
      map.push(col);
    }
    return map;
  }

  Board.prototype.toBoxHouse = function () {
    var map, rowMap, box, row, col, floorIndex, towerIndex, size;
    map    = [];
    rowMap = this.toRowHouse();
    size   = this.size;
    for (row = 0; row < size; row += 1) {
      for (col = 0; col < size; col += 1) {
        box = [];
        for (towerIndex = 0; towerIndex < size; towerIndex += 1) {
          for (floorIndex = 0; floorIndex < size; floorIndex += 1) {
            box.push(
              rowMap[row * size + towerIndex][col * size + floorIndex]
            );
          }
        }
        map.push(box);
      }
    }
    return map;
  }

  return {
    newBoard: function (rank, data) {
      return new Board(rank, data);
    }
  }
}());
