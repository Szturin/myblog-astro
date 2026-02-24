---
title: "【ROS2】OriginBot ROS2用指令"
published: 2023-10-21
category: 学习笔记
  - 编程
  - ROS2
  - linux
---
### 编译
每次对originbot的功能包参数进行修改后都要进行编译操作，命令如下
``cd /userdata/dev_ws/ ``
``colcon build``

### 小车ssh远程连接
``ssh root@192.168.238.81``
在多类终端均可使用该命令

### 建立DSS连接
``export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp``
``CYCLONEDDS_URI='<CycloneDDS><Domain><General><NetworkInterfaceAddress>ens33</NetworkInterfaceAddress></General></Domain></CycloneDDS>'``

### 查看网络配置
``ifconfig``
``sudo apt install net-tools ``
才能使用ifcongfig命令

### 关机
``halt``

xxxxxxxxxx git remote add [alias] [url]//参数[alias]为别名， [url]为远程仓库的地址bash
