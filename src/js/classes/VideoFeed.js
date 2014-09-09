/*globals navigator*/

var VideoFeed = function (options, callback) {

  var video, width, height;

  if (!navigator.getUserMedia) {
    throw "No media available";
  }

  if (typeof arguments[0] === "function") {
    callback = arguments[0];
    options = {};
  }
  
  width = options.width || 640;
  height = options.height || 480;

  var createVideo = function (stream) {
    video = window.document.createElement('video');
    video.autoplay = true;
    video.width = width;
    video.height = height;
    video.src = (window.webkitURL) ? window.webkitURL.createObjectURL(stream) : stream;

    callback(video);
  };

  var success = function (stream) {
    createVideo(stream);
  };

  var error = function () {
    throw "Cannot access camera";
  };

  navigator.getUserMedia({
    video: true,
    audio: false
  }, success, error);

  return true;
};
