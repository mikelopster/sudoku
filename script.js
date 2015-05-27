
/**
 * Navigation Module
 * ============================================================================
 */

 var Navigation = (function () {

  'use strict';

  var actives = [];

  document.addEventListener('click', function (event) {
    var item = event.target.closest('.nav-item');
    actives.forEach(function (active) {
      if (active !== item) {
        active.classList.remove('showup');
        actives.splice(actives.indexOf(active), 1);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    var nav, items;
    nav   = document.querySelector('.nav');
    items = [].slice.call(document.querySelectorAll('.nav-item'));
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (actives.indexOf(item) < 0) {
          item.classList.add('showup');
          actives.push(item);
          if (item.hasAttribute('exec')) {
            eval(item.getAttribute('exec'));
          }
        }
      });
    });
  });

}());

/**
 * Terminal Module
 * ============================================================================
 */

var Terminal = (function () {

  'use strict';

  var terminal, display, input, execute;

  function insertToDisplay(message) {
    var line, pre;
    line = document.createElement('li');
    pre  = document.createElement('pre');
    pre.textContent = '$ ' + message;
    line.classList.add('terminal-line');
    line.appendChild(pre);
    display.appendChild(line);
    display.scrollTop = display.scrollHeight;
  }

  function onEnter() {
    var command = input.value.trim();
    insertToDisplay(command);
    if (command !== '') {
      if (typeof execute !== 'undefined') {
        execute(command);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    terminal = document.querySelector('.terminal');
    display  = terminal.querySelector('.terminal-display');
    input    = terminal.querySelector('.terminal-input');
    input.addEventListener('keyup', function (event) {
      if (event.which === 13) {
        onEnter(terminal, display, input);
        input.value = '';
      }
    });
  });

  return {
    onExecute: function (callback) {
      execute = callback;
    },
    insert: function (texts) {
      texts.forEach(function (text) {
        insertToDisplay(text);
      });
    },
    clear: function () {
      while (display.firstChild) {
        display.removeChild(display.firstChild);
      }
    },
    focus: function () {
      input.focus();
    }
  };

}());

/**
 * Monitor Module
 * ============================================================================
 */

var Monitor = (function () {

  'use strict';

  var monitor, display, solve, next, check, clear, solving, nexting, checking;

  function insertToDisplay(text) {
    display.textContent += text + '\n';
    display.scrollTop    = display.scrollHeight;
  }

  document.addEventListener('DOMContentLoaded', function () {
    monitor = document.querySelector('.monitor');
    display = monitor.querySelector('.monitor-display');
    solve   = monitor.querySelector('.monitor-button.solve');
    next    = monitor.querySelector('.monitor-button.next');
    check   = monitor.querySelector('.monitor-button.check');
    clear   = monitor.querySelector('.monitor-button.clear');
    solve.addEventListener('click', function () {
      if (typeof solving !== 'undefined') {
        solving();
      }
    });
    next.addEventListener('click', function () {
      if (typeof nexting !== 'undefined') {
        nexting();
      }
    });
    check.addEventListener('click', function () {
      if (typeof checking !== 'undefined') {
        checking();
      }
    });
    clear.addEventListener('click', function () {
      display.textContent = '';
    });
  });

  return {
    onSolve: function (callback) {
      solving = callback;
    },
    onNext: function (callback) {
      nexting = callback;
    },
    onCheck: function (callback) {
      checking = callback;
    },
    insert: function (text) {
      insertToDisplay(text);
    }
  };

}());

/**
 * Board Module
 * ============================================================================
 */

var Board = (function () {

  'use strict';

  var board, map, options;

  options = {
    size   : undefined,
    sqSize : undefined,
    xWidth : 18
  };

  function generateMap() {
    map = {};
    map.board = board;
    map.boxs  = [].slice.call(board.querySelectorAll('.board-box'));
    map.boxs.forEach(function (box) {
      box.cells = [].slice.call(box.querySelectorAll('.board-cell'));
      box.cells.forEach(function (cell) {
        cell.point = cell.querySelector('.board-point');
        cell.marks = [].slice.call(cell.querySelectorAll('.board-mark'));
      });
    });
  }

  function draftData() {
    var boxs, cells, sqSize, boxIndex, cellIndex;
    sqSize = options.size * options.size;
    boxs   = [];
    for (boxIndex = 0; boxIndex < sqSize; boxIndex += 1) {
      cells = [];
      for (cellIndex = 0; cellIndex < sqSize; cellIndex += 1) {
        cells.push({
          point : undefined,
          marks : []
        });
      }
      boxs.push({ cells: cells });
    }
    return { boxs: boxs };
  }

  function mapping(data) {
    data.boxs.forEach(function (box, b) {
      box.cells.forEach(function (cell, c) {
        if (typeof cell.point !== 'undefined') {
          map.boxs[b].cells[c].point.textContent = cell.point;
        }
        cell.marks.forEach(function (mark, m) {
          if (typeof mark !== 'undefined') {
            map.boxs[b].cells[c].marks[m].textContent = mark;
          }
        });
      });
    });
  }

  function pointing(data) {
    map.boxs.forEach(function (box, b) {
      box.cells.forEach(function (cell, c) {
        if (data.boxs[b].cells[c].point) {
          map.boxs[b].cells[c].point.classList.add('given');
        }
      });
    });
  }

  function backgroundColoring() {
    var cells, choices, index;
    cells   = board.querySelectorAll('.board-cell');
    choices = ['white', 'black'];
    for (index = 0; index < cells.length; index += 1) {
      if (!(options.size % 2) && !(index % options.size)) {
        choices.push(choices.shift());
      }
      cells[index].classList.add(choices[index % 2]);
    }
  }

  function setStyle(element, type, position) {
    element.classList.add('board-' + type);
    if (typeof position !== 'undefined') {
      element.classList.add(
        ['float-clear', 'float'][(position % options.size) && 1]
      );
    }
  }

  function createMarks(cell) {
    var mark, index;
    for (index = 0; index < options.sqSize; index += 1) {
      mark = document.createElement('div');
      cell.appendChild(mark);
      setStyle(mark, 'mark', index);
    }
  }

  function createCells(box) {
    var cell, point, index;
    for (index = 0; index < options.sqSize; index += 1) {
      cell  = document.createElement('div');
      point = document.createElement('div');
      point.setAttribute('contentEditable', 'true');
      cell.appendChild(point);
      box.appendChild(cell);
      createMarks(cell);
      setStyle(cell, 'cell', index);
      setStyle(point, 'point');
    }
  }

  function createBoxs(board) {
    var box, index;
    for (index = 0; index < options.sqSize; index += 1) {
      box = document.createElement('div');
      board.appendChild(box);
      createCells(box);
      setStyle(box, 'box', index);
    }
  }

  function createBoard(size) {
    var container, scroller;
    options.size   = size;
    options.sqSize = size * size;
    createBoxs(board);
    container = board.parentNode;
    scroller  = container.parentNode;
    container.style.width = size * size * size * options.xWidth + 'px';
    scroller.scrollLeft   = (scroller.scrollWidth - scroller.clientWidth) / 2;
    backgroundColoring();
    generateMap();
  }

  function newBoard() {
    var newBoard = document.createElement('div');
    newBoard.classList.add('board')
    board.parentNode.replaceChild(newBoard, board);
    board = newBoard;
  }

  document.addEventListener('DOMContentLoaded', function () {
    board = document.querySelector('.board');
  });

  return {
    reCreate: function (size) {
      newBoard();
      createBoard(size);
    },
    fillData: function (data) {
      mapping(data);
    },
    givenData: function (data) {
      pointing(data);
    },
    getData: function () {
      var data, boxIndex, cellIndex, sqSize;
      data   = draftData();
      sqSize = options.size * options.size;
      for (boxIndex = 0; boxIndex < sqSize; boxIndex += 1) {
        for (cellIndex = 0; cellIndex < sqSize; cellIndex += 1) {
          data.boxs[boxIndex].cells[cellIndex].point =
          map.boxs[boxIndex].cells[cellIndex].point.textContent;
        }
      }
      return data;
    },
    getDraftData: function () {
      return draftData();
    }
  };

}());

/**
 * Polyfill closest
 * ============================================================================
 * by https://github.com/jonathantneal/closest
 */

(function (ELEMENT) {
  ELEMENT.matches = ELEMENT.matches
    || ELEMENT.msMatchesSelector
    || ELEMENT.mozMatchesSelector
    || ELEMENT.webkitMatchesSelector;
  ELEMENT.closest = ELEMENT.closest || function (selector) {
    var node = this;
    while (node) {
      if (node.matches(selector)) {
        break;
      }
      node = node.parentElement;
    }
    return node;
  };
}(Element.prototype));
