
var videoInput = document.getElementById('video');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

if (navigator.getUserMedia) {       
  navigator.getUserMedia({video: true}, handleVideo, videoError);
}

var ctracker = new clm.tracker();
ctracker.init(pModel);
ctracker.start(videoInput);

// var canvasInput = document.getElementById('canvas');
// var cc = canvasInput.getContext('2d');

function handleVideo(stream) {
  videoInput.src = window.URL.createObjectURL(stream);
}
 
function videoError(err) {
  throw err;
}

function positionLoop() {
  requestAnimationFrame(positionLoop);
  return ctracker.getCurrentPosition();
}

// function drawLoop() {
//   requestAnimationFrame(drawLoop);
//   cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
//   ctracker.draw(canvasInput);
// }

// drawLoop();