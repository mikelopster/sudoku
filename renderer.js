
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
  ' - rank n -- set specific rank to n (n**2 * n**2)'
];

/**
 * Render Module
 * ============================================================================
 */

var Renderer = (function () {

  'use strict';

  var constant = {
    levels: ['easy', 'medium', 'hard', 'evil']
  };

  var options = {
    level : 'easy',
    rank  : 3
  };

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
      if (tokens[0] === 'generate' && tokens.length === 1) {
        Board.reCreate(options.rank);
        Monitor.insert('Generate Board!');
        return;
      }
      if (tokens[0] === 'level' && tokens.length === 2) {
        if (constant.levels.indexOf(tokens[1]) >= 0) {
          options.level = tokens[1];
          return;
        }
      }
      if (tokens[0] === 'rank' &&  tokens.length === 2) {
        if (!isNaN(parseInt(tokens[1]))) {
          options.rank = parseInt(tokens[1]);
          return;
        }
      }
      Terminal.insert(helpTexts);
    });
    Terminal.insert(defaultTexts);
  }

  document.addEventListener('DOMContentLoaded', function () {
    handleTerminal();
  });
}());
