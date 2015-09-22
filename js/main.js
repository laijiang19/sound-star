var mouse;
var count = 0;
var start = 27;
var playing = false;

function preload() {
  // serve sound file
  soundFormats('m4a');
  sound = loadSound('assets/circling.m4a');
}

function setup() {

  mouse = createVector(mouseX, mouseY);
  createCanvas(windowWidth, windowHeight);

  noStroke();
  fill(255);
  rectMode(CENTER);
  background(0);

  colorA = color(48,222,179);

  amp = new p5.Amplitude();
  
  frameRate(5);
}

function draw() {
  background(0);

  var level = amp.getLevel();
  var size = map(level, 0, 1, 0, 20);

  var positions = positionLoop();
  var length = positions.length;
  if (size > 4){
    start = Math.floor(random(0, length - 1));  
    count = 0;
  }
  for (var j = 0; j < length; j++){
    start = start || 27;
    ellipse(positions[j][0], positions[j][1], 2, 2);
    stroke(255);
    line(positions[j][0], positions[j][1], positions[start][0], positions[start][1]);
  }

  var list = randomIndex(19, size);

  if (size) {
    for (var k = 0; k < list.length; k++){ 
      x1 = positions[list[k]][0];
      y1 = positions[list[k]][1];

      for (var i = 0; i < size; i++){
        var noiseRaw = noise(x1, y1);
        var noiseRot = map(noiseRaw, 0.2, 0.8, 0, PI*2 );
        var x2 = x1 + sin(noiseRot) * random(size * 20, size * 40);
        var y2 = y1 + cos(noiseRot) * random(size * 20, size * 40);

        stroke(255);
        line(x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
      }
    }
  }
}

function mousePressed() {
  if (!playing) {
    sound.play();
    playing = true;
  }
  else {
    sound.pause();
    playing = false;
  }
}

function randomIndex(limit, num) {
  num = num || 1;
  var res = [];
  for (var i = 0; i < num; i++){
    res.push(Math.floor(random(0, limit)));
  }
  return res;
}