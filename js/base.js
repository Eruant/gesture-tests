/*globals navigator, document*/

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.msGetUserMedia || undefined);

var GestureSource = function (id) {

  if (!navigator.getUserMedia) {
    return false;
  }

  this.el = id;

  navigator.getUserMedia({
    video: true,
    audio: false
  }, this.success.bind(this), this.error.bind(this));

};

GestureSource.prototype.success = function (stream) {

  this.video = document.getElementById(this.el);

  this.video.autoplay = true;
  this.video.src = (window.webkitURL) ? window.webkitURL.createObjectURL(stream) : stream;

  this.createCanvas();
  window.requestAnimationFrame(this.update.bind(this));
};

GestureSource.prototype.error = function () {
  window.alert('No media avalable');
};

GestureSource.prototype.createCanvas = function () {

  this.canvasRaw = document.createElement('canvas');
  this.canvasRaw.width = this.video.width || 640;
  this.canvasRaw.height = this.video.height || 480;
  this.ctxRaw = this.canvasRaw.getContext('2d');

  // mirror image
  this.ctxRaw.translate(this.canvasRaw.width, 0);
  this.ctxRaw.scale(-1, 1);

  this.canvasMovemement = document.createElement('canvas');
  this.canvasMovemement.width = this.video.width || 640;
  this.canvasMovemement.height = this.video.height || 480;
  this.ctxMovemement = this.canvasMovemement.getContext('2d');

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.video.width || 640;
  this.canvas.height = this.video.height || 480;
  this.ctx = this.canvas.getContext('2d');

  document.getElementsByTagName('body')[0].appendChild(this.canvas);
};

GestureSource.prototype.update = function () {

  //this.clear();
  this.drawVideo();
  this.blend();
  this.render();

  window.requestAnimationFrame(this.update.bind(this));

};

GestureSource.prototype.drawVideo = function () {
  this.ctxRaw.drawImage(this.video, 0, 0, this.video.width, this.video.height);
};

GestureSource.prototype.blend = function () {
  var width = this.canvasRaw.width;
  var height = this.canvasRaw.height;
  // get webcam image data
  var sourceData = this.ctxRaw.getImageData(0, 0, width, height);
  // create an image if the previous image doesn’t exist
  if (!this.lastImageData) {
    this.lastImageData = this.ctxRaw.getImageData(0, 0, width, height);
  }
  // create a ImageData instance to receive the blended result
  var blendedData = this.ctxRaw.createImageData(width, height);
  // blend the 2 images
  this.differenceAccuracy(blendedData.data, sourceData.data, this.lastImageData.data);
  // draw the result in a canvas
  this.ctxMovemement.putImageData(blendedData, 0, 0);
  // store the current webcam image
  this.lastImageData = sourceData;
};

GestureSource.prototype.fastAbs = function (value) {
  // equivalent to Math.abs();
  return (value ^ (value >> 31)) - (value >> 31);
};

GestureSource.prototype.difference = function (target, data1, data2) {

  var i;

  if (data1.length !== data2.lenght) {
    return null;
  }

  i = 0;
  while (i < (data1.length * 0.25)) {
    target[4 * i] = data1[4 * i] === 0 ? 0 : this.fastAbs(data1[4 * i] - data2[4 * i]);
    target[4 * i + 1] = data1[4 * i + 1] === 0 ? 0 : this.fastAbs(data1[4 * i + 1] - data2[4 * i + 1]);
    target[4 * i + 2] = data1[4 * i + 2] === 0 ? 0 : this.fastAbs(data1[4 * i + 2] - data2[4 * i + 2]);
    target[4 * i + 3] = 0xFF;
    ++i;
  }
};

GestureSource.prototype.threshold = function (value) {
  return (value > 0x15) ? 0xFF : 0;
};

GestureSource.prototype.differenceAccuracy = function (target, data1, data2) {
  if (data1.length !== data2.length) {
    return null;
  }
  var i = 0;
  while (i < (data1.length * 0.25)) {
    var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
    var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
    var diff = this.threshold(this.fastAbs(average1 - average2));
    target[4 * i] = diff;
    target[4 * i + 1] = diff;
    target[4 * i + 2] = diff;
    target[4 * i + 3] = 0xFF;
    ++i;
  }
};

GestureSource.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

GestureSource.prototype.render = function () {

  // draw data from this.canvasMovemement
  this.ctx.drawImage(this.canvasMovemement, 0, 0);
  
};

var app = new GestureSource('webcam');
console.log(app);
