var Overlay = function (options) {

  var canvas, ctx, width, height;

  options = options || {};
  width = options.width || 640;
  height = options.height || 480;

  canvas = window.document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext('2d');

  var update = options.update || function () {};
  var draw = options.draw || function () {};

  var tick = function () {
    update();
    draw();
    window.requestAnimationFrame(tick);
  };

  return {
    canvas: canvas,
    ctx: ctx,
    start: tick
  };
};
