import cv2
from flask import Flask, request, jsonify
import numpy as np
from fastai.transforms import tfms_from_model, CropType
from torchvision.models.resnet import resnet101
from fastai.core import V, to_np
import torch
from flask_cors import CORS
from scipy.special import expit
import base64

app = Flask(__name__)

CORS(app)

model = torch.load(
    'data/models/torch.resnet101-val-loss-29.914882', map_location='cpu')
model.eval()

size = 224

trn_tfms, val_tfms = tfms_from_model(resnet101, size, crop_type=CropType.NO)
alphabet = list('abcdefghijklmnopqrstuvwxyz') + ['na']
itoa = {c: l for c, l in enumerate(alphabet)}


def bb_hw(bb):
    ymin, xmin, ymax, xmax = bb
    return np.array([xmin, ymin, xmax - xmin + 1, ymax - ymin + 1])


@app.route("/api/predict", methods=['POST'])
def make_predictions():
    img_str = base64.b64decode(str(request.data).split(',')[1])
    nparr = np.fromstring(img_str, np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR).astype(np.float32) / 255
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    height, width, channels = img.shape

    im = val_tfms(img)
    output = model(V(im[None]))

    output = to_np(output)

    bb_i = expit(output[:, :4])
    y, x, y2, x2 = bb_i[0]
    bb_scaled = [
        y * height,
        x * width,
        y2 * height,
        x2 * width]
    bb_np = bb_hw(bb_scaled)

    c_i = output[:, 4:]

    class_pred = itoa[np.argmax(c_i)]
    return jsonify({'class': class_pred, 'bb': list([int(b) for b in bb_np])})


if __name__ == '__main__':
    app.run(debug=True, port=5006, host='0.0.0.0')
