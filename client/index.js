const video = document.getElementById('videoEle');
const canvas = document.getElementById('screenshot');
const image = document.getElementById('screenshotImg');

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    console.log('in promise');
    video.srcObject = stream;
});

video.onclick = () => {
    canvas.width = video.width;
    canvas.height = video.height;
    canvas.getContext('2d').drawImage(video, 0, 0);
    image.src = canvas.toDataURL('image/webp');
}
