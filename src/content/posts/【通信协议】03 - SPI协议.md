---
title: "【通信协议】03 - SPI协议"
published: 2024-03-08
updated: 2024-05-02
category: 学习笔记
description: ""
tags:
  - 通信协议
  - 嵌入式硬件
  - 单片机
---

# 基础概念

### 什么是SPI？

SPI是串行外设接口(Serial Peripheral Interface)的缩写。是 Motorola 公司推出的一 种同步串行接口技术，是一种高速的，全双工，同步的通信总线。

**SPI优点**:支持全双工通信 通信简单 数据传输速率块

**缺点** :没有指定的流控制，没有应答机制确认是否接收到数据，所以跟IIC总线协议比较在数据 可靠性上有一定的缺陷。

**特点**:

1.  高速、同步、全双工、非差分、总线式
2.  主从机通信模式

# 蓝桥杯相关（暂未使用SPI）

## DS1302（时钟芯片）底层

```c
#include <reg52.h>
#include <intrins.h>
#include "ds1302.h"
sbit SCK=P1^7;		
sbit SDA=P2^3;		
sbit RST = P1^3;  											

void Write_Ds1302(unsigned  char temp) 
{
	unsigned char i;
	for (i=0;i<8;i++)     	
	{ 
		SCK=0;
		SDA=temp&0x01;
		temp>>=1; 
		SCK=1;
	}
}   

void Write_Ds1302_Byte( unsigned char address,unsigned char dat )     
{
 	RST=0;	_nop_();
 	SCK=0;	_nop_();
 	RST=1; 	_nop_();  
 	Write_Ds1302(address);	
 	Write_Ds1302(dat);		
 	RST=0; 
}

unsigned char Read_Ds1302_Byte ( unsigned char address )
{
 	unsigned char i,temp=0x00;
 	RST=0;	_nop_();
 	SCK=0;	_nop_();
 	RST=1;	_nop_();
 	Write_Ds1302(address);
 	for (i=0;i<8;i++) 	
 	{		
		SCK=0;
		temp>>=1;	
 		if(SDA)
 		temp|=0x80;	
 		SCK=1;
	} 
 	RST=0;	_nop_();
 	SCK=0;	_nop_();
	SCK=1;	_nop_();
	SDA=0;	_nop_();
	SDA=1;	_nop_();
	return (temp);			
}
```
### 基于底层的时序编写

```c
void Set_Rtc(unsigned char* ucRtc)
{
	unsigned char i;
	Write_Ds1302_Byte(0x8e,0);//关闭写保护
	for(i=0;i<3;i++)
		Write_Ds1302_Byte(0x84-i*2,ucRtc[i]);//给ds1302写入数据,0x84时 0x82分 0x80秒
	Write_Ds1302_Byte(0x8e,1);//打开写保护
}


void Read_Rtc(unsigned char* ucRtc)
{
	unsigned char i;
	for(i=0;i<3;i++)
		ucRtc[i] = Read_Ds1302_Byte(0x85-i*2);//读取ds1302的数据
}

void Set_Date(unsigned char* ucDate)
{
	Write_Ds1302_Byte(0x8e,0);//关闭写保护
	Write_Ds1302_Byte(0x8c,ucDate[0]);
	Write_Ds1302_Byte(0x88,ucDate[1]);
	Write_Ds1302_Byte(0x86,ucDate[2]);
	Write_Ds1302_Byte(0x8e,1);	
}

void Read_Date(unsigned char* ucDate)
{
	ucDate[0] = Read_Ds1302_Byte(0x8d);
	ucDate[1] = Read_Ds1302_Byte(0x89);
	ucDate[2] = Read_Ds1302_Byte(0x87);
}
```
## 超声波底层

```c
#include <Ultrasonic.h>
#include <INTRINS.h>

sbit TX = P1^0;
sbit RX = P1^1;

void Delay12us(void)	//@12.000MHz
{
	unsigned char data i;

	_nop_();
	_nop_();
	i = 33;
	while (--i);
}

void Ut_Wave_Init(void) //超声波初始化函数 产生8个40Mhz的方波信号
{
    unsigned char i;
    for(i=0;i<8;i++)
    {
        TX=1;
        Delay12us();
        TX=0;
        Delay12us();
    }
}
```
### 基于底层的时序编写

```c
unsigned int Ut_Wave_Data(void)
{
    unsigned int time;
    TMOD &= 0x0F;
    TL1=TH1=0;
    Ut_Wave_Init();
    TR1=1; //开始计时
    while((RX==1) && (TF1==0));//等待超声波返回或定时器溢出

    TR1=0;//停止计时
    if(TF1==0)//定时器没有溢出
    {
        time = TH1<<8 | TL1;
        return (time *0.017);
    }
    else
    {
        TF1=0;//清除溢出标志位
        return 0;
    }
}
```