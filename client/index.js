(env => {
  const API_BASE_URL = "http://localhost:5006";

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  function getPrediction(imageDataUrl) {
    return fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      body: imageDataUrl
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        return data;
      });
  }

  function captureVideoFrame(canvas) {
    return canvas.toDataURL("image/jpeg");
  }

  function clearCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, c.height);
  }

  function drawRect(canvas, x, y, width, height, color = "#FF0000") {
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.globalAlpha = 1.0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, width, height);
  }

  /**
   * Main app things
   */
  function App() {
    const videoElem = document.querySelector("#video-container video");
    const captionElem = document.querySelector(".caption");
    const canvas = document.querySelector("#video-container > canvas");

    /**
     * Stateful things
     */
    const state = {
      predictionLoop: undefined,
      captionText: "?"
    };

    const setCaptionText = text => {
      state.captionText = text;
      captionElem.textContent = state.captionText;
    };

    const startPredictionLoop = () => {
      state.predictionLoop = setInterval(() => {
        const imageDataUrl = captureVideoFrame(canvas);
        getPrediction(imageDataUrl)
          .then(data => {
            clearCanvas(canvas);
            drawRect(canvas, data.bb[0], data.bb[1], data.bb[2], data.bb[3]);
            setCaptionText(data.class);
          })
          .catch(() => {
            stopPredictionLoop();
          });
      }, 200);
    };

    const stopPredictionLoop = () => {
      clearInterval(state.predictionLoop);
    };

    const initialise = () => {
      navigator.getUserMedia(
        {
          video: true
        },
        stream => {
          console.info("got stream", stream);
          videoElem.srcObject = stream;

          // configure a fake presentation for demo purposes
          if (env === "demo") {
            drawRect(canvas, 200, 250, 230, 170);
            setCaptionText("B");
          } else {
            startPredictionLoop();
          }
        },
        err => console.error(err)
      );
    };

    return {
      initialise
    };
  }

  const app = App();
  app.initialise();
})("demo");
