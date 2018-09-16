import requests
import json
import cv2

addr = 'http://localhost:5005'
test_url = addr + '/api/predict'

# prepare headers for http request
content_type = 'image/jpeg'
headers = {'content-type': content_type}

img = cv2.imread('./data/yolo/pAz_mIjHglw-frame-160.jpg')

# encode image as jpeg
_, img_encoded = cv2.imencode('.jpg', img)

# send http request with image and receive response
response = requests.post(test_url, data=img_encoded.tostring(), headers=headers)
print(response.json())
