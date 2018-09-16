(() => {
  const video = document.getElementById("videoElem");
  const videoCanvas = document.getElementById("video");
  const captionElem = document.getElementById("caption");

  const context = videoCanvas.getContext("2d");
  const drawStore = [];

  video.style.display = "none";

  const setCaptionText = text => {
    captionElem.text = text;
  };

  context.textAlign = "center";
  context.fillStyle = "white";

  const api = "http://10.243.125.120:5006/api/predict";

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(stream => {
      video.srcObject = stream;
    });

  video.addEventListener("play", function() {
    layVideoOnCanvasCallback();
  });

  function layVideoOnCanvasCallback() {
    // if (video.paused || video.ended) {
    //   return;
    // }
    layVideoOnCanvas();
    // add captions
    setTimeout(function() {
      layVideoOnCanvasCallback();
    }, 1000 / 30); // 30 fps
  }

  function layVideoOnCanvas() {
    context.drawImage(video, 0, 0);
    // drawStore.forEach(element => {
    //   context.strokeRect(element.x, element.y, element.width, element.height);
    // });
  }

  function takeScreenshot() {
    return videoCanvas.toDataURL("image/jpeg");
  }

  function getPrediction(data) {
    return fetch(api, {
      method: "POST",
      body: data
    })
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        console.log("error", err);
      });
  }

  const main = () => {
    setInterval(() => {
      const data = takeScreenshot();
      console.log(data);
      //   getPrediction(data).then(res => {
      //     console.log(res);
      //   });
    }, 1000);
  };

  main();
})();
