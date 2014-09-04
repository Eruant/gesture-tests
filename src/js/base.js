/*globals navigator, document, $, objectdetect*/

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
  window.requestAnimationFrame(this.play.bind(this));
};

GestureSource.prototype.error = function () {
  window.alert('No media avalable');
};

GestureSource.prototype.createCanvas = function () {

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.video.width || 640;
  this.canvas.height = this.video.height || 480;
  this.ctx = this.canvas.getContext('2d');

  document.getElementsByTagName('body')[0].appendChild(this.canvas);
};

GestureSource.prototype.play = function () {

  var _this = this;

  this.clear();

  $(this.video).objectdetect("all", {
    classifier: objectdetect.handfist
  }, function (coords) {
    _this.render('fist', coords);
  });

  $(this.video).objectdetect("all", {
    classifier: objectdetect.eye
  }, function (coords) {
    _this.render('eye', coords);
  });

  window.requestAnimationFrame(this.play.bind(this));

};

GestureSource.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

GestureSource.prototype.render = function (type, coords) {

  var i, len, item;

  i = 0;
  len = coords.length;

  for (; i < len; i++) {
    item = coords[i];
    switch (type) {
      case 'eye':
        this.ctx.fillStyle = 'rgba(0, 50, 255, 0.3)';
        break;
      case 'fist':
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        break;
      default:
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        break;
    }
    this.ctx.fillRect(item[0], item[1], item[2], item[3]);
  }
};

var app = new GestureSource('webcam');
