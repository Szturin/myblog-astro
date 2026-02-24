---
title: "【stm32单片机】[5]定时器控制PWM"
published: 2024-03-05
updated: 2024-09-03
category: 学习笔记
description: ""
---

> **配置结构体初始化输出比较单元**
> 
> void TIM\_OC1Init(TIM\_TypeDef\* TIMx, TIM\_OCInitTypeDef\* TIM\_OCInitStruct);  
> void TIM\_OC2Init(TIM\_TypeDef\* TIMx, TIM\_OCInitTypeDef\* TIM\_OCInitStruct);  
> void TIM\_OC3Init(TIM\_TypeDef\* TIMx, TIM\_OCInitTypeDef\* TIM\_OCInitStruct);  
> void TIM\_OC4Init(TIM\_TypeDef\* TIMx, TIM\_OCInitTypeDef\* TIM\_OCInitStruct);
> 
> **设置结构体初始值**
> 
> void TIM\_OCStructInit(TIM\_OCInitTypeDef\* TIM\_OCInitStruct);
> 
> * * *
> 
> **\*配置强制输出**
> 
> void TIM\_ForcedOC1Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);  
> void TIM\_ForcedOC2Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);  
> void TIM\_ForcedOC3Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);  
> void TIM\_ForcedOC4Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);
> 
> **\*配置影子寄存器**
> 
> void TIM\_ForcedOC1Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);  
> void TIM\_ForcedOC2Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);  
> void TIM\_ForcedOC3Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);  
> void TIM\_ForcedOC4Config(TIM\_TypeDef\* TIMx, uint16\_t TIM\_ForcedAction);
> 
> **\*配置快速使能**
> 
> xxxxxxxxxx typedef struct//typedef为成员列表提供了一个GPIO\_InitTypeDef的名字{}GPIO\_InitTypeDef;c
> 
> **\*清除REF信号**
> 
> void TIM\_ClearOC1Ref(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCClear);  
> void TIM\_ClearOC2Ref(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCClear);  
> void TIM\_ClearOC3Ref(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCClear);  
> void TIM\_ClearOC4Ref(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCClear);
> 
> **配置输出极性**
> 
> > 带N即高级定时器里互补通道的配置
> > 
> > OC4无互补通道
> > 
> > 结构体初始化中也可以设置极性
> 
> void TIM\_OC1PolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCPolarity);  
> void TIM\_OC1NPolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCNPolarity);  
> void TIM\_OC2PolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCPolarity);  
> void TIM\_OC2NPolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCNPolarity);  
> void TIM\_OC3PolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCPolarity);  
> void TIM\_OC3NPolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCNPolarity);  
> void TIM\_OC4PolarityConfig(TIM\_TypeDef\* TIMx, uint16\_t TIM\_OCPolarity);
> 
> void TIM\_CCxCmd(TIM\_TypeDef\* TIMx, uint16\_t TIM\_Channel, uint16\_t TIM\_CCx);  
> void TIM\_CCxNCmd(TIM\_TypeDef\* TIMx, uint16\_t TIM\_Channel, uint16\_t TIM\_CCxN);
> 
> **单独修改输出使能参数**
> 
> void TIM\_CCxCmd(TIM\_TypeDef\* TIMx, uint16\_t TIM\_Channel, uint16\_t TIM\_CCx);  
> void TIM\_CCxNCmd(TIM\_TypeDef\* TIMx, uint16\_t TIM\_Channel, uint16\_t TIM\_CCxN);
> 
> **单独更改输出比较模式**
> 
> void TIM\_SelectOCxM(TIM\_TypeDef\* TIMx, uint16\_t TIM\_Channel, uint16\_t TIM\_OCMode);
> 
> **单独更改CCR寄存器的函数**
> 
> void TIM\_SetCompare1(TIM\_TypeDef\* TIMx, uint16\_t Compare1);  
> void TIM\_SetCompare2(TIM\_TypeDef\* TIMx, uint16\_t Compare2);  
> void TIM\_SetCompare3(TIM\_TypeDef\* TIMx, uint16\_t Compare3);  
> void TIM\_SetCompare4(TIM\_TypeDef\* TIMx, uint16\_t Compare4);
> 
> **高级定时器，使能PWM，否则无法正常输出**
> 
> void TIM\_CtrlPWMOutputs(TIM\_TypeDef\* TIMx, FunctionalState NewState);
