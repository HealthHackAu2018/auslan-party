import cv2
import sys


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(f'Usage: python convert_image.py <raw vid> <img_id>')
        exit(1)

    video_fn = sys.argv[1]
    output_id = sys.argv[2]

    vidcap = cv2.VideoCapture(video_fn)
    success, image = vidcap.read()
    count = 0

    while success:
        cv2.imwrite(f"data/images/{output_id}-frame-{count}.jpg", image)
        success, image = vidcap.read()
        count += 1
        if (count + 1) % 100 == 0:
            print(f"Finished {count + 1} images")
