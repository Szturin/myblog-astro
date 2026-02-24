---
title: "【stm32单片机】[8]AD/DA转换"
published: 2024-04-23
updated: 2024-09-03
category: 学习笔记
description: ""
---

# [](#库函数解释)库函数解释

> void RCC\_ADCCLKConfig(uint32\_t RCC\_PCLK2);
> 
> **恢复缺省配置**
> 
> void ADC\_DeInit(ADC\_TypeDef\* ADCx);
> 
> **ADC初始化**
> 
> void ADC\_Init(ADC\_TypeDef\* ADCx, ADC\_InitTypeDef\* ADC\_InitStruct);
> 
> **结构体初始化**
> 
> void ADC\_StructInit(ADC\_InitTypeDef\* ADC\_InitStruct);
> 
> **ADC上电**
> 
> void ADC\_Cmd(ADC\_TypeDef\* ADCx, FunctionalState NewState);
> 
> **开启DMA输出信号**
> 
> void ADC\_DMACmd(ADC\_TypeDef\* ADCx, FunctionalState NewState);
> 
> **中断输出控制**
> 
> void ADC\_ITConfig(ADC\_TypeDef\* ADCx, uint16\_t ADC\_IT, FunctionalState NewState);
> 
> -   用于控制某个中断能否通往NVIC
> 
> **复位校准**
> 
> void ADC\_ResetCalibration(ADC\_TypeDef\* ADCx);
> 
> **获取复位校准状态**
> 
> void ADC\_ResetCalibration(ADC\_TypeDef\* ADCx);
> 
> **开始校准**
> 
> void ADC\_StartCalibration(ADC\_TypeDef\* ADCx);
> 
> **获取开始校准状态**
> 
> FlagStatus ADC\_GetCalibrationStatus(ADC\_TypeDef\* ADCx);
> 
> **ADC软件触发的函数**
> 
> void ADC\_SoftwareStartConvCmd(ADC\_TypeDef\* ADCx, FunctionalState NewState);
> 
> **ADC获取软件转换状态**
> 
> FlagStatus ADC\_GetSoftwareStartConvStatus(ADC\_TypeDef\* ADCx);
> 
> -   实际上是获取CR2的SWSTART这一位,但是SWSTART在开始ADC转换后直接清除，所以并不能通过这个函数获得是否开始转换的信息
>     
>     ![](/posts/56223/image-20240423220300035.png)
> 
> **如何获取ADC是否开启的状态？**
> 
> **获取标志位状态**
> 
> FlagStatus ADC\_GetFlagStatus(ADC\_TypeDef\* ADCx, uint8\_t ADC\_FLAG);
> 
> -   可以调用这个函数,ADC\_FLAG选择EOC,判断EOC标志位是否置1
> 
> **每隔几个通道间断一次**
> 
> void ADC\_DiscModeChannelCountConfig(ADC\_TypeDef\* ADCx, uint8\_t Number);
> 
> **是否启动间断模式**
> 
> void ADC\_DiscModeCmd(ADC\_TypeDef\* ADCx, FunctionalState NewState);
> 
> **ADC规则组通道配置**
> 
> void ADC\_RegularChannelConfig(ADC\_TypeDef\* ADCx, uint8\_t ADC\_Channel, uint8\_t Rank, uint8\_t ADC\_SampleTime);
> 
> -   ADCx
> -   ADC\_Channel：指定的通道
> -   Rank：序列的位置
> -   ADC\_SampleTime：指定通道的采样时间
> 
> **ADC外部触发转换控制（是否允许外部触发转换）**
> 
> void ADC\_ExternalTrigConvCmd(ADC\_TypeDef\* ADCx, FunctionalState NewState);
> 
> **ADC获取转换值**
> 
> uint16\_t ADC\_GetConversionValue(ADC\_TypeDef\* ADCx);
> 
> -   获取AD转换的数据寄存器，读取转换结果
> 
> **ADC获取双模式转换值**
> 
> uint32\_t ADC\_GetDualModeConversionValue(void);
> 
> **是否启动模拟看门狗**
> 
> void ADC\_AnalogWatchdogCmd(ADC\_TypeDef\* ADCx, uint32\_t ADC\_AnalogWatchdog);
> 
> **配置高低阈值**
> 
> void ADC\_AnalogWatchdogThresholdsConfig(ADC\_TypeDef\* ADCx, uint16\_t HighThreshold, uint16\_t LowThreshold);
> 
> **配置看门的通道**
> 
> void ADC\_AnalogWatchdogSingleChannelConfig(ADC\_TypeDef\* ADCx, uint8\_t ADC\_Channel);
> 
> **ADC温度传感器、内部参考电压控制**
> 
> void ADC\_TempSensorVrefintCmd(FunctionalState NewState);
