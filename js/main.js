// clmtrackr diagram: http://auduno.github.io/clmtrackr/media/facemodel_numbering_new.png
var leftEye = 27;
var rightEye = 32;

var mouse, amp, fft, filter, positions, moveref;
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


function preload() {
  // serve sound file
  soundFormats('m4a');
  sound = loadSound('assets/circling.m4a');
}

function setup() {

  mouse = createVector(mouseX, mouseY);
  createCanvas(windowWidth, windowHeight);

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
  var level = amp.getLevel();
  var size = map(level, 0, 1, 0, 20);

  // check if average is constantly smaller than beatThreshold 
    // if so, set beat threshold to average

  positions = positionLoop();
  var length = positions.length;

  detectBeat(level, 19);
  drawStrike(size);

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

function detectBeat(level, length) {
  frameSince++;
  flock.run(flockColor);
  if (level > beatThreshold){
    onBeat(length);
    frameSince = 0;
    drawCircles();
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
        x1 = positions[list[k]][0];
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

function drawCircles() {
  if (positions[leftEye] !== undefined && positions[rightEye] !== undefined){
    var xl = positions[leftEye][0];
    var yl = positions[leftEye][1];
    var xr = positions[rightEye][0];
    var yr = positions[rightEye][1];
    var ra = random(80, 140);

    fill(0);
    stroke(bright);

    ellipse(xl, yl, ra, ra);
    ellipse(xr, yr, ra, ra);
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
      ellipse(positions[j][0], positions[j][1], 1, 1);
      if (outline) {
        stroke(superDark);
        line(positions[j][0], positions[j][1], positions[start][0], positions[start][1]);
      }
    }  
  }
}

function changeColor(amp) {
  console.log(amp);
  var lo = amp * 3;
  var r = random(lo, 255);
  var g = random(lo, 255);
  var b = random(lo, 255);
  dark = color(r, g, b);
}


// function drawPerp() {

//   if (positions){
//     var seed = random(0, 1);
//     for (var i = 0; i < 15; i++){
//       if (seed <= 0.25) {
//         stroke(dark);
//         line(positions[i][0], positions[i][1], positions[i][0], windowHeight);
//       }
//       else if (seed <= 0.5) {
//         stroke(dark);
//         line(positions[i][0], positions[i][1], positions[i][0], 0);
//       }
//       else if (seed <= 0.75) {
//         stroke(dark);
//         line(positions[i][0], positions[i][1], windowWidth, positions[i][1]);
//       }
//       else {
//         stroke(dark);
//         line(positions[i][0], positions[i][1], 0, positions[i][1]);
//       }
//     }
//   }
// }