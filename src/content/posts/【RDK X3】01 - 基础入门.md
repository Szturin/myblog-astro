---
title: "【RDK X3】01 - 基础入门"
published: 2024-10-01
updated: 2024-11-15
description: ""
category: 学习笔记
tags:
  - 嵌入式软件
  - Linux
  - RDK X3
---

# 一、常用接口和视觉处理方法

### 摄像头的开启

```python
#摄像头类创建
class pi_Camera():
    def __init__(self):
        # 图像初始化配置
        self.Video = cv2.VideoCapture(8, cv2.CAP_V4L2) # 使能摄像头8的驱动

        # 检查摄像头是否打开
        ret = self.Video.isOpened()
        if ret:
            print("The video is opened.")
        else:
            print("No video.")
    
        codec = cv2.VideoWriter_fourcc('M', 'J', 'P', 'G')
        self.Video.set(cv2.CAP_PROP_FOURCC, codec)
        self.Video.set(cv2.CAP_PROP_FPS, 60)  # 帧数
        self.Video.set(cv2.CAP_PROP_FRAME_WIDTH, 640)  # 列 宽度
        self.Video.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)  # 行 高度
    
    def GuideLine(self, c1, c2):
        ret, image = self.Video.read()#注意：read返回一个bull值和图像数据list！，需要用两个变量获取
        if ret:
            cv2.line(image, (0, 360), (640, 360), color=(0, 0, 255), thickness=3)  # 红色的线
            cv2.line(image, (0, 240), (640, 240), color=(0, 0, 255), thickness=3)  # 红色的线
            cv2.line(image, (int(c1), 360), (int(c2), 240), color=(0, 255, 0), thickness=2)  # 绘出倾角线
            cv2.imshow("GuideLine", image)
```
**异常的处理：**[错误处理 - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1016959663602400/1017598873256736)

**ret的作用：**

​ 通常是一个函数返回值的缩写，在opencv中经常用来读取函数的布尔值，判断摄像是否打开、头图像是否读取成功等，防止后续处理空值报错

**摄像头的驱动：**

-   ```
    self.Video = cv2.VideoCapture(8, cv2.CAP_V4L2)
    <!--code￼1-->
    
    ```
    

# 三、Opencv实现色块识别

# RDK X3 开发体验

题主目前初学Python,OpenCV,Ros2, 且对深度学习，图像处理等知识存在相当大的欠缺，基本参考RDK X3的官方手册学习，不得不说，RDK X3的官方镜像，社区生态支持做的都相当便捷，嵌入式边缘计算设备方面领域能做到对初学者如此友好的仅此一家。

> sudo bash -c ‘echo 1 > /sys/devices/system/cpu/cpufreq/boost’

> 可通过`sudo hrut_somstatus`命令查看当前芯片工作频率、温度等状态：

> 供电不稳定导致X3无法正常启动，或者程序执行过程中摄像头无法正常驱动

> 驱动USB摄像头时应该确定设备号，使用`ls /dev/video*`命令查看当前的video设备

> 使用 rc.local 可以便捷配置开机自启动脚本

> 使用ros2或者tros命令应配置好环境变量

> 烧录镜像应选择稳定版本，比如 2.10 ，3.0.0beta存在一些小毛病（VNC无法正常使用）

> vscode remote无法获得opencv imshow的图像，使用MobaXterm则正常显示X3的摄像头图像

# RDK X3多媒体

## 术语约定([https://developer.horizon.cc/documents_rdk/multimedia_development/overview#terminology](https://developer.horizon.cc/documents_rdk/multimedia_development/overview#terminology))

缩写

全称

解释

VIN

Video IN

包含视频处理接入、图像信号处理器、畸变矫正和防抖处理，接收来自sensor的数据并处理，也可以直接接收内存中的图像数据

VPS

Video Process System

包含图像旋转、图像裁剪、缩放功能，可对同一种输入源输出不同分辨率的图像。输入源可以是VIN模块，也可以是内存中的图像数据

VENC

Video Encode

VENC编码模块支持H.264/H.265/JPEG/MJPEG编码，VPS模块处理后的数据可通过编码模块按不同协议编码做码流输出

VDEC

Video Decode

VDEC解码模块支持H.264/H.265/JPEG/MJPEG解码，可对已编码的码流进行解码，交给VPS模块做进一步处理，输出到VOT模块进行显示

VPU

Video Processing Unit

视频处理单元，完成视频的编解码功能

JPU

JPEG Processing Unit

JPEG 图片处理单元，完成JPEG、MJPEG的编解码功能

VOT

Video Output

视频输出模块接收VPS、VDEC的图像数据，可输出到显示设备

VIO

Video IN/OUT

视频输入、输出，包括VIN和VOT模块

MIPI

Mobile Industry Processor Interface

移动产业处理器接口

CSI

Camera Serial Interface

相机串行接口。CSI接口与DSI接口同属一门，都是MIPI（移动产业处理器接口联盟）制定的一种接口规范

DVP

Digital Video Port

数字视频端口

SIF

Sensor Interface

sensor接口，用来接收mipi、dvp或者内存的图像数据

ISP

Image Signal Processor

图像信号处理器，完成图像的效果调校

LDC

Lens Distortion Correction

镜头畸变校正

DIS

Digital Image Stabilizer

数字图像稳定

DWE

Dewarp Engine

畸变矫正引擎，主要是将LDC和DIS集成在一起，包括LDC的畸变矫正和DIS的统计结果

IPU

Image Process Unit

图像信号处理单元，支持图像的旋转、图像裁剪、缩放功能

GDC

Geometrical Distortion Correction

几何畸变矫正

PYM

Pyramid

图像金字塔

OSD

On Screen Display

视频图像叠层显示

BPU

Brain Process Unit

地平线机器人自主研发的可编程AI加速引擎

HAL

Hardware Abstraction Layer

硬件抽象层

FW

Firmware

固件

Sensor

Sensor

如不做特别说明，特指CMOS图像传感器

# USB推理函数解释

```python
import sys
import signal
import os
from hobot_dnn import pyeasy_dnn as dnn
from hobot_vio import libsrcampy as srcampy
import numpy as np
import cv2
import colorsys
from time import time

import ctypes
import json 

def signal_handler(signal, frame):
    print("\nExiting program")
    sys.exit(0)

output_tensors = None

fcos_postprocess_info = None

class hbSysMem_t(ctypes.Structure):
    _fields_ = [
        ("phyAddr",ctypes.c_double),
        ("virAddr",ctypes.c_void_p),
        ("memSize",ctypes.c_int)
    ]

class hbDNNQuantiShift_yt(ctypes.Structure):
    _fields_ = [
        ("shiftLen",ctypes.c_int),
        ("shiftData",ctypes.c_char_p)
    ]

class hbDNNQuantiScale_t(ctypes.Structure):
    _fields_ = [
        ("scaleLen",ctypes.c_int),
        ("scaleData",ctypes.POINTER(ctypes.c_float)),
        ("zeroPointLen",ctypes.c_int),
        ("zeroPointData",ctypes.c_char_p)
    ]    

class hbDNNTensorShape_t(ctypes.Structure):
    _fields_ = [
        ("dimensionSize",ctypes.c_int * 8),
        ("numDimensions",ctypes.c_int)
    ]

class hbDNNTensorProperties_t(ctypes.Structure):
    _fields_ = [
        ("validShape",hbDNNTensorShape_t),
        ("alignedShape",hbDNNTensorShape_t),
        ("tensorLayout",ctypes.c_int),
        ("tensorType",ctypes.c_int),
        ("shift",hbDNNQuantiShift_yt),
        ("scale",hbDNNQuantiScale_t),
        ("quantiType",ctypes.c_int),
        ("quantizeAxis", ctypes.c_int),
        ("alignedByteSize",ctypes.c_int),
        ("stride",ctypes.c_int * 8)
    ]

class hbDNNTensor_t(ctypes.Structure):
    _fields_ = [
        ("sysMem",hbSysMem_t * 4),
        ("properties",hbDNNTensorProperties_t)
    ]


class FcosPostProcessInfo_t(ctypes.Structure):
    _fields_ = [
        ("height",ctypes.c_int),
        ("width",ctypes.c_int),
        ("ori_height",ctypes.c_int),
        ("ori_width",ctypes.c_int),
        ("score_threshold",ctypes.c_float),
        ("nms_threshold",ctypes.c_float),
        ("nms_top_k",ctypes.c_int),
        ("is_pad_resize",ctypes.c_int)
    ]


libpostprocess = ctypes.CDLL('/usr/lib/libpostprocess.so') 

get_Postprocess_result = libpostprocess.FcosPostProcess
get_Postprocess_result.argtypes = [ctypes.POINTER(FcosPostProcessInfo_t)]  
get_Postprocess_result.restype = ctypes.c_char_p  
```
```python
def draw_bboxs(image, bboxes, classes=get_classes()):
    """draw the bboxes in the original image"""
    # 获取类别数量
    num_classes = len(classes)
    # 获取图像的高度、宽度和通道数
    image_h, image_w, channel = image.shape
    # 生成颜色列表，每个类别一个颜色
    hsv_tuples = [(1.0 * x / num_classes, 1., 1.) for x in range(num_classes)]
    colors = list(map(lambda x: colorsys.hsv_to_rgb(*x), hsv_tuples))
    # 将颜色值转换为0-255范围内的RGB值
    colors = list(
        map(lambda x: (int(x[0] * 255), int(x[1] * 255), int(x[2] * 255)),
            colors))

    # 设置字体缩放比例
    fontScale = 0.5
    # 设置矩形框的厚度
    bbox_thick = int(0.6 * (image_h + image_w) / 600)

    # 遍历每个检测结果
    for i, result in enumerate(bboxes):
        # 获取矩形框的位置信息
        bbox = result['bbox']
        # 获取检测分数
        score = result['score']
        # 获取类别ID
        id = int(result['id'])
        # 获取类别名称
        name = result['name']

        # 将位置信息四舍五入为整数
        coor = [round(i) for i in bbox]

        # 根据类别ID获取对应的颜色
        bbox_color = colors[id]
        # 矩形框的两个顶点坐标
        c1, c2 = (coor[0], coor[1]), (coor[2], coor[3])
        # 画矩形框
        cv2.rectangle(image, c1, c2, bbox_color, bbox_thick)
        # 类别名称
        classes_name = name
        # 矩形框内显示的文字
        bbox_mess = '%s: %.2f' % (classes_name, score)
        # 获取文字尺寸
        t_size = cv2.getTextSize(bbox_mess,
                                 0,
                                 fontScale,
                                 thickness=bbox_thick // 2)[0]
        # 画矩形框的填充部分，用于显示文字背景
        cv2.rectangle(image, c1, (c1[0] + t_size[0], c1[1] - t_size[1] - 3),
                      bbox_color, -1)
        # 在图像上显示文字
        cv2.putText(image,
                    bbox_mess, (c1[0], c1[1] - 2),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    fontScale, (0, 0, 0),
                    bbox_thick // 2,
                    lineType=cv2.LINE_AA)
        # 打印检测结果
        print("{} is in the picture with confidence:{:.4f}".format(
            classes_name, score))
    # 返回绘制了矩形框和文字的图像
    return image
```
```python
def get_display_res():
    # 检查指定路径下的可执行文件是否存在，如果不存在则返回默认分辨率 1920x1080
    if os.path.exists("/usr/bin/get_hdmi_res") == False:
        return 1920, 1080

    import subprocess
    # 使用子进程运行 get_hdmi_res 命令，获取输出
    p = subprocess.Popen(["/usr/bin/get_hdmi_res"], stdout=subprocess.PIPE)
    result = p.communicate()
    # 将结果按逗号分割
    res = result[0].split(b',')
    # 确保宽度和高度在合理范围内
    res[1] = max(min(int(res[1]), 1920), 0)
    res[0] = max(min(int(res[0]), 1080), 0)
    return int(res[1]), int(res[0])
```
## 代码

```python
# Get HDMI display object
disp = srcampy.Display()
# For the meaning of parameters, please refer to the relevant documents of HDMI display
disp_w, disp_h = get_display_res()
disp.display(0, disp_w, disp_h) # 显示模块初始化，并配置显示参数
```
```python
# 创建 FcosPostProcessInfo_t 对象
fcos_postprocess_info = FcosPostProcessInfo_t()

# 设置目标图像的高度和宽度
fcos_postprocess_info.height = 512
fcos_postprocess_info.width = 512

# 设置原始图像的高度和宽度
fcos_postprocess_info.ori_height = disp_h
fcos_postprocess_info.ori_width = disp_w

# 设置分数阈值，用于过滤低置信度的检测框
fcos_postprocess_info.score_threshold = 0.5 

# 设置非极大值抑制（NMS）的阈值，用于合并重叠的检测框
fcos_postprocess_info.nms_threshold = 0.6

# 设置 NMS 阶段保留的检测框数量上限
fcos_postprocess_info.nms_top_k = 5

# 指定是否在图像调整大小时使用填充
fcos_postprocess_info.is_pad_resize = 0
```
```python
for i in range(len(models[0].outputs)):
    # 设置每个输出张量的布局属性
    output_tensors[i].properties.tensorLayout = get_TensorLayout(models[0].outputs[i].properties.layout)
    
    # 检查输出张量的 scale_data 是否为空
    if len(models[0].outputs[i].properties.scale_data) == 0:
        # 如果 scale_data 为空，设置量化类型为 0
        output_tensors[i].properties.quantiType = 0
    else:
        # 如果 scale_data 不为空，设置量化类型为 2
        output_tensors[i].properties.quantiType = 2  
        # 将 scale_data 重新调整形状
        scale_data_tmp = models[0].outputs[i].properties.scale_data.reshape(1, 1, 1, models[0].outputs[i].properties.shape[3])  
        # 将 scale_data 转换为指向浮点数的指针
        output_tensors[i].properties.scale.scaleData = scale_data_tmp.ctypes.data_as(ctypes.POINTER(ctypes.c_float))
    
    # 设置每个输出张量的有效形状和对齐形状
    for j in range(len(models[0].outputs[i].properties.shape)):
        output_tensors[i].properties.validShape.dimensionSize[j] = models[0].outputs[i].properties.shape[j]
        output_tensors[i].properties.alignedShape.dimensionSize[j] = models[0].outputs[i].properties.shape[j]
```
## 主循环

```python
while True:
        _ ,frame = cap.read()

        # print(frame.shape)

        if frame is None:
            print("Failed to get image from usb camera")
        # 把图片缩放到模型的输入尺寸
        # 获取算法模型的输入tensor 的尺寸
        h, w = models[0].inputs[0].properties.shape[2], models[0].inputs[0].properties.shape[3]
        des_dim = (w, h)
        resized_data = cv2.resize(frame, des_dim, interpolation=cv2.INTER_AREA)

        nv12_data = bgr2nv12_opencv(resized_data)

        t0 = time()
        # Forward
        outputs = models[0].forward(nv12_data)
        t1 = time()
        # print("forward time is :", (t1 - t0))

        # Do post process
        strides = [8, 16, 32, 64, 128]
        for i in range(len(strides)):
            if (output_tensors[i].properties.quantiType == 0):
                output_tensors[i].sysMem[0].virAddr = ctypes.cast(outputs[i].buffer.ctypes.data_as(ctypes.POINTER(ctypes.c_float)), ctypes.c_void_p)
                output_tensors[i + 5].sysMem[0].virAddr = ctypes.cast(outputs[i + 5].buffer.ctypes.data_as(ctypes.POINTER(ctypes.c_float)), ctypes.c_void_p)
                output_tensors[i + 10].sysMem[0].virAddr = ctypes.cast(outputs[i + 10].buffer.ctypes.data_as(ctypes.POINTER(ctypes.c_float)), ctypes.c_void_p)
            else:      
                output_tensors[i].sysMem[0].virAddr = ctypes.cast(outputs[i].buffer.ctypes.data_as(ctypes.POINTER(ctypes.c_int32)), ctypes.c_void_p)
                output_tensors[i + 5].sysMem[0].virAddr = ctypes.cast(outputs[i + 5].buffer.ctypes.data_as(ctypes.POINTER(ctypes.c_int32)), ctypes.c_void_p)
                output_tensors[i + 10].sysMem[0].virAddr = ctypes.cast(outputs[i + 10].buffer.ctypes.data_as(ctypes.POINTER(ctypes.c_int32)), ctypes.c_void_p)

            libpostprocess.FcosdoProcess(output_tensors[i], output_tensors[i + 5], output_tensors[i + 10], ctypes.pointer(fcos_postprocess_info), i)

        result_str = get_Postprocess_result(ctypes.pointer(fcos_postprocess_info))  
        result_str = result_str.decode('utf-8')  
        t2 = time()
        # print("FcosdoProcess time is :", (t2 - t1))
        # print(result_str)

        # draw result
        # 解析JSON字符串  
        data = json.loads(result_str[14:])  

        if frame.shape[0]!=disp_h or frame.shape[1]!=disp_w:
            frame = cv2.resize(frame, (disp_w,disp_h), interpolation=cv2.INTER_AREA)

        # Draw bboxs
        box_bgr = draw_bboxs(frame, data)

        # cv2.imwrite("imf.jpg", box_bgr)

        # Convert to nv12 for HDMI display
        box_nv12 = bgr2nv12_opencv(box_bgr)
        disp.set_img(box_nv12.tobytes())

        finish_time = time()
        image_counter += 1
        if finish_time - start_time >  10:
            print(start_time, finish_time, image_counter)
            print("FPS: {:.2f}".format(image_counter / (finish_time - start_time)))
            start_time = finish_time
            image_counter = 0
```