# local-client

A single webpage to control a ROS Robot locally. This will only work if the devices are on the same network.

## Features

- Display map
- Teleop
- Save/Delete locations
    - Retrieve saved locations
    - Send robot to location
- Get tasks
    - Link tasks to locations and send sequence to the robot
- ~~Save/Load map~~
- ~~Launch files (roslaunch)~~

## Prerequisites **[IMPORTANT!!]**
- Must have https://github.com/NP-Robotics/waypoint-web-system installed on ROS computer (robot)
```
cd catkin_ws/src
git clone https://github.com/NP-Robotics/waypoint-web-system
```

## Step 1: Start rosbridge (on robot)
Open terminal and type in:
```
roslaunch rosbridge_server rosbridge_websocket.launch
```

## Step 2: Open browser on same ~~other~~ computer ~~(on same network)~~

Please download the file onto your computer and then open the html file. There is an issue with https and ws. So as of now, you can only use the webpage (zeken.github.io) to view the page. It cannot be used to connect to your robot by using the online page. 

#### If you want to connect via another computer (other than robot), you can use python simple http server to make it available on the same network. 

BAM webpage

## Step 3: Connecting to rosbridge server
Open terminal and type in:
```
ifconfig
```
#### copy the inet addr usually ```192.168.something.something```

#### paste into _url input_ (beside "connect to server" button) it should look something like this:
```
ws://192.168.something.something:9090
```

#### If the button turns green, congrats! You can start using the webpage. 
#### If the button turns red, there was some error. You can check the error by opening the console

## Other notes
The load map, save map and launch file sections are not usable as I have not uploaded the services needed for them to function.

This website is hosted on github but I have used a custom domain name because rosbridge runs on websocket(ws) and normally a website hosted on github runs on https. https is a secure connection and will only allow connections to a websocket secure(wss) connection.

The design for this webpage is only suited for a computer screen (or anything as big).

Please file an issue if you have a suggestion or find a bug. Thanks!
