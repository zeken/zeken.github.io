# local-client

A single webpage to control a ROS Robot locally

## Features

- Display map
- Teleop
- Save/Delete locations
    - Retrieve saved locations
    - Send robot to location
- Get tasks
    - Link tasks to locations and send sequence to the robot
- Save/Load map
- Launch files (roslaunch)

## Prerequisites
- Must have https://github.com/NP-Robotics/waypoint-web-system installed
```
cd catkin_ws/src
git clone https://github.com/NP-Robotics/waypoint-web-system
```

## Setup (on robot)

### Basic Instinct
- clone this to your local machine


### Start rosbridge

```
roslaunch rosbridge_server rosbridge_websocket.launch
```
###  Using webpage on ros computer (local)
Open html file


### Using webpage on other computer on the same network (semi-local xD)

Open ```terminal``` and navigate into ```local-client``` folder

run a python simple server: 

```
python -m SimpleHTTPServer
```

### On remote machine
Go to browser and type in the robot's IP address and the port number e.g.
```
192.168.10.2:8000
```
BAM webpage


\*\*\**python runs a HTTP Server on port 8000 by default. If you want to change this just add the port number after the command*\*\*\*

## Other notes
The load map, save map and launch file sections are not usable as I have not uploaded the services needed for them to function.

There are random bits of jQuery and Bootstrap in this code. Yes it is very messy. No I will not spend time to clean it up. Why? This webpage was built for a specific application and will only be used once. As such there is no need for me to continue working on this.
