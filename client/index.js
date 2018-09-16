// Take a screenshot using getUserMedia API.
// Give credit where credit is due. The code is heavily inspired by
// HTML5 Rocks' article "Capturing Audio & Video in HTML5"
// http://www.html5rocks.com/en/tutorials/getusermedia/intro/
(function() {
  // Our element ids.
  var options = {
    video: "#video",
    canvas: "#canvas",
    captureBtn: "#capture-btn",
    imageURLInput: "#image-url-input"
  };

  // Our object that will hold all of the functions.
  var App = {
    // Get the video element.
    video: document.querySelector(options.video),
    // Get the canvas element.
    canvas: document.querySelector(options.canvas),
    // Get the canvas context.
    ctx: canvas.getContext("2d"),
    // Get the capture button.
    captureBtn: document.querySelector(options.captureBtn),
    // This will hold the video stream.
    localMediaStream: null,
    // This will hold the screenshot base 64 data url.
    dataURL: null,
    // This will hold the converted PNG url.
    imageURL: null,
    // Get the input field to paste in the imageURL.
    imageURLInput: document.querySelector(options.imageURLInput),

    initialize: function() {
      var that = this;
      // Check if navigator object contains getUserMedia object.
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      // Check if window contains URL object.
      window.URL = window.URL || window.webkitURL;

      // Check for getUserMedia support.
      if (navigator.getUserMedia) {
        // Get video stream.
        navigator.getUserMedia(
          {
            video: true
          },
          this.gotStream,
          this.noStream
        );

        // Bind capture button to capture method.
        this.captureBtn.onclick = function() {
          that.capture();
        };
      } else {
        // No getUserMedia support.
        alert("Your browser does not support getUserMedia API.");
      }
    },

    // Stream error.
    noStream: function(err) {
      alert("Could not get camera stream.");
      console.log("Error: ", err);
    },

    // Stream success.
    gotStream: function(stream) {
      video.srcObject = stream;

      // Store the stream.
      localMediaStream = stream;
    },

    // Capture frame from live video stream.
    capture: function() {
      var that = this;
      // Check if has stream.
      if (localMediaStream) {
        // Draw whatever is in the video element on to the canvas.
        that.ctx.drawImage(video, 0, 0);
        // Create a data url from the canvas image.
        dataURL = canvas.toDataURL("image/jpeg");
        // Call our method to save the data url to an image.
        that.saveDataUrlToImage();
      }
    },

    saveDataUrlToImage: function() {
      var that = this;

      fetch("http://10.243.125.120:5006/api/predict", {
        method: "POST",
        body: dataURL
      })
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          alert(JSON.stringify(data));
        });
    }
  };

  // Initialize our application.
  App.initialize();

  // Expose to window object for testing purposes.
  window.App = App;
})();
