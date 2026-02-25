---
title: "【ROS2】[2]ROS2节点的编写"
published: 2024-07-09
updated: 2024-11-08
category: 学习笔记
description: ""
tags:
  - 机器人技术
  - ROS2
  - Linux
---

# ROS2节点的代码结构（面向对象）

## 主程序

```python
#!/usr/bin/env python3 
# -*- coding: utf-8 -*-

"""
@作者: 古月居(www.guyuehome.com)
@说明: ROS2节点示例-通过摄像头识别检测图片中出现的苹果
"""

import rclpy                            # ROS2 Python接口库
from rclpy.node import Node             # ROS2 节点类

import cv2                              # OpenCV图像处理库
import numpy as np                      # Python数值计算库

lower_red = np.array([0, 90, 128])     # 红色的HSV阈值下限
upper_red = np.array([180, 255, 255])  # 红色的HSV阈值上限

def object_detect(image):
    hsv_img = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)       # 图像从BGR颜色模型转换为HSV模型
    mask_red = cv2.inRange(hsv_img, lower_red, upper_red)  # 图像二值化

    contours, hierarchy = cv2.findContours(mask_red, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE) # 图像中轮廓检测

    for cnt in contours:                                   # 去除一些轮廓面积太小的噪声
        if cnt.shape[0] < 150:
            continue

        (x, y, w, h) = cv2.boundingRect(cnt)               # 得到苹果所在轮廓的左上角xy像素坐标及轮廓范围的宽和高
        cv2.drawContours(image, [cnt], -1, (0, 255, 0), 2) # 将苹果的轮廓勾勒出来
        cv2.circle(image, (int(x+w/2), int(y+h/2)), 5, (0, 255, 0), -1)    # 将苹果的图像中心点画出来

    cv2.imshow("object", image)                            # 使用OpenCV显示处理后的图像效果
    cv2.waitKey(50)

def main(args=None):                                       # ROS2节点主入口main函数
    rclpy.init(args=args)                                  # ROS2 Python接口初始化
    node = Node("node_object_webcam")                      # 创建ROS2节点对象并进行初始化
    node.get_logger().info("ROS2节点示例：检测图片中的苹果")

    cap = cv2.VideoCapture(0)


    while rclpy.ok():
        ret, image = cap.read()          # 读取一帧图像

        if ret == True:
            object_detect(image)         # 苹果检测

    node.destroy_node()                  # 销毁节点对象
    rclpy.shutdown()                     # 关闭ROS2 Python接口
```
## [setup.py](http://setup.py)——节点的入口

```python
entry_points={
    'console_scripts': [
     'node_helloworld       = learning_node.node_helloworld:main',
     'node_helloworld_class = learning_node.node_helloworld_class:main',
     'node_object           = learning_node.node_object:main',
     'node_object_webcam    = learning_node.node_object_webcam:main',
    ],
```
# ROS2话题的编写

## 发布者

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@作者: 古月居(www.guyuehome.com)
@说明: ROS2话题示例-发布图像话题
"""

import rclpy                        # ROS2 Python接口库
from rclpy.node import Node         # ROS2 节点类
from sensor_msgs.msg import Image   # 图像消息类型
from cv_bridge import CvBridge      # ROS与OpenCV图像转换类
import cv2                          # Opencv图像处理库

"""
创建一个发布者节点
"""
class ImagePublisher(Node):

    def __init__(self, name):
        super().__init__(name)                                           # ROS2节点父类初始化
        self.publisher_ = self.create_publisher(Image, 'image_raw', 10)  # 创建发布者对象（消息类型、话题名、队列长度）
        self.timer = self.create_timer(0.1, self.timer_callback)         # 创建一个定时器（单位为秒的周期，定时执行的回调函数）
        self.cap = cv2.VideoCapture(0)                                   # 创建一个视频采集对象，驱动相机采集图像（相机设备号）
        self.cv_bridge = CvBridge()                                      # 创建一个图像转换对象，用于稍后将OpenCV的图像转换成ROS的图像消息

    def timer_callback(self):
        ret, frame = self.cap.read()                         # 一帧一帧读取图像

        if ret == True:                                      # 如果图像读取成功
            self.publisher_.publish(
                self.cv_bridge.cv2_to_imgmsg(frame, 'bgr8')) # 发布图像消息

        self.get_logger().info('Publishing video frame')     # 输出日志信息，提示已经完成图像话题发布

def main(args=None):                                 # ROS2节点主入口main函数
    rclpy.init(args=args)                            # ROS2 Python接口初始化
    node = ImagePublisher("topic_webcam_pub")        # 创建ROS2节点对象并进行初始化
    rclpy.spin(node)                                 # 循环等待ROS2退出
    node.destroy_node()                              # 销毁节点对象
    rclpy.shutdown()                                 # 关闭ROS2 Python接口
```
## 订阅者

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@作者: 古月居(www.guyuehome.com)
@说明: ROS2话题示例-订阅图像话题
"""

import rclpy                            # ROS2 Python接口库
from rclpy.node import Node             # ROS2 节点类
from sensor_msgs.msg import Image       # 图像消息类型
from cv_bridge import CvBridge          # ROS与OpenCV图像转换类
import cv2                              # Opencv图像处理库
import numpy as np                      # Python数值计算库

lower_red = np.array([0, 90, 128])      # 红色的HSV阈值下限
upper_red = np.array([180, 255, 255])   # 红色的HSV阈值上限

"""
创建一个订阅者节点
"""
class ImageSubscriber(Node):
    def __init__(self, name):
        super().__init__(name)                                # ROS2节点父类初始化
        self.sub = self.create_subscription(
            Image, 'image_raw', self.listener_callback, 10)   # 创建订阅者对象（消息类型、话题名、订阅者回调函数、队列长度）
        self.cv_bridge = CvBridge()                           # 创建一个图像转换对象，用于OpenCV图像与ROS的图像消息的互相转换

    def object_detect(self, image):
        hsv_img = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)      # 图像从BGR颜色模型转换为HSV模型
        mask_red = cv2.inRange(hsv_img, lower_red, upper_red) # 图像二值化
        contours, hierarchy = cv2.findContours(
            mask_red, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)   # 图像中轮廓检测

        for cnt in contours:                                  # 去除一些轮廓面积太小的噪声
            if cnt.shape[0] < 150:
                continue

            (x, y, w, h) = cv2.boundingRect(cnt)              # 得到苹果所在轮廓的左上角xy像素坐标及轮廓范围的宽和高
            cv2.drawContours(image, [cnt], -1, (0, 255, 0), 2)# 将苹果的轮廓勾勒出来
            cv2.circle(image, (int(x+w/2), int(y+h/2)), 5,
                       (0, 255, 0), -1)                       # 将苹果的图像中心点画出来

        cv2.imshow("object", image)                           # 使用OpenCV显示处理后的图像效果
        cv2.waitKey(10)

    def listener_callback(self, data):
        self.get_logger().info('Receiving video frame')     # 输出日志信息，提示已进入回调函数
        image = self.cv_bridge.imgmsg_to_cv2(data, 'bgr8')  # 将ROS的图像消息转化成OpenCV图像
        self.object_detect(image)                           # 苹果检测


def main(args=None):                            # ROS2节点主入口main函数
    rclpy.init(args=args)                       # ROS2 Python接口初始化
    node = ImageSubscriber("topic_webcam_sub")  # 创建ROS2节点对象并进行初始化
    rclpy.spin(node)                            # 循环等待ROS2退出
    node.destroy_node()                         # 销毁节点对象
    rclpy.shutdown()                            # 关闭ROS2 Python接口
```
> 话题通信是异步单工通信，适合周期性发布逻辑固定的信息

> 在ROS系统中，话题通信数据的描述格式称之为消息，对应编程语言中数据结构的概念

## 话题的命令行操作

```python
ros2 topic list                # 查看话题列表
ros2 topic info <topic_name>   # 查看话题信息
ros2 topic hz <topic_name>     # 查看话题发布频率
ros2 topic bw <topic_name>     # 查看话题传输带宽
ros2 topic echo <topic_name>   # 查看话题数据
ros2 topic pub <topic_name> <msg_type> <msg_data>   # 发布话题消息
```
## 虚拟机配置与开发机通信

> 虚拟器配置为桥接模式，且虚拟网络设置要配置与本机的有线网卡一置

> Ubuntu22.04 使用 ip addr查看网络地址，或者ip a
