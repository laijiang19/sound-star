// clmtrackr diagram: http://auduno.github.io/clmtrackr/media/facemodel_numbering_new.png
var leftEye = 27;
var rightEye = 32;

var canvas;
var mouse, amp, fft, filter, positions, moveref, level, size;
var count = 0;
var start = leftEye;
var playing = false;
var beatThreshold = 0.27;
var frameSince = 0;
var frameCutOff = 2;
var bg = 0;
var bright = 255;
var dark = 100;
var superDark = 40;
var flockColor = 0;
var offset = 300;

var eyeChange = false;
var eyeShape;
var eyeCount = 0;

var triangles = [];
var triCount = 0;
var triCall = false;
var rTris = [];
var roTriCount = 0;
var roTriCall = false;

var play, effects, eyes, style, pause;

function preload() {
  // serve sound file
  soundFormats('m4a');
  sound = loadSound('assets/circling.m4a');
}

function setup() {

  eyeShape = ellipse;

  canvas = createCanvas(windowWidth, windowHeight);

  play = createButton('play').addClass('control');
  play.position(150, 100);
  play.mousePressed(startEverything);

  pause = createButton('pause').addClass('control');
  pause.position(150, 100);
  pause.mousePressed(startEverything);
  pause.hide();

  effects = createButton('effects').addClass('control');
  effects.position(150, 140);
  effects.mousePressed(function(){
    if (random(0, 1) >= 0.5) {
      triCall = true;
    }
    else {
      roTriCall = true;    
    }
  });
  effects.hide();

  eyes = createButton('eyes').addClass('control');
  eyes.position(150, 180);
  eyes.mousePressed(function(){
    eyeCount++;
    if (eyeCount % 3 === 0) {
      eyeShape = ellipse;
    }
    else if (eyeCount % 3 === 1) {
      eyeShape = rect;
    }
    else if (eyeCount % 3 === 2) {
      eyeShape = star;
    }
  });
  eyes.hide();

  // style = createButton('style').addClass('control');
  // style.position(150, 220);
  // style.hide();

  noStroke();
  fill(bright);
  rectMode(CENTER);
  background(0);

  amp = new p5.Amplitude();
  fft = new p5.FFT();
  filter = new p5.LowPass();

  // sound.disconnect();
  // sound.connect(filter);

  frameRate(20);

  flock = new Flock();
  for (var i = 0; i < 100; i++) {
    var b = new Boid(width/2,height/2);
    flock.addBoid(b);
  }
}

function draw() {
  
  background(0);
  level = amp.getLevel();
  size = map(level, 0, 1, 0, 20);

  // check if average is constantly smaller than beatThreshold 
    // if so, set beat threshold to average

  positions = positionLoop();
  var length = positions.length;

  // for (var n = 0; n < length; n++) {
  //   positions[n][0] += 50;
  // }

  detectBeat(level, 19);
  drawStrike(size);

  // debugger;
  // triangle group 
  triangleLoop();
  roTriLoop();
}

function startEverything() {
  if (!playing) {
    sound.play();
    playing = true;
    play.hide();
    pause.show();
    // style.show();
    effects.show();
    eyes.show();
  }
  else {
    sound.pause();
    playing = false;
    play.show();
    pause.hide();
    // style.hide();
    effects.hide();
    eyes.hide();
  }
}

// function mousePressed() {
// }

function randomIndex(limit, num) {
  num = num || 1;
  var res = [];
  for (var i = 0; i < num; i++){
    res.push(Math.floor(random(0, limit)));
  }
  return res;
}

function detectBeat(level, length) {
  frameSince++;
  flock.run(flockColor);
  if (level > beatThreshold){
    onBeat(length);
    frameSince = 0;
    drawCircles(eyeShape);
    if (frameSince < frameCutOff) {
      drawFace(true);
      flockColor = dark;
      return;
    }
  }
  else {
    flockColor = bg;
  }
  drawFace();
}

function onBeat(length) {
  start = Math.floor(random(1, length - 1));  
  count = 0;
}

function drawStrike(size) {
  var list = randomIndex(19, size);

  if (size !== 0) {
    for (var k = 0; k < list.length; k++){ 
      if (positions[list[k]] !== undefined){
        x1 = positions[list[k]][0] + offset;
        y1 = positions[list[k]][1];
      }
      else {
        x1 = 500;
        y1 = 500;
      }

      var boolean = random(0, 1) > 0.5 ? true : false;

      for (var i = 0; i < size; i++){
        var noiseRaw = noise(x1, y1);
        var noiseRot = map(noiseRaw, 0.2, 0.8, 0, PI*2 );
        var x2 = x1 + sin(noiseRot) * random(size * 20, size * 40);
        var y2 = y1 + cos(noiseRot) * random(size * 20, size * 40);
        var r = random(2, 5);
        fill(0);
        ellipse(x2, y1, r, r);
        if (boolean) {
          stroke(dark);
          line(x1, y1, x2, y2);
        }
        x1 = x2;
        y1 = y2;
      }
    }
  }
}

function drawCircles(shape) {
  if (positions[leftEye] !== undefined && positions[rightEye] !== undefined){
    var xl = positions[leftEye][0] + offset;
    var yl = positions[leftEye][1];
    var xr = positions[rightEye][0] + offset;
    var yr = positions[rightEye][1];
    var ra = random(80, 140);

    fill(0);
    stroke(bright);

    shape(xl, yl, ra, ra);
    shape(xr, yr, ra, ra);
  }
}

function drawFace(outline) {
  if (positions){
    var length = positions.length;
    if (moveref !== undefined){
      var distance = dist(moveref[0], moveref[1], positions[leftEye][0], positions[leftEye][1]);
      if (distance > 5) {
        changeColor(distance);
      }
      else {
        dark = 100;
      }
    }
    moveref = positions[leftEye];

    for (var j = 0; j < length; j++){
      start = start || leftEye;
      stroke(bright);
      ellipse(positions[j][0] + offset, positions[j][1], 1, 1);
      if (outline) {
        stroke(superDark);
        line(positions[j][0] + offset, positions[j][1], positions[start][0] + offset, positions[start][1]);
      }
    }  
  }
}

function changeColor(amp) {
  var lo = amp * 3;
  var r = random(lo, 255);
  var g = random(lo, 255);
  var b = random(lo, 255);
  dark = color(r, g, b);
}

function star(x, y, radius1, radius2) {
  var angle = TWO_PI / 5;
  var halfAngle = angle/2.0;
  radius1 -= 50;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function triangleLoop() {
  if ((triCount < 25 || !triangles[0]) && triCall){
    triCount++;
    var ran = random(15, 30);
    var triTop = new Triangle(ran, windowWidth/2, 20);
    var triBottom = new Triangle(-ran, windowWidth/2, windowHeight);
    triangles.push(triTop);
    triangles.push(triBottom);
  }
  if (triangles[0]) {
    for (var i = 0; i < triangles.length; i++){
      triangles[i].update();
    }  
    if (triangles[0].lifeCount === 0){
      for (var j = 0; j < triangles.length; j++){
        triangles[j].update(bg);
      }
      triangles = [];
      triCount = 0;
      triCall = false;
    }
  } 
}

function roTriLoop() {
  if (roTriCall && (!rTris[0] || roTriCount < 30)) {
    roTriCount ++;
    var ran = random(5, 15);
    var rTriTop = new RotatingTri(-ran, windowWidth/4, windowHeight/2);
    var rTriBottom = new RotatingTri(ran, windowWidth/4, windowHeight/2);
    rTris.push(rTriTop);
    rTris.push(rTriBottom);
  }
  if (rTris[0]) {
    for (var m = 0; m < rTris.length; m++) {
      rTris[m].update();
    }
    if (rTris[0].lifeCount === 0) {
      for (var n = 0; n < rTris.length; n++) {
        rTris[n].update(bg);
      }
      rTris = [];
      roTriCount = 0;
      roTriCall = false;
    }
  }
}