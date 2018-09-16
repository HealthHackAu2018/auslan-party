const video = document.getElementById('videoEle');
const videoCanvas = document.getElementById('video');
const textCanvas = document.getElementById('text');
const image = document.getElementById('screenshotImg');
const btn = document.querySelector('button');

const drawStore = [];

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
});

videoCanvas.onclick = () => {
    image.src = videoCanvas.toDataURL('image/webp');
}

btn.onclick = () => {
    // videoCanvas.getContext('2d').strokeRect(10, 10, 80, 90);
    drawStore.push({
        x: Math.random() * 640,
        y: Math.random() * 480,
        width: Math.random() * 100,
        height: Math.random() * 100
    });
}

video.addEventListener('play', function() {
    timerCallBack();
});

function timerCallBack() {
    if (video.paused || video.ended) {
        return;
    }
    video.style.display = 'none';
    layOnvideoCanvas();
    setTimeout(function() {
        timerCallBack();
    }, 1000 / 30);
}

function layOnvideoCanvas() {
    const context = videoCanvas.getContext('2d');
    context.drawImage(video, 0, 0);
    let frame = context.getImageData(0, 0, videoCanvas.width, videoCanvas.height);
    for (let i = 0; i < frame.data.length; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        if (r - 40 <= 80 && g - 30 <= 50 && b - 40 <= 100)
            frame.data[i * 4 + 3] = 30;
    }
    context.putImageData(frame, 0 ,0);
    drawStore.forEach(element => {
        context.strokeRect(element.x, element.y, element.width, element.height);
    });
}
