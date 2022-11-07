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

## Example Video
> LECPServer connects and controls Schneider M200 series PLC [Chapter 1] https://www.bilibili.com/video/BV1bK4y1Q7o8

> LECPServer connects and controls Schneider M200 series PLC [Chapter 2] https://www.bilibili.com/video/BV1yA411T71C


## LECPServer Environment Requirements

Operating system：

* Windows 10 x64 (Pro and Enterprise)
* Windows 8.1 x64 (Windows 8, Professional and Enterprise)
* Windows 8 x64 (Windows 8, Professional and Enterprise)
* Windows 7 x64 (Pro, Ultimate and Enterprise)
* Windows Server 2016 x64
* Windows Server 2012 x64 R2
* Windows Server 2012 x64

The minimum system configuration is as follows:

* INTEL I3 or equivalent processor
* 4GB RAM (follow OS recommendations)
* 500 MB free disk space
* 1G Ethernet card

Auxiliary runtime software that the system needs to install

LECPServer is currently developed based on the JLean v2.2.x platform, and the JLean v2.2.x version requires the following auxiliary runtime software

* Microsoft .NET Framework 4.6.1 or above
* Visual C++ Redistributable Packages for Visual Studio 2013

> Microsoft .NET Framework 4.6.1 https://dotnet.microsoft.com/download/dotnet-framework/thank-you/net461-web-installer
> Visual C++ Redistributable Packages for Visual Studio 2013 https://www.microsoft.com/zh-cn/download/details.aspx?id=40784

## Instructions
1. Extract the zip file to a folder
2. Double-click to start LECPServer.exe

## User Interface

![ofins](./imgs/ofins_04.jpg)
![webapi](./imgs/webapi.jpg)

## Features

* Simple and clear GUI
* WebAPI read and write support
* Massive PLC communication protocol support
* Efficient load
* Internationalization [view selected languages](#internationalization)
* HTTP Debugger tool
* System log


## Performance Testing

Test Equipment
1. CPU INTEL Core I7-1065G7 1.30Ghz processor
2. 16GB DDR4 RAM
3. SSD M2 disk
4. Windows10 Professional 1909 64bit Operating System
5. Schneider TM200CE24R PLC

testing method
1. Set a BOOL point C0000 and a WORD point H0000 for the PLC, open 50 read threads and 50 write threads, run the plc_read_node and plc_write_node commands, and test the response speed of the two commands
2. Set a BOOL point C0000 and a WORD point H0000 for the PLC, open 50 read threads and 50 write threads, run the plc_read_nodes and plc_write_nodes commands, and test the response speed of the two commands

Conclusion, the first set of test results, 50 read threads and 50 write threads, the read and write return time for a single thread is 10ms-13ms, the second set of test results, 50 read threads and 50 write threads, for a single read Write return time is 20ms-24ms

![debugger6](./imgs/debug_06.gif)
![debugger7](./imgs/debug_07.gif)


## internationalization
Thanks to translate LECPServer into more languages.


| Key | language | status |
|----- |------|----|
| cn | 简体中文 | ✔️ @xeden3
| en| English | ✔️ @xeden3
| jp | 日本語 | @xeden3

## About JLean authorization

LECPServer is free and open source software, all functions are free, its kernel is JLean, and the kernel needs to follow the JLean authorization model. For the function of LECPServer, if it is only for two PLCs, it can be used for free, but if more than two PLCs are required for linking, JLean needs to be authorized.

JLean website http://www.jlean.org

