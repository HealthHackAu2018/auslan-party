# AusLan Party

## Setup

```
python3 -m venv ENV
source ENV/bin/activate
pip install opencv-python xmltodict
pip install git+https://github.com/fastai/fastai.git
pip install xmltodict
```

### Install Yolo Mark

```
git clone https://github.com/AlexeyAB/Yolo_mark
cd Yolo_mark
cmake .
make
./linux_mark.sh
```

## Dataset

### Videos processed

* [Fingerspelling A-Z Auslan](https://www.youtube.com/watch?v=rV1KfQlRAds)
