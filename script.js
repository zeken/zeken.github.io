$(document).ready(function () {
  var ros;
  // button declaration
  var connectButton = document.getElementById("connect-butt");
  var mapButton = document.getElementById("map-butt");
  var fast = document.getElementById("speed-1");
  var normal = document.getElementById("speed-2");
  var slow = document.getElementById("speed-3");
  var initialPose = document.getElementById("init-pose");
  var callServiceButton = document.getElementById("serv-butt");
  var addLocation = document.getElementById("add-location");
  var delLocation = document.getElementById("del-location");
  var getLocation = document.getElementById("get-location");
  var goTo = document.getElementById("go");
  var setSpeed = document.getElementById("set-speed");
  var test1Button = document.getElementById("test1-butt");
  var test2Button = document.getElementById("test2-butt");
  var saveMap = document.getElementById("save-map");
  var delAllLocations = document.getElementById("del-all-locations");
  var loadMap = document.getElementById("load-map");
  var loadMapActivate = document.getElementById("load-map-activate");
  var saveMapActivate = document.getElementById("save-map-activate");
  var launchFile = document.getElementById("launch-file");
  var addSequence = document.getElementById("add-sequence");
  var getTasks = document.getElementById("get-tasks");
  var arrangeSequence = document.getElementById("arr-sequence");


  // select
  var allLocations = document.getElementById("all-locations");
  var mapListSelect = document.getElementById("map-list");
  var allTasks = document.getElementById("all-tasks");

  // input
  var setLinearSpeed = $("#set-linear-speed").val;
  var setAngularSpeed = $("#set-angular-speed").val;

  // p
  var clickShowMap = document.getElementById("click-show-map");

  var changeForMap;

  var tempGoal = new ROSLIB.Message({
    header: {
      seq: 1,
      stamp: {
        secs: 0,
        nsecs: 0
      },
      frame_id: '',
    },
    goal_id: {
      stamp: {
        secs: 0,
        nsecs: 0,
      },
      id: '',
    },
    goal: {
      target_pose: {
        header: {
          seq: 1,
          stamp: {
            secs: 0,
            nsecs: 0
          },
          frame_id: "map"
        },
        pose: {
          position: {
            x: 0.0,
            y: 0.0,
            z: 0.0
          },
          orientation: {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            w: 0.0
          }
        }
      }
    }
  });

  var initialPosePublisherMessage = new ROSLIB.Message({
    position: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    orientation: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
      w: 0.0
    }
  });

  document.getElementById("load-map-div").style.display = "none";
  document.getElementById("save-map-div").style.display = "none";


  // var rosout = new ROSLIB.Topic({
  //   ros: ros,
  //   name: '/rosout',
  //   messageType: 'rosgraph_msgs/Log'
  // });
  // rosout.subscribe(function (message){
  //   console.log(message);
  // });

  var errorLevel;

  connectButton.addEventListener('click', () => {
    // Connecting to ROS
    var urlInput = document.getElementById("connect-url").value;
    ros = new ROSLIB.Ros({
      url: urlInput
    });

    // successful connection
    ros.on('connection', function () {
      console.log('[Websocket] Connected to websocket server.');
      connectButton.classList.remove("btn-primary");
      connectButton.classList.remove("btn-danger");
      connectButton.classList.remove("btn-warning");
      connectButton.classList.add("btn-success");
    });
    // connection error
    ros.on('error', function (error) {
      console.log('[Websocket] Error connecting to websocket server: ', error);
      connectButton.classList.remove("btn-primary");
      connectButton.classList.remove("btn-success");
      connectButton.classList.remove("btn-danger");
      connectButton.classList.add("btn-warning");
    });
    // close connection
    ros.on('close', function () {
      console.log('[Websocket] Connection to websocket server closed.');
      connectButton.classList.remove("btn-primary");
      connectButton.classList.remove("btn-success");
      connectButton.classList.remove("btn-warning");
      connectButton.classList.add("btn-danger");
    });

    speed.x = 1.0;
    speed.z = 0.5;

    var rosout = new ROSLIB.Topic({
      ros: ros,
      name: '/rosout',
      messageType: 'rosgraph_msgs/Log'
    });
    rosout.subscribe(function (message) {
      errorLevel = message.level;
      if (errorLevel == 8) {
        // print error straight from /rosout
        console.log(message.msg);
        str = message.msg;
        var n = str.search("call_service InvalidServiceException");
        if (n != -1) {
          alert("The service you are trying to call has not started");
        } else {
          alert("Error! Please check console");
        }
      }
    });

    $("#click-show-map").text("click \"set initial pose\" or \"show map\"");

    localStorage.setItem("wsurl", urlInput);
  });
  $("#connect-url").val(localStorage.getItem("wsurl"));

  // show rosout
  test1Button.addEventListener('click', () => {
    var rosout = new ROSLIB.Topic({
      ros: ros,
      name: '/rosout',
      messageType: 'rosgraph_msgs/Log'
    });
    rosout.subscribe(function (message) {
      console.log("[ROSOUT] " + message.msg);
      console.log(message);
    });
  });
  // unshow rosout
  test2Button.addEventListener('click', () => {
    var rosout = new ROSLIB.Topic({
      ros: ros,
      name: '/rosout',
      messageType: 'rosgraph_msgs/Log'
    });
    rosout.unsubscribe();
    console.log("[ROSOUT] unsubscribed");
  });


  // speed variable
  var speed = {
    xInternal: setLinearSpeed,
    zInternal: setAngularSpeed,
    set x(val) {
      this.xInternal = val;
      $("#set-linear-speed").val(val);
      console.log("[Speed] linear: " + val);
    },
    get x() {
      return this.xInternal;
    },
    set z(val) {
      this.zInternal = val;
      $("#set-angular-speed").val(val);
      console.log("[Speed] angular: " + val);
    },
    get z() {
      return this.zInternal;
    },
  }
  
  fast.addEventListener('click', () => {
    speed.x = 1.5;
    speed.z = 1.0;

    fast.classList.add("btn-success");
    slow.classList.remove("btn-success");
    normal.classList.remove("btn-success");
    console.log("[Speed] fast");
  })
  normal.addEventListener('click', () => {
    speed.x = 1.0;
    speed.z = 0.5;

    normal.classList.add("btn-success");
    fast.classList.remove("btn-success");
    slow.classList.remove("btn-success");
    console.log("[Speed] normal");
  })
  slow.addEventListener('click', () => {
    speed.x = 0.5;
    speed.z = 0.25;

    slow.classList.add("btn-success");
    fast.classList.remove("btn-success");
    normal.classList.remove("btn-success");
    console.log("[Speed] slow");
  })

  // manual set speed
  setSpeed.addEventListener('click', () => {
    speed.x = $("#set-linear-speed").val();
    speed.z = $("#set-angular-speed").val();
  });

  // publish a topic (/cmd_vel)
  function publishATopic(mess) {
    var cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    });
    var forward = new ROSLIB.Message({
      linear: {
        x: parseFloat(speed.x),
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
    });
    var backward = new ROSLIB.Message({
      linear: {
        x: - + speed.x,
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
    });
    var turnLeft = new ROSLIB.Message({
      linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: parseFloat(speed.z)
      }
    });
    var turnRight = new ROSLIB.Message({
      linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: - + speed.z
      }
    });
    var stop = new ROSLIB.Message({
      linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
    });

    switch (mess) {
      case "forward":
        cmdVel.publish(forward);
        console.log("[/cmd_vel]: forward");
        break;
      case "backward":
        cmdVel.publish(backward);
        console.log("[/cmd_vel]: backward");
        break;

      case "right-turn":
        cmdVel.publish(turnRight);
        console.log("[/cmd_vel]: turn right");
        break;

      case "left-turn":
        cmdVel.publish(turnLeft);
        console.log("[/cmd_vel]: turn left");
        break;

      case "stop":
        cmdVel.publish(stop);
        console.log("[/cmd_vel]: stop");
        break;
      default:
      // code block
    }

  }

  // arrow key press down
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        publishATopic("left-turn");
        break;
      case 38:
        publishATopic("forward");
        break;
      case 39:
        publishATopic("right-turn");
        break;
      case 40:
        publishATopic("backward");
        break;
    }
  };
  // arrow key press up
  document.onkeyup = function (e) {
    switch (e.keyCode) {
      case 37:
        publishATopic("stop");
        console.log("keyup, stopping");
        break;
      case 38:
        publishATopic("stop");
        console.log("keyup, stopping");
        break;
      case 39:
        publishATopic("stop");
        console.log("keyup, stopping");
        break;
      case 40:
        publishATopic("stop");
        console.log("keyup, stopping");
        break;
    }
  };
  // mouse up and down when clicking to move robot
  document.onmousedown = () => {
    document.getElementById("forward").onmouseup = () => {
      publishATopic("stop");
    }
    document.getElementById("backward").onmouseup = () => {
      publishATopic("stop");
    }
    document.getElementById("left-turn").onmouseup = () => {
      publishATopic("stop");
    }
    document.getElementById("right-turn").onmouseup = () => {
      publishATopic("stop");
    }
    document.getElementById("stop").onmousedown = () => {
      publishATopic("stop");
    }
    document.getElementById("forward").onmousedown = () => {
      publishATopic("forward");
    }
    document.getElementById("backward").onmousedown = () => {
      publishATopic("backward");
    }
    document.getElementById("left-turn").onmousedown = () => {
      publishATopic("left-turn");
    }
    document.getElementById("right-turn").onmousedown = () => {
      publishATopic("right-turn");
    }
  }


  // // call a service
  // callServiceButton.addEventListener('click', () => {
  //   var name = $("#serv-name").val();
  //   var e = document.getElementById("serv-type");
  //   var strUser = e.options[e.selectedIndex].value;
  //   console.log(name + " " + strUser);
  //   var serviceClientName = new ROSLIB.Service({
  //     ros: ros,
  //     name: '/' + name,
  //     serviceType: strUser
  //   });

  //   var request = new ROSLIB.ServiceRequest({
  //     // a: 1,
  //     // b: 2
  //     mapname: "something",
  //     path: "/home/harley/catkin_ws/src/test_msgs/maps/"
  //   });

  //   serviceClientName.callService(request, function (result) {
  //     // var display = 'Result for service call on ' + serviceClientName.name + ': ' + result.sum;
  //     display = result.message;
  //     console.log(display);
  //     $("#serv-result").html(display);
  //   });
  // });

  // save location
  var x = 0, y = 0, z = 0, w = 0;
  addLocation.addEventListener('click', () => {
    var userLocationName = $("#location-name").val();

    var oneTimeListener = new ROSLIB.Topic({
      ros: ros,
      name: '/robot_pose',
      messageType: 'geometry_msgs/Pose'
    });
    // console.log("[Location] adding subscriber");

    var addLocationService = new ROSLIB.Service({
      ros: ros,
      name: '/web_service/add_location',
      serviceType: 'web_service_jeremy_v1/NamePose'
    });
    // console.log("[Location] connected to service");

    let tempMessage, tempRequest;
    // $("#save-del-result").html("robot has not started!");

    setTimeout(() => {
      if (x === 0 && y === 0 && z === 0 && w === 0) {
        let display = "robot_pose is not published! Cannot add location!";
        console.log("[Location add] " + display);
        $("#save-del-result").html(display);
      } else {
        // subscriber details & data
        // console.log('[Location] Received message on ' + oneTimeListener.name + ': ' + tempMessage.data);

        tempRequest = new ROSLIB.ServiceRequest({
          name: userLocationName,
          x: toString(x),
          y: toString(y),
          z: toString(z),
          w: toString(w),
        });
        console.log("[Location add] request sent to service with " + x + ", " + y + ", " + z + ", " + w);
        addLocationService.callService(tempRequest, function (result) {
          let display = result.message;
          console.log("[Location add] success: " + result.success);
          console.log("[Location add] message: " + display);
          if (result.success == false) {
            $("#save-del-result").html("Location not added: " + display);
          } else {
            $("#save-del-result").html(display);
          }
        });
      }

    }, 500);
    // subscribe to /robot_pose
    oneTimeListener.subscribe(function (tempMessage) {
      x = tempMessage.position.x;
      y = tempMessage.position.y;
      z = tempMessage.orientation.z;
      w = tempMessage.orientation.w;
      oneTimeListener.unsubscribe();
      // console.log("[Location] removed subscriber");

    });


  });
  // delete location
  delLocation.addEventListener('click', () => {
    let display = "Waiting for service to start..."
    $("#save-del-result").html(display);

    var userLocationName = $("#location-name").val();

    var delLocationClient = new ROSLIB.Service({
      ros: ros,
      name: '/web_service/delete_location',
      serviceType: 'web_service_jeremy_v1/Strings'
    });
    // console.log("[Location del] connected to service");

    var tempRequest = new ROSLIB.ServiceRequest({
      name: userLocationName,
    });
    // console.log(userLocationName);
    // console.log("[Location] request sent with " + x + ", " + y + ", " + z + ", " + w);

    delLocationClient.callService(tempRequest, function (result) {
      var display = result.message;
      console.log("[Location del] " + result.success);
      console.log("[Location del] " + display);
      $("#save-del-result").html(display);
    });
  });
  // delete all locations
  delAllLocations.addEventListener('click', () => {
    var c = confirm("Are you sure you want to delete all locations?");
    let display = "Waiting to delete all locations..."
    $("#save-del-result").html(display);
    if (c == true) {
      var delAllLocationsClient = new ROSLIB.Service({
        ros: ros,
        name: '/web_service/delete_all_location',
        serviceType: 'std_srvs/SetBool'
      });

      var request = new ROSLIB.ServiceRequest({
        data: false
      });

      delAllLocationsClient.callService(request, function (result) {
        console.log("[Location del all] " + result.success);
        console.log("[Location del all] " + result.message);
        let display = "All locations deleted!"
        $("#save-del-result").html(result.message);
      });

    } else {
      let display = "Locations not deleted don't worry ;)"
      $("#save-del-result").html(display);
    }
  });


  // get location
  getLocation.addEventListener('click', () => {
    $("#all-locations-result").html("waiting for locations...");

    // clear the list
    allLocations.options.length = 0;

    var getLocationService = new ROSLIB.Service({
      ros: ros,
      name: '/web_service/retrieve_all_location',
      serviceType: 'waypoint_msgs/WaypointsList'
    });
    var getLocationRequest = new ROSLIB.ServiceRequest({
      data: false
    });

    getLocationService.callService(getLocationRequest, function (result) {
      console.log("[Location ret all] " + result.success);
      console.log(result.ID);

      var t = result.ID;

      // console.log(message.ID); //print the whole msg
      var numberOfLocations = result.ID.length;

      for (var i = 0, o; numberOfLocations > i; i++) {
        o = new Option(t[i].name, i);
        // jquerify the DOM object 'o' so we can use the html method
        $(o).html(t[i].name);
        $("#all-locations").append(o);
      }
      $("#all-locations-result").html("Locations retrieved!");
    });
  });
  // go to location
  goTo.addEventListener('click', () => {
    var getLocationService = new ROSLIB.Service({
      ros: ros,
      name: '/web_service/retrieve_location',
      serviceType: 'web_service_jeremy_v1/Strings'
    });

    var getLocationRequest = new ROSLIB.ServiceRequest({
      name: $('#all-locations').find(":selected").text()
    });

    var sendGoal = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base/goal',
      messageType: 'move_base_msgs/MoveBaseActionGoal'
    });

    getLocationService.callService(getLocationRequest, function (result) {
      console.log("[Location] " + result.success);
      console.log("[Location] " + result.message);

      var locationName = result.ID.name
      tempGoal.goal.target_pose.pose.position.x = parseFloat(result.ID.pose.x);
      tempGoal.goal.target_pose.pose.position.y = parseFloat(result.ID.pose.y);
      tempGoal.goal.target_pose.pose.orientation.z = parseFloat(result.ID.pose.z);
      tempGoal.goal.target_pose.pose.orientation.w = parseFloat(result.ID.pose.w);
      sendGoal.publish(tempGoal);

      $("#all-locations-result").html("Sending robot to " + locationName);
      console.log("[Location] sending robot to " + locationName);
    });
  });

  var sequenceArray = [], textnode;
  arrangeSequence.addEventListener('click', () => {
    listAddLocation = allLocations.options[allLocations.selectedIndex].text;    // get selected option
    listAddTask = allTasks.options[allTasks.selectedIndex].text;
    var node = document.createElement("LI");                 // Create a <li> node
    textnode = document.createTextNode("Location: " + listAddLocation + " Task: " + listAddTask);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("sequence").appendChild(node);     // Append <li> to <ul> with id="sequence"

    objectForArray = {
      location: listAddLocation,
      task: listAddTask
    };
    sequenceArray.push(objectForArray);
    console.log(node.innerHTML);
    console.log(sequenceArray);
    console.log(textnode);
  });

  addSequence.addEventListener('click', () => {

    $("#sequence-result").text("Sending Robot with sequence");
    var addSequenceService = new ROSLIB.Service({
      ros: ros,
      name: '/web_service/waypoint_sequence',
      serviceType: 'waypoint_msgs/WaypointSequence'
    });

    // var t = {
    //   location: "",
    //   task: "",
    // }
    // var sequenceArray = [];
    // t.location = "bus";
    // t.task = "punch";
    // sequenceArray[0] = t;

    // console.log(t);

    var addSequenceRequest = new ROSLIB.ServiceRequest({
      sequence: sequenceArray
    });

    addSequenceService.callService(addSequenceRequest, function (result) {
      console.log(result.success);
      if (result.success == "true") {
        $("#sequence").empty();
        sequenceArray.length = 0;
      }
    });
  });

  getTasks.addEventListener('click', () => {
    allTasks.options.length = 0;

    var getTaskService = new ROSLIB.Service({
      ros: ros,
      name: '/web_service/task_list',
      serviceType: 'waypoint_msgs/TaskList'
    });
    var getTaskRequest = new ROSLIB.ServiceRequest({

    });
    getTaskService.callService(getTaskRequest, function (result) {
      // console.log(result.task); // print all tasks

      var t = result.task;

      // console.log(message.ID); //print the whole msg
      var numberOfTasks = result.task.length;

      for (var i = 0, o; numberOfTasks > i; i++) {
        o = new Option(t[i], i);
        // jquerify the DOM object 'o' so we can use the html method
        $(o).html(t[i].name);
        $("#all-tasks").append(o);
      }
    });
  });

  // activate load map div
  loadMapActivate.addEventListener('click', () => {

    var loadMapList = new ROSLIB.Topic({
      ros: ros,
      name: '/list_maps',
      messageType: 'test_srvs/NameList'
    });
    document.getElementById("load-map-div").style.display = "flex";
    document.getElementById("save-map-div").style.display = "none";

    // clear list everytime button is pressed
    mapListSelect.options.length = 0;

    var loadMapService = new ROSLIB.Service({
      ros: ros,
      name: '/test_srvs/map_list_service',
      serviceType: 'test_srvs/MapList'
    });
    var loadMapRequest = new ROSLIB.ServiceRequest({
      data: false
    });

    setTimeout(() => {
      loadMapService.callService(loadMapRequest, function (result) {
        console.log("[Load Map] loaded list of maps: " + result.query);
      });
    }, 300);

    loadMapList.subscribe(function (message) {
      // console.log(message.names);
      o = new Option();
      // console.log(o);
      $(o).html(message.names);
      $("#map-list").append(o);
    });
    setTimeout(() => {
      loadMapList.unsubscribe();
    }, 1500);

  });
  // activate save map div
  saveMapActivate.addEventListener('click', () => {
    document.getElementById("save-map-div").style.display = "flex";
    document.getElementById("load-map-div").style.display = "none";

  });

  // save map
  saveMap.addEventListener('click', () => {
    var mapname = $("#map-name").val();
    var path = $("#path-save").val();
    var saveMapClient = new ROSLIB.Service({
      ros: ros,
      name: '/test_srvs/save_map_service',
      serviceType: 'test_msgs/SaveMap'
    });
    var saveMapRequest = new ROSLIB.ServiceRequest({
      mapname: mapname,
      path: path
    });
    saveMapClient.callService(saveMapRequest, function (result) {
      console.log("[Save Map]: " + result.query);
      console.log("[Save Map]: " + result.message);
    });
    // save last typed in
    localStorage.setItem("pathname", path);
  });
  $("#path-save").val(localStorage.getItem("pathname"));

  // switch map
  loadMap.addEventListener('click', () => {

    var switchMapService = new ROSLIB.Service({
      ros: ros,
      name: '/test_srvs/switch_map_service',
      serviceType: 'test_srvs/SwitchMap'
    });
    var switchMapRequest = new ROSLIB.ServiceRequest({
      mapname: mapListSelect.value
    });
    switchMapService.callService(switchMapRequest, function (result) {
      console.log("[Load Map]: " + result.query + ", " + result.message);
      if (result.query == "false") {
        alert("Error! Please check console");
      }
    });
  });

  launchFile.addEventListener('click', () => {
    var packageName = $("#launch-folder-name").val();
    var fileName = $("#launch-file-name").val();

    var launchFileService = new ROSLIB.Service({
      ros: ros,
      name: '/test_srvs/launch_file_service',
      serviceType: 'test_srvs/LaunchFiles'
    });
    var launchFileRequest = new ROSLIB.ServiceRequest({
      pacname: packageName,
      filename: fileName
    });
    launchFileService.callService(launchFileRequest, function (result) {
      console.log(result.query);
      console.log(result.message);
    });
  })



  var initialPosePublisher;
  var initialPosePublisherMessage;
  var mapButtonClicked;

  // disable initial pose thing when map is pressed
  var initialPoseListener;
  var clicked = false;

  $(initialPose).on('click', function () {
    clicked = true;
    // $(this).prop('disabled', true);
  });

  // set intial pose
  initialPose.addEventListener('click', () => {
    // clear the viewer to put a new one
    $("#map").empty();
    $("#initial-map-to-delete").empty();

    mapButton.style.display = "none";

    var viewer = new ROS2D.Viewer({
      divID: 'initial-map-to-delete',
      width: 600,
      height: 600
    });
    var nav = NAV2D.OccupancyGridClientNav({
      ros: ros,
      rootObject: viewer.scene,
      viewer: viewer,
      continuous: true,
      serverName: '/move_base',
      withOrientation: true
    });
    // publish to /robot_pose
    initialPosePublisher = new ROSLIB.Topic({
      ros: ros,
      name: '/robot_pose',
      messageType: '/geometry_msgs/Pose'
    });
    // subscribe to /move_base_simple/goal
    initialPoseListener = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base/goal',
      messageType: '/move_base_msgs/MoveBaseActionGoal'
    });
    $("#click-show-map").text("click the map to set initial pose");

    initialPoseListener.subscribe(function (message) {

      // clear viewer to put new one
      $("#map").empty();
      $("#initial-map-to-delete").empty();

      console.log("[Initial Pose] received initial pose");
      // initialPoseListener.unsubscribe();
      // publish to /robot_pose

      // message to publish
      initialPosePublisherMessage = {
        position: {
          x: message.goal.target_pose.pose.position.x,
          y: message.goal.target_pose.pose.position.y,
          z: 0.0
        },
        orientation: {
          x: 0.0,
          y: 0.0,
          z: message.goal.target_pose.pose.orientation.z,
          w: message.goal.target_pose.pose.orientation.w
        }
      };
      // publish data from goal to robot pose
      initialPosePublisher.publish(initialPosePublisherMessage);
      $("#click-show-map").text("click \"show map\"");
      // $(mapButton).toggle(() => {
      //   mapButtonClicked = true;
      //   mapButton.click = false;
      // });
      initialPoseListener.unsubscribe();

      // turn map button display back on
      // mapButton.style.display = "inline";

      $("#click-show-map").text("");
      if (clicked == true) {
        // initialPoseListener.unsubscribe();
        // send goal pose to robot pose
        setTimeout(() => {
          initialPosePublisher.publish(initialPosePublisherMessage);
          console.log("[initial pose] sent initial pose");
        }, 300);
      }
      // Create the main viewer.
      var viewer = new ROS2D.Viewer({
        divID: 'map',
        width: 600,
        height: 600
      });
      // Add zoom to the viewer.
      var zoomView = new ROS2D.ZoomView({
        rootObject: viewer.scene
      });
      // Add panning to the viewer.
      var panView = new ROS2D.PanView({
        rootObject: viewer.scene
      });
      // // Setup the map client.
      // var gridClient = new ROS2D.OccupancyGridClient({
      //   ros: ros,
      //   rootObject: viewer.scene,
      //   continuous: true
      // });
      // Setup the nav client.
      // // Scale the canvas to fit to the map
      // gridClient.on('change', function () {
      //   viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
      //   viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
      //   registerMouseHandlers();
      // });
      var nav = NAV2D.OccupancyGridClientNav({
        ros: ros,
        rootObject: viewer.scene,
        viewer: viewer,
        continuous: true,
        serverName: '/move_base',
        withOrientation: true
      });
      // display path
      var path = new ROSLIB.Topic({
        ros: ros,
        name: '/move_base/GlobalPlanner/plan',
        messageType: 'nav_msgs/Path'
      });
      var messageForPath;
      path.subscribe(function (message) {
        console.log('received msg for path ' + path.name + ': ' + message);
        // path.unsubscribe();
        // Add path shape: A shape to draw a nav_msgs / Path msg
        messageForPath = message;
        targetPath.setPath(message);
        viewer.scene.addChild(targetPath);
      });
      var targetPath = new ROS2D.PathShape({
        ros: ros,
        path: messageForPath,
        strokeSize: 0.2,
        strokeColor: createjs.Graphics.getRGB(255, 0, 0)
      });
      var simpleGoal = new ROSLIB.Topic({
        ros: ros,
        name: '/move_base_simple/goal',
        messageType: 'geometry_msgs/PoseStamped'
      });
      simpleGoal.subscribe(function () {
        console.log("received message from simple goal for path");
        targetPath.setPath();
      });
    });


  });




  // // only allow map button to be pressed once
  // $(mapButton).on('click', function () {
  //      initialPose.disabled = true;
  //   $(this).prop('disabled', true);
  // });
  // Display the map after button is pressed: map viewer, map client, scale canvas
  mapButton.addEventListener('click', () => {
    $("#map").empty();
    $("#initial-map-to-delete").empty();
    // document.getElementById("init-pose").style.display = "none";
    $("#click-show-map").text("");


    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
      divID: 'map',
      width: 600,
      height: 600
    });
    // Add zoom to the viewer.
    var zoomView = new ROS2D.ZoomView({
      rootObject: viewer.scene
    });
    // Add panning to the viewer.
    var panView = new ROS2D.PanView({
      rootObject: viewer.scene
    });
    // Setup the nav client.
    var nav = NAV2D.OccupancyGridClientNav({
      ros: ros,
      rootObject: viewer.scene,
      viewer: viewer,
      continuous: true,
      serverName: '/move_base',
      withOrientation: true
    });
    var path = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base/GlobalPlanner/plan',
      messageType: 'nav_msgs/Path'
    });
    var messageForPath;
    path.subscribe(function (message) {
      // path message received
      // console.log('received msg for path ' + path.name + ': ' + message);
      // path.unsubscribe();
      // Add path shape: A shape to draw a nav_msgs / Path msg
      messageForPath = message;
      targetPath.setPath(message);
      viewer.scene.addChild(targetPath);
    });
    var targetPath = new ROS2D.PathShape({
      ros: ros,
      path: messageForPath,
      strokeSize: 0.2,
      // strokeColor: createjs.Graphics.getRGB(0, 2, 0)
    });
    var simpleGoal = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base_simple/goal',
      messageType: 'geometry_msgs/PoseStamped'
    });
    simpleGoal.subscribe(function () {
      console.log("[Show Map] received message from simple goal for path");
      targetPath.setPath();
    });

    // Setup mouse event handlers
    function registerMouseHandlers() {
      var mouseDown = false;
      var zoomKey = false;
      var panKey = false;
      var startPos = new ROSLIB.Vector3();
      viewer.scene.addEventListener('stagemousedown', function (event) {
        if (event.nativeEvent.ctrlKey === true) {
          zoomKey = true;
          zoomView.startZoom(event.stageX, event.stageY);
        }
        else if (event.nativeEvent.shiftKey === true) {
          panKey = true;
          panView.startPan(event.stageX, event.stageY);
        }
        startPos.x = event.stageX;
        startPos.y = event.stageY;
        mouseDown = true;
      });

      viewer.scene.addEventListener('stagemousemove', function (event) {
        if (zoomKey === true) {
          if (mouseDown === true) {
            var dy = event.stageY - startPos.y;
            var zoom = 1 + 10 * Math.abs(dy) / viewer.scene.canvas.clientHeight;
            if (dy < 0)
              zoom = 1 / zoom;
            zoomView.zoom(zoom);
          }
        }
        else if (panKey === true) {
          if (mouseDown === true)
            panView.pan(event.stageX, event.stageY);
        }
      });

      viewer.scene.addEventListener('stagemouseup', function (event) {
        if (mouseDown === true) {
          if (zoomKey === true) {
            zoomKey = false;
          }
          else if (panKey === true)
            panKey = false;
          mouseDown = false;
        }
      });
    }
  });
})