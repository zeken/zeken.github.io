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

## Prerequisites
- Must have https://github.com/NP-Robotics/waypoint-web-system installed on ROS computer (robot)
```
cd catkin_ws/src
git clone https://github.com/NP-Robotics/waypoint-web-system
```

## Step 1: Start rosbridge (on robot)

```
roslaunch rosbridge_server rosbridge_websocket.launch
```

## Step 2: Open browser on other computer (on same network)

```
abudory.website
```
BAM webpage


## Other notes
The load map, save map and launch file sections are not usable as I have not uploaded the services needed for them to function.

This website is hosted on github but I have used a custom domain name because rosbridge runs on websocket(ws) and normally a website hosted on github runs on https. https is a secure connection and will only allow connections to a websocket secure(wss) connection.

The design for this webpage is only suited for a computer screen (or anything as big).

Please file an issue if you have a suggestion or find a bug. Thanks!
