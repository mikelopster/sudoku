
/**
 * Default Text
 * ============================================================================
 */

var defaultTexts = [
  '',
  'Welcome to',
  '                                                                     ',
  ':::::::::   :::   :::   :::::::     :::::::::   :::   :::   :::   :::',
  ':::         :::   :::   :::   :::   :::   :::   :::   :::   :::   :::',
  '::::::      :::   :::   :::   :::   :::   :::   ::::::::    :::   :::',
  '   ::::::   :::   :::   :::   :::   :::   :::   :::   :::   :::   :::',
  ':::::::::   :::::::::   :::::::     :::::::::   :::   :::   :::::::::',
  '                                                                     ',
  '                                                          version 0.1',
  'Type \'help\' to see the basic commands.',
  ''
];

var helpTexts = [
  'Help commands',
  ' - help -- see help',
  ' - clear -- clear screen',
  ' - show -- show options',
  ' - build -- build board',
  ' - level \'easy\' | \'medium\' | \'hard\' | \'evil\' -- set specific level',
  ' - rank n -- set specific rank to n (n**2 * n**2)',
  ' - generate -- generate board',
  ' - keep -- keep current board',
  ' - board x -- set specific board in json format'
];

/**
 * Render Module
 * ============================================================================
 */

var Renderer = (function () {

  'use strict';

  var constant = {
    levels    : ['easy', 'medium', 'hard', 'evil'],
    digRanges : [[32, 45], [46, 49], [50, 53], [54, 58]]
  };

  var options = {
    level     : 'easy',
    rank      : 3,
    step      : undefined,
    board     : undefined,
    markBord  : undefined
  };

  function fillBoard() {
    var data, map, markMap, boxIndex, cellIndex, sqSize;
    data    = Board.getDraftData();
    map     = options.board.toBoxHouse();
    markMap = options.markBoard.toBoxHouse();
    sqSize  = options.rank * options.rank;
    for (boxIndex = 0; boxIndex < sqSize; boxIndex += 1) {
      for (cellIndex = 0; cellIndex < sqSize; cellIndex += 1) {
        data.boxs[boxIndex].cells[cellIndex] = {
          point : map[boxIndex][cellIndex],
          marks : markMap[boxIndex][cellIndex]
        }
      }
    }
    Board.fillData(data);
  }

  function givenBoard() {
    var data, map, markMap, boxIndex, cellIndex, sqSize;
    data    = Board.getDraftData();
    map     = options.board.toBoxHouse();
    sqSize  = options.rank * options.rank;
    for (boxIndex = 0; boxIndex < sqSize; boxIndex += 1) {
      for (cellIndex = 0; cellIndex < sqSize; cellIndex += 1) {
        data.boxs[boxIndex].cells[cellIndex] = {
          point : map[boxIndex][cellIndex] === '' ? false : true
        }
      }
    }
    Board.givenData(data);
    fillBoard();
  }

  function generateBoard(generate) {
    var dig, min, max;
    min = constant.digRanges[constant.levels.indexOf(options.level)][0];
    max = constant.digRanges[constant.levels.indexOf(options.level)][0];
    dig = Math.floor(Math.random() * (max - min + 1)) + min;
    return Generator.generate(options.rank, dig);
  }

  function buildBoard() {
    options.step = 0;
    options.markBoard = SudokuBoard.newMarkBoard(options.rank);
    if (typeof options.board === 'undefined') {
      options.board = SudokuBoard.newBoard(options.rank);
    }
    givenBoard();
  }

  function handleTerminal() {
    Terminal.onExecute(function (command) {
      var tokens = command.split(' ');
      if (tokens[0] === 'clear' && tokens.length === 1) {
        Terminal.clear();
        return;
      }
      if (tokens[0] === 'show' && tokens.length === 1) {
        Terminal.insert([
          'options: {',
          '  level : ' + options.level,
          '  rank  : ' + options.rank,
          '}'
        ]);
        return;
      }
      if (tokens[0] === 'build' && tokens.length === 1) {
        Monitor.insert('- Build Board!');
        Board.reCreate(options.rank);
        buildBoard();
        return;
      }
      if (tokens[0] === 'level' && tokens.length === 2) {
        if (constant.levels.indexOf(tokens[1]) >= 0) {
          options.level = tokens[1];
          return;
        }
      }
      if (tokens[0] === 'rank' &&  tokens.length === 2) {
        if (tokens[1] !== '3') {
          Terminal.insert(['Sory, now rank only can be 3.']);
          return;
        }
        if (!isNaN(parseInt(tokens[1]))) {
          options.rank = parseInt(tokens[1]);
          return;
        }
      }
      if (tokens[0] === 'generate' && tokens.length === 1) {
        options.board = generateBoard();
        return;
      }
      if (tokens[0] === 'keep' && tokens.length === 1) {
        var data, map, size, sqSize;
        data   = Board.getData();
        map    = [];
        size   = options.rank;
        sqSize = size * size;
        if (typeof options.board === 'undefined') {
          Terminal.insert(['Error board not found.']);
          return;
        }
        data.boxs.forEach(function (box, b) {
          var rowOffset, colOffset, boxOffset;
          rowOffset = Math.floor(b / size) * sqSize * size;
          colOffset = (b % size) * size;
          boxOffset = rowOffset + colOffset;
          box.cells.forEach(function (cell, c) {
            var rowOffset, colOffset, cellOffset;
            rowOffset  = Math.floor(c / size) * sqSize;
            colOffset  = c % size;
            cellOffset = rowOffset + colOffset;
            map[boxOffset + cellOffset] = cell.point;
          });
        });
        options.board = SudokuBoard.newBoard(options.rank, map);
        return;
      }
      if (tokens[0] === 'board' &&  tokens.length === 2) {
        try {
          options.board = SudokuBoard.newBoard(
            options.rank,
            JSON.parse(tokens[1])
          );
        } catch (error) {
          Terminal.insert(['Error input is not json format.']);
        }
        return;
      }
      Terminal.insert(helpTexts);
    });
    Terminal.insert(defaultTexts);
  }

  function handleMonitor() {
    Monitor.onSolve(function () {
      Monitor.insert('- Solve!');
      Solver.makeSolve(options.board, false, function (judge) {
        var result = judge ? 'completed' : 'not completed';
        Monitor.insert(
          '   Solve result is ' + result + '.'
        );
      });
      options.board = Solver.getSuccessBoard();
      fillBoard();
    });
    Monitor.onNext(function () {
      Monitor.insert('- Solved step!');
      if (options.step === 0) {
        Solver.makeSolve(options.board, true);
      }
      options.board     = Solver.getLogBoard(options.step);
      options.markBoard = Solver.getLogMarkBoard(options.step);
      Monitor.insert('   ' + Solver.getLogAction(options.step));
      options.step += 1;
      fillBoard();
    });
    Monitor.onCheck(function () {
      var judge = SudokuBoard.checkBoard(options.board);
      Monitor.insert('- Check Board!\n   This board is ' + judge + '.');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    handleTerminal();
    handleMonitor();
  });
}());
