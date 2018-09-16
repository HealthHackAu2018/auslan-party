const video = document.getElementById('videoElem');
const videoCanvas = document.getElementById('video');
const image = document.getElementById('screenshotImg');
const btn = document.querySelector('button');

const context = videoCanvas.getContext('2d');
const drawStore = [];

context.textAlign = 'center';
context.fillStyle = 'white';

const api = 'http://10.243.125.120:5006/api/predict';

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
});

videoCanvas.onclick = () => {
    image.src = videoCanvas.toDataURL('image/jpg');
}

btn.onclick = () => {
    drawStore.push({
        x: Math.random() * 640,
        y: Math.random() * 480,
        width: Math.random() * 100,
        height: Math.random() * 100
    });
}

video.addEventListener('play', function() {
    layVideoOnCanvasCallback();
});

function layVideoOnCanvasCallback() {
    if (video.paused || video.ended) {
        return;
    }
    video.style.display = 'none';
    layVideoOnCanvas();
    // add captions
    context.fillText(captionText, 320, 450);
    setTimeout(function() {
        layVideoOnCanvasCallback();
    }, 1000 / 30); //30 fps
}

function takeScreenshots() {
    if (video.paused || video.ended) {
        return;
    }
    image.src = videoCanvas.toDataURL('image/webp');
    setTimeout(function() {
        takeScreenshots();
    }, 500);
}

function layVideoOnCanvas() {
    context.drawImage(video, 0, 0);
    drawStore.forEach(element => {
        context.strokeRect(element.x, element.y, element.width, element.height);
    });
}

function getPrediction(data) {
    return fetch(api, { method: 'POST', body: videoCanvas.toDataURL('image/jpg') })
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => {
            console.log('error', err);
        })
}
