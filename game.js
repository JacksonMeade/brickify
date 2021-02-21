'use strict';

var board = document.getElementsByTagName('body')[0];
var overlay = "<div id=\"overlay\">" + board.innerHTML + "</div>";

board.innerHTML = overlay;