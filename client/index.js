const video = document.getElementById('videoEle');
const videoCanvas = document.getElementById('video');
const image = document.getElementById('screenshotImg');
const btn = document.querySelector('button');

const context = videoCanvas.getContext('2d');
const drawStore = [];
let captionText = '';

context.font = '1.2rem sans-serif';
context.textAlign = 'center';
context.fillStyle = 'white';

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
});

videoCanvas.onclick = () => {
    image.src = videoCanvas.toDataURL('image/webp');
}

btn.onclick = () => {
    drawStore.push({
        x: Math.random() * 640,
        y: Math.random() * 480,
        width: Math.random() * 100,
        height: Math.random() * 100
    });
}

function addCaptionText() {
    if (video.paused || video.ended) {
        return;
    }
    if (captionText.length >= 5) {
        captionText = '';
    }
    captionText += 'A';
    setTimeout(function() {
        addCaptionText();
    }, 1500);

}

video.addEventListener('play', function() {
    layVideoOnCanvasCallback();
    takeScreenshots();
    addCaptionText();
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
