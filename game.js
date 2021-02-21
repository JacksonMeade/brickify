
//'use strict';
var gameRun = false;
var head = document.getElementsByTagName('head')[0];

var board = document.getElementsByTagName('body')[0];
var overlay = '<div id="sources"></div><script type = "text/javascript"></script>' + "\n" + board.innerHTML;
document.addEventListener('click', function () {
  if (!gameRun) {
    runGame(DOMDisplay);
    gameRun = true;
  }
});
board.innerHTML = overlay;

///////////////////////////////////////////////////// ACTUAL GAME CODE //////////////////////////////////////////////////////
// Credit where it's due:
// 2D Physics, Collisions, and Geometry sourced from EloquentJavascript.net, Chapter 16 [MIT License] (https://eloquentjavascript.net/code/LICENSE)
// Other Game Source Code, including digging, webpage analysis, map building, and summary by Jackson Meade for BrickHack


var BRICKSIZE = 30;
var FIT_W = Math.floor(window.innerWidth / BRICKSIZE);
var FIT_H = Math.floor(window.innerHeight / BRICKSIZE);
var SCALE = window.innerWidth / FIT_W;

var PAGE_LINKS = [];

//Returns a Promise
function summarizeSite(url) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://brixapi.herokuapp.com/api/get/summary?url="+url, requestOptions)
    .then(response => response.text())
    .then(function (res) {
      return res;
    })
    .catch(error => console.log('error', error));
}

//Returns a Promise
function citeSite(url) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://brixapi.herokuapp.com/api/get/citation?url="+url, requestOptions)
    .then(response => response.text())
    .then(function (result) {
      return result;
    })
    .catch(error => console.log('error', error));
}

function CreateMap() {
  // console.log("CreateMap() called. \n FIT_H: " + FIT_H + "\n FIT_W: " + FIT_W);
  var assembly = "";
  for (var i = 0; i < FIT_H; i++) {
    for (var j = 0; j < FIT_W; j++) {
      // console.log("Adding item...");
      if (i == 1 && j == Math.floor(FIT_W / 2)) {
        assembly += "@";
      }
      else if (i > 3) {
        if (assembly[FIT_W * (i - 2) + j] == "#" || (Math.random() <= ((i - 4) / 10))) {
          assembly += "#";
        }
        else {
          assembly += ".";
        }
      }
      else {
        assembly += ".";
      }
    }
    assembly += "\n";
    // console.log("Assembly is now... \n" + assembly);
  }

  return LinkLinks(assembly);
}

function LinkLinks(map) {

  var final = map;

  for (var link of document.getElementsByTagName('a')) {
    if (InView(link)) {
      var rect = link.getBoundingClientRect();
      var loc = Griddle(rect.x, rect.y);
      PAGE_LINKS.push(new Link(loc[0], loc[1], link.href));
      var indexOfChoice = FindCell(loc[0], loc[1]);
      if (final.charAt(indexOfChoice) != "@") {
        //console.log("Replacing at " + indexOfChoice + " from: \n" + map);
        final = final.replaceAt(indexOfChoice, "o");
        //console.log("MAP IS NOW \n" + map);
      }
    }
  }


  return final;
}

// this function regulates the x and y coordinates of an item to the 2D game grid
function Griddle(x, y) {

  var transformX = Math.floor((x / window.innerWidth) * FIT_W);

  var transformY = Math.floor((y / window.innerHeight) * FIT_H);

  return [transformX, transformY];
}

class Link {
  constructor(x, y, url) {
    this.x = x;
    this.y = y;
    this.url = url;

  }
}

// Find where a cell is on the grid
function FindCell(x, y) {
  return ((((y - 1) >= 0) ? (y - 1) : 0) * FIT_W) + x + y;
}

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function InView(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// DIGGING GAME CODE
var VIEW = null;
var LEV = null;

var Level = class Level {
  constructor(plan) {
    //console.log("Constructing Level now...");
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type == "string") return type;
        this.startActors.push(
          type.create(new Vec(x, y), ch));
        return "empty";
      });
    });
  }
}

var State = class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    //console.log("Return new State(" + level + ", " + level.startActors + ", " + "'playing')");
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}

var Vec = class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

var Player = class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.8)),
      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(1.5, 0.8);

var Lava = class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);

var Coin = class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
      Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);

var levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}

function rmv(name) {
  let dom = document.getElementsByClassName(name);
  for (let item of dom) {
    item.remove();
  }
}

var DOMDisplay = class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", { class: "game" }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}

function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * SCALE}px`
  }, ...level.rows.map(row =>
    elt("tr", { style: `height: ${SCALE}px` },
      ...row.map(type => elt("td", { class: type })))
  ));
}

function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", { class: `actor ${actor.type}` });
    rect.style.width = `${actor.size.x * SCALE}px`;
    rect.style.height = `${actor.size.y * SCALE}px`;
    rect.style.left = `${actor.pos.x * SCALE}px`;
    rect.style.top = `${actor.pos.y * SCALE}px`;
    return rect;
  }));
}


DOMDisplay.prototype.syncState = function (state) {

  if (this.dom == null) {
    this.dom = elt("div", { class: "game" }, drawGrid(LEV));
  }

  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // The viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
    .times(SCALE);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};

Level.prototype.touches = function (pos, size, type, remove = false) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
        y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (remove) {
        if (here == type) {
          if (this.rows[y] != null) {
            this.rows[y][x] = "empty";

            var tables = document.getElementsByClassName("background");
            for (var table of tables) {
              let ofInterest = table.childNodes.item(y).childNodes.item(x);
              if (ofInterest) {
                ofInterest.classList.remove("wall");
                ofInterest.classList.add("empty");
              }
            }
          }
        }
      }
      else {
        if (here == type) return true;
      }
    }
  }
  return false;
};

State.prototype.update = function (time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};

function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y;
}

Lava.prototype.collide = function (state) {
  return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function (state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};

Lava.prototype.update = function (time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};

var wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function (time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
    this.basePos, wobble);
};

var playerXSpeed = 7;
var gravity = 30;
var jumpSpeed = 17;

Player.prototype.update = function (time, state, keys) {
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;

  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  state.level.touches(movedX, this.size, "wall", (keys.d));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  state.level.touches(movedY, this.size, "wall", (keys.d));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};

function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

var arrowKeys =
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp", "d"]);

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display) {
  //console.log("Running Level");
  VIEW = new Display(document.body, level);
  //console.log("Starting state...");
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      VIEW.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        VIEW.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

function runGame(Display) {
  //console.log("Running Game");
  var levelMap = CreateMap();
  //console.log("Created Map: " + levelMap);
  //console.log("Building Level...");
  LEV = new Level(levelMap);
  //console.log("Built level at " + LEV);
  let status = runLevel(LEV,
    Display);
}