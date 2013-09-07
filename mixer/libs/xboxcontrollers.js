window.XBOXControllers = {
  supported: false,
  previousRawControllers: [],
  rawControllers: [],

  previousControllers: [],
  controllers: [],

  stopPollingForControllers: function(){ this._stopPollingForControllers = true; },
  _stopPollingForControllers: false,

  _setRawController: function(index, controller){
    // cache the previous state
    this.previousRawControllers[index] = this.rawControllers[index];

    this.rawControllers[index] = {
      id: controller.id,
      axes: controller.axes.slice(0),
      buttons: controller.buttons.slice(0),
      timestamp: controller.timestamp
    };
  },

  getControllers: function(){
    if(this._stopPollingForControllers) return;
    var controllers = (navigator.webkitGetGamepads && navigator.webkitGetGamepads())
                        || navigator.webkitGamepads
                        || [];

    var changed = false;
    for(var i = 0; i < controllers.length; i++){
      var currentController = controllers[i];

      // the controller state has changed
      // Relies on the controllers timestamp, which is only supported in Chrome atm
      if(currentController && this.rawControllers[i] && (currentController.timestamp != this.rawControllers[i].timestamp)){
        changed = true;
        this._setRawController(i, currentController);
      }else if(currentController && !this.rawControllers[i]){
        // add a new controller
        changed = true;
        this._setRawController(i, currentController);
      }

    }
    if(changed){
      this.updateControllers();
      this.onUpdate();
    }
  },

  updateControllers: function(){
    var rawControllers = this.rawControllers;
    for(var i = 0; i < rawControllers.length; i++){
      var currentController = rawControllers[i];

      var type = currentController.buttons[6] === 0.5 ? 'turntable' : 'controller';
      var controllerObject = { type: type };

      var buttons = currentController.buttons;
      var axes = currentController.axes;

      controllerObject.buttons = {
        y: buttons[3],
        b: buttons[1],
        a: buttons[0],
        x: buttons[2],
        up: buttons[12],
        right: buttons[15],
        down: buttons[13],
        left: buttons[14],
        home: buttons[16],
        start: buttons[9],
        select: buttons[8]
      };

      if(type == 'turntable'){        
        controllerObject.buttons.blue = buttons[2];
        controllerObject.buttons.red = buttons[1];
        controllerObject.buttons.green = buttons[0];
        controllerObject.buttons.special = buttons[3];

        controllerObject.axes = {
          turntable: axes[1],
          knob: axes[2],
          crossfade: axes[3]
        };
      }else{
        controllerObject.buttons.left_bumper = buttons[4];
        controllerObject.buttons.right_bumper = buttons[5];
        controllerObject.buttons.left_trigger = buttons[6];
        controllerObject.buttons.right_trigger = buttons[7];

        controllerObject.axes = {
          left_analog_x: axes[0],
          left_analog_y: axes[1],
          right_analog_x: axes[2],
          right_analog_y: axes[3]
        };
      }

      // cache the previous state
      this.previousControllers[i] = this.controllers[i];
      this.controllers[i] = controllerObject;
    }
  },

  startStatusPolling: function(){
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this._checkStatus);
    } else if (window.mozRequestAnimationFrame) {
      window.mozRequestAnimationFrame(this._checkStatus);
    } else if (window.webkitRequestAnimationFrame) {
      window.webkitRequestAnimationFrame(this._checkStatus);
    }
  },

  _checkStatus: function(){
    XBOXControllers.getControllers();
    XBOXControllers.startStatusPolling();
  },

  onUpdate: function(){}
};

// window.addEventListener('load', function(){
//   XBOXControllers.supported = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

//   if(!XBOXControllers.supported) alert('Could not detect gampad support!');

//   XBOXControllers.getControllers();
//   XBOXControllers.startStatusPolling();
// });