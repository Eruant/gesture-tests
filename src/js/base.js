/*globals navigator, VideoFeed, Overlay, $, objectdetect*/

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.msGetUserMedia || undefined);

(function (win, doc) {

  var video, overlay, state;

  state = {
    play: true,
    fist: {
      active: false,
      startPoint: false
    }
  };

  var videoCreated = function (videoElement) {

    video = videoElement;

    overlay = Overlay({
      update: overlayUpdate
    });

    doc.getElementsByTagName('body')[0].appendChild(video);
    doc.getElementsByTagName('body')[0].appendChild(overlay.canvas);
    overlay.start();

  };

  var render = function (type, coords) {

    var i, len, item;

    i = 0;
    len = coords.length;
    for (; i < len; i++) {
      item = coords[i];

      switch (type) {

        case 'face':

          // ignore small objects
          if (item[2] > 100) {

            if (state.play) {
              overlay.ctx.fillStyle = 'rgba(50, 255, 50, 0.3)';
            } else {
              overlay.ctx.fillStyle = 'rgba(255, 50, 50, 0.3)';
            }
            overlay.ctx.fillRect(item[0], item[1], item[2], item[3]);

          }

          break;

        case 'fist':

          if (item[2] > 80) {

            overlay.ctx.fillStyle = 'rgba(50, 50, 255, 0.3)';
            overlay.ctx.fillRect(item[0], item[1], item[2], item[3]);

          }

          break;
      }

    }
  };

  var overlayUpdate = function () {
    overlay.ctx.clearRect(0, 0, overlay.canvas.width, overlay.canvas.height);
    state.play = false;

    // this only works if the video on on the page...
    $(video).objectdetect("all", {
      classifier: objectdetect.handfist
    }, function (coords) {
      render('fist', coords);
    });

    $(video).objectdetect("all", {
      classifier: objectdetect.frontalface
    }, function (coords) {

      var i, len;

      if (coords.length > 0) {
        i = 0;
        len = coords.length;
        for (; i < len; i++) {
          if (coords[i][2] > 100) {
            state.play = true;
          }
        }
      }
      render('face', coords);
    });

  };

  VideoFeed(videoCreated);

}(window, window.document));
