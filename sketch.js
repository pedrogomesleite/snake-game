let left = [-1, 0];
let right = [1, 0];
let up = [0, -1];
let down = [0, 1];
let game;
let snake;
let size = 20;
let gameH, gameW;
let ocu = 1;
let none = 0;
let fruit = 2;
let lose = false;

class Head {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.body = [];
    this.dir = dir;
    this.firstFlag = true;
  }
  
  drawHead(game) {
    for(let member of this.body){
      member.drawBody(game);
    }
    game[this.x][this.y] = ocu;
    fill("red");
    stroke(100);
    let x = this.x * size;
    let y = this.y * size;
    rect(x, y, size);
    if(this.dir == up) {
      push()
      stroke(0);
      strokeWeight(3);
      point(x + size * 0.25, y + size * 0.2);
      point(x + size * 0.75, y + size * 0.2);
      pop();
    }
    else if(this.dir == down){
      push()
      stroke(0);
      strokeWeight(3);
      point(x + size * 0.25, y + size * 0.8);
      point(x + size * 0.75, y + size * 0.8);
      pop();
    }
    else if(this.dir == left){
      push()
      stroke(0);
      strokeWeight(3);
      point(x + size * 0.2, y + size * 0.25);
      point(x + size * 0.2, y + size * 0.75);
      pop();
    }
    else if(this.dir == right){
      push()
      stroke(0);
      strokeWeight(3);
      point(x + size * 0.8, y + size * 0.25);
      point(x + size * 0.8, y + size * 0.75);
      pop();
    }
  }
  
  move(game) {
    game[this.x][this.y] = none;
    let lastX = this.x;
    let lastY = this.y;
    
    this.x += this.dir[0];
    this.y += this.dir[1];
    
    if(this.x >= gameW) {
      this.x = 0;
    }
    else if(this.x < 0) {
      this.x = gameW - 1;
    }
    
    if(this.y >= gameH) {
      this.y = 0;
    }
    else if(this.y < 0) {
      this.y = gameH - 1;
    }
    let flag = false;
    if(game[this.x][this.y] == ocu) {
      // lose game
      lose = true;
    }
    
    else if(game[this.x][this.y] == fruit) {
      flag = true;
      createFruit(game)
    }
    
    let lastDir = this.dir;

    for(let member of this.body){
      lastX = member.x;
      lastY = member.y;
      member.move(lastDir, game);
      let aux = lastDir;
      lastDir = member.dir;
      member.setDir(aux);
    }
  
    if(flag) {
      let newMember = new Body(lastX, lastY, lastDir);
      if(this.firstFlag) {
        newMember.move(lastDir, game);
      }
      this.body.push(newMember);
      if(this.firstFlag) {
        let newMember2 = new Body(lastX, lastY, lastDir);
        this.body.push(newMember2);
        this.firstFlag = false;
      }
    }
  }
}

class Body {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }
  
  drawBody(game) {
    game[this.x][this.y] = ocu;
    fill("orange");
    let x = this.x * size;
    let y = this.y * size;
    rect(x, y, size);
  }
  
  move(dir, game) {
    print(this.dir);
    game[this.x][this.y] = none;
    
    this.x += dir[0];
    this.y += dir[1];
    if(this.x >= gameW) {
      this.x = 0;
    }
    else if(this.x < 0) {
      this.x = gameW - 1;
    }
    
    if(this.y >= gameH) {
      this.y = 0;
    }
    else if(this.y < 0) {
      this.y = gameH - 1;
    }
  }
  
  setDir(dir) {
    this.dir = dir;
  }
}

function setup() {
  createCanvas(400, 400);
  frameRate(PI);
  //frameRate(0.5);
  gameW = width / size;
  gameH = height / size;
  snake = new Head(gameW / 2, gameH / 2, up);
  game = [];
  for(let i = 0; i < gameW; i++) {
    game[i] = [];
    for(let j = 0; j < gameH; j++){
      game[i][j] = none;
    }
  }
  createFruit(game);
}

function draw() {
  background(255);
  if(lose) {
    setup();
    lose = false;
  }
  createGame(game);
  snake.drawHead(game);
  snake.move(game);
}

function createGame(game) {
  for(let i = 0; i < gameW; i++) {
    for(let j = 0; j < gameH; j++) {
      let x = i * size;
      let y = j * size;
      if(game[i][j] == none) {
        push();
        stroke(80);
        fill(255);
        rect(x, y, size);
        pop();
      }
      if(game[i][j] == fruit) {
        push();
        stroke(80);
        fill("purple");
        rect(x, y, size);
        pop();
      }
    }
  }
}

function createFruit(game) {
  let x = floor(random(0, gameW));
  let y = floor(random(0, gameH));
  while(game[x][y] == ocu) {
    x = floor(random(0, gameW));
    y = floor(random(0, gameH));
  }
  game[x][y] = fruit;
}

function keyPressed() {
  if (keyCode === 87) {
    if(snake.dir != down) {
      snake.dir = up;
    }
  } 
  else if (keyCode === 83) {
    if(snake.dir != up) {
      snake.dir = down;
    }
  }
  else if (keyCode === 65) {
    if(snake.dir != right) {
      snake.dir = left;
    }
  }
  else if (keyCode === 68) {
    if(snake.dir != left) {
      snake.dir = right;
    }
  }
  redraw();
}