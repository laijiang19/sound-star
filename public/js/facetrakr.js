  var videoInput = document.getElementById('video');
  
  console.log(videoInput);

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {       
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
   
  function handleVideo(stream) {
    videoInput.src = window.URL.createObjectURL(stream);
  }
   
  function videoError(err) {
    throw err;
  }

  var ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput);
  
  function positionLoop() {
    requestAnimationFrame(positionLoop);
    var positions = ctracker.getCurrentPosition();
    // do something with the positions ...
    // print the positions
    var positionString = "";
  }
  positionLoop();
  
  var canvasInput = document.getElementById('canvas');
  var cc = canvasInput.getContext('2d');
  function drawLoop() {
    requestAnimationFrame(drawLoop);
    cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
    ctracker.draw(canvasInput);
  }
  drawLoop();