
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
  ' - generate -- generate board',
  ' - level \'easy\' | \'medium\' | \'hard\' | \'evil\' -- set specific level',
  ' - rank n -- set specific rank to n (n**2 * n**2)',
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
    var map, markMap, data, box, boxIndex, cellIndex, sqSize;
    map       = options.board.toBoxHouse();
    markMap   = options.markBoard.toBoxHouse();
    sqSize    = options.rank * options.rank;
    data      = {};
    data.boxs = [];
    for (boxIndex = 0; boxIndex < sqSize; boxIndex += 1) {
      box = [];
      box.cells = [];
      for (cellIndex = 0; cellIndex < sqSize; cellIndex += 1) {
        box.cells.push({
          point : map[boxIndex][cellIndex],
          marks : markMap[boxIndex][cellIndex]
        });
      }
      data.boxs.push(box);
    }
    console.log(data);
    Board.fillData(data);
  }

  function generateBoard(generate) {
    var dig, min, max;
    min = constant.digRanges[constant.levels.indexOf(options.level)][0];
    max = constant.digRanges[constant.levels.indexOf(options.level)][0];
    dig = Math.floor(Math.random() * (max - min + 1)) + min;
    if (generate) {
      options.board = Generator.generate(options.rank, dig);
    }
    options.step      = 0;
    options.markBoard = SudokuBoard.newMarkBoard(options.rank);
    fillBoard();
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
          '  level     : ' + options.level,
          '  rank      : ' + options.rank,
          '  board     : [ ... ]',
          '  markBoard : [ ... ]',
          '}'
        ]);
        return;
      }
      if (tokens[0] === 'generate' && tokens.length === 1) {
        Board.reCreate(options.rank);
        Monitor.insert('- Generate Board!');
        generateBoard(true);
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
      if (tokens[0] === 'board' &&  tokens.length === 2) {
        Board.reCreate(options.rank);
        options.board = SudokuBoard.newBoard(
          options.rank,
          JSON.parse(tokens[1])
        );
        generateBoard(false);
        try {

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
      Monitor.insert('- Solve next Step!');
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
