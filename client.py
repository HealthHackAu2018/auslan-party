import time
import io
import requests

from PIL import Image
import base64
from io import BytesIO

buffered = BytesIO()
img = Image.open('./data/yolo/pAz_mIjHglw-frame-160.jpg')
img.save(buffered, "JPEG")
encoded_img = base64.b64encode(buffered.getvalue())

tic = time.time()
r = requests.post('http://localhost:5007/api/predict', json={'image': encoded_img.decode('utf8')})
print(f'Result: {r.json()}, Total time: {time.time() - tic}')
