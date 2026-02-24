---
title: "【stm32单片机】[5]定时器控制PWM"
published: 2024-03-05
updated: 2024-09-03
category: 学习笔记
description: ""
tags:
  - STM32
  - 嵌入式软件
  - 单片机
---

> **配置结构体初始化输出比较单元**
> 
> void TIM_OC1Init(TIM_TypeDef* TIMx, TIM_OCInitTypeDef* TIM_OCInitStruct);  
> void TIM_OC2Init(TIM_TypeDef* TIMx, TIM_OCInitTypeDef* TIM_OCInitStruct);  
> void TIM_OC3Init(TIM_TypeDef* TIMx, TIM_OCInitTypeDef* TIM_OCInitStruct);  
> void TIM_OC4Init(TIM_TypeDef* TIMx, TIM_OCInitTypeDef* TIM_OCInitStruct);
> 
> **设置结构体初始值**
> 
> void TIM_OCStructInit(TIM_OCInitTypeDef* TIM_OCInitStruct);
> 
> * * *
> 
> ***配置强制输出**
> 
> void TIM_ForcedOC1Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);  
> void TIM_ForcedOC2Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);  
> void TIM_ForcedOC3Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);  
> void TIM_ForcedOC4Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);
> 
> ***配置影子寄存器**
> 
> void TIM_ForcedOC1Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);  
> void TIM_ForcedOC2Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);  
> void TIM_ForcedOC3Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);  
> void TIM_ForcedOC4Config(TIM_TypeDef* TIMx, uint16_t TIM_ForcedAction);
> 
> ***配置快速使能**
> 
> xxxxxxxxxx typedef struct//typedef为成员列表提供了一个GPIO_InitTypeDef的名字{}GPIO_InitTypeDef;c
> 
> ***清除REF信号**
> 
> void TIM_ClearOC1Ref(TIM_TypeDef* TIMx, uint16_t TIM_OCClear);  
> void TIM_ClearOC2Ref(TIM_TypeDef* TIMx, uint16_t TIM_OCClear);  
> void TIM_ClearOC3Ref(TIM_TypeDef* TIMx, uint16_t TIM_OCClear);  
> void TIM_ClearOC4Ref(TIM_TypeDef* TIMx, uint16_t TIM_OCClear);
> 
> **配置输出极性**
> 
> > 带N即高级定时器里互补通道的配置
> > 
> > OC4无互补通道
> > 
> > 结构体初始化中也可以设置极性
> 
> void TIM_OC1PolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCPolarity);  
> void TIM_OC1NPolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCNPolarity);  
> void TIM_OC2PolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCPolarity);  
> void TIM_OC2NPolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCNPolarity);  
> void TIM_OC3PolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCPolarity);  
> void TIM_OC3NPolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCNPolarity);  
> void TIM_OC4PolarityConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCPolarity);
> 
> void TIM_CCxCmd(TIM_TypeDef* TIMx, uint16_t TIM_Channel, uint16_t TIM_CCx);  
> void TIM_CCxNCmd(TIM_TypeDef* TIMx, uint16_t TIM_Channel, uint16_t TIM_CCxN);
> 
> **单独修改输出使能参数**
> 
> void TIM_CCxCmd(TIM_TypeDef* TIMx, uint16_t TIM_Channel, uint16_t TIM_CCx);  
> void TIM_CCxNCmd(TIM_TypeDef* TIMx, uint16_t TIM_Channel, uint16_t TIM_CCxN);
> 
> **单独更改输出比较模式**
> 
> void TIM_SelectOCxM(TIM_TypeDef* TIMx, uint16_t TIM_Channel, uint16_t TIM_OCMode);
> 
> **单独更改CCR寄存器的函数**
> 
> void TIM_SetCompare1(TIM_TypeDef* TIMx, uint16_t Compare1);  
> void TIM_SetCompare2(TIM_TypeDef* TIMx, uint16_t Compare2);  
> void TIM_SetCompare3(TIM_TypeDef* TIMx, uint16_t Compare3);  
> void TIM_SetCompare4(TIM_TypeDef* TIMx, uint16_t Compare4);
> 
> **高级定时器，使能PWM，否则无法正常输出**
> 
> void TIM_CtrlPWMOutputs(TIM_TypeDef* TIMx, FunctionalState NewState);
