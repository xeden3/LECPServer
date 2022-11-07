# LECPServer

<img src="./logo/VI1_LECP.png" width="200" height="200" />

A faster and more concise open source PLC communication middleware than kepserver

LECPServer(Leanboard Equipment Communication Proxy Server), It is a high-performance industrial connectivity platform developed based on the JLean framework. It solves communications challenges with industrial devices and applications, with streamlined data through a single communications platform, Over 90% of PLCs can interact with applications through LECPServer by HTTP POST (Webapi), Users can connect, manage, monitor, and control diverse automation devices and software applications through one intuitive user interface. 

Different from KEPServer,Matrikonopc, the communication protocol used by KEPServer is the more common HTTP POST protocol used on the application side. In addition to reducing the difficulty of development and improving communication efficiency, it also avoids the authorization required to use OPC protocol.

Website: http://www.lecpserver.com

Documentation: http://www.lecpserver.com:3001/

Source code: https://github.com/xeden3/LECPServer

Bug reports: https://github.com/xeden3/LECPServer/issues

Download: https://github.com/xeden3/LECPServer/releases/

## 样例视频
> LECPServer连接并控制施耐德M200系列PLC [第一章] https://www.bilibili.com/video/BV1bK4y1Q7o8

> LECPServer连接并控制施耐德M200系列PLC [第二章] https://www.bilibili.com/video/BV1yA411T71C


## LECPServer 环境要求

操作系统：

* Windows 10 x64 (专业版和企业版)
* Windows 8.1 x64 (Windows 8、专业版和企业版)
* Windows 8 x64 (Windows 8、专业版和企业版)
* Windows 7 x64 (专业版、旗舰版和企业版)
* Windows Server 2016 x64
* Windows Server 2012 x64 R2
* Windows Server 2012 x64

系统最低配置如下:

* INTEL I3 或同等级别处理器
* 4GB 内存 (遵从操作系统建议)
* 500 MB 可用磁盘空间
* 以太网卡

系统需要安装的辅助运行时软件

LECPServer目前是基于 JLean v2.2.x 版本开发，而JLean v2.2.x版本需要以下辅助运行时软件

* Microsoft .NET Framework 4.6.1或以上
* Visual C++ Redistributable Packages for Visual Studio 2013

> Microsoft .NET Framework 4.6.1 https://dotnet.microsoft.com/download/dotnet-framework/thank-you/net461-web-installer

> Visual C++ Redistributable Packages for Visual Studio 2013 https://www.microsoft.com/zh-cn/download/details.aspx?id=40784

## 使用方法
1. 解压zip文件到文件夹
2. 双击启动 LECPServer.exe 即可

## 用户界面

![ofins](./imgs/ofins_04.jpg)
![webapi](./imgs/webapi.jpg)

## 功能特性

* 简洁明了的图形操作界面
* WebAPI读写支持
* 海量PLC通讯协议支持
* 高效负载
* 国际化 [查看已可选的语言](#国际化)
* HTTP Debugger 工具
* 系统日志


## 性能测试

测试设备
1. CPU INTEL Core I7-1065G7 1.30Ghz处理器
2. 16GB DDR4 内存
3. SSD M2 磁盘
4. Windows10 专业版 1909 64bit 操作系统
5. 施耐德 TM200CE24R PLC

测试方法
1. 给PLC设置一个BOOL点位C0000和一个WORD点位H0000，开启50个读线程和50个写线程，运行 plc_read_node 和 plc_write_node 命令，测试两个命令的响应速度
2. 给PLC设置一个BOOL点位C0000和一个WORD点位H0000，开启50个读线程和50个写线程，运行 plc_read_nodes 和 plc_write_nodes 命令，测试两个命令的响应速度

结论，第一组测试结果，50个读线程和50个写线程，针对单个线程的读写返回时间在10ms-13ms，第二组测试结果，50个读线程和50个写线程，针对单个读写返回时间在20ms-24ms


![debugger6](./imgs/debug_06.gif)
![debugger7](./imgs/debug_07.gif)


## 国际化
欢迎大家将 LECPServer 翻译成更多的语言版本。


| Key | 语言 |状态|
|----- |------|----|
| cn | 简体中文 | ✔️ @xeden3
| en| English | ✔️ @xeden3
| jp | 日本語 | @xeden3

## 关于JLean授权

LECPServer 为免费开源软件，所有功能均免费，其内核为JLean，内核需要遵循JLean的授权模式。 针对LECPServer的功能，如果只针对两个PLC，则完全可以免费使用，但若需要两个以上的PLC进行链路，则需要给JLean进行授权。

JLean的网站 http://www.jlean.org

