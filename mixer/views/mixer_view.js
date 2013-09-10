this.MixerView = BaseView.extend({
  template: function(){ return _.template($('#mixer-template').html()); },

  events: {
    'change .gain [type=range]': 'setGain',
    'click #play': 'play',
    'click #stop': 'stop',
    'mousedown .cue-button.start': 'startCue',
    'mousedown .cue-button.stop': 'endCue',
    'mousedown .cue-button.abort': 'abortCue'
  },

  afterRender: function(){
    this.$gainRangeElement = this.$('.gain [type=range]');
    this.$cueButton = this.$('.cue-button');

    this.cueStatus = 'start';
    this.startMixerInterface();
  },

  setGain: function(){
    var value = parseFloat(this.$gainRangeElement.val());
    this.model.setGainPercentage(value);
  },

  play: function(){
    this.model.play();
  },

  stop: function(){
    this.model.stop();
  },

  startCue: function(){
    this.$cueButton.removeClass('start').addClass('stop');
    this.cueStatus = 'stop';
    this.model.startCue();
    console.log('inStart');
  },

  endCue: function(){
    this.$cueButton.removeClass('stop').addClass('abort');
    this.cueStatus = 'abort';
    this.model.endCue();
    console.log('inStop');
  },

  abortCue: function(){
    this.$cueButton.removeClass('abort').addClass('start');
    this.cueStatus = 'start';
    this.model.abortCue();
    console.log('inAbort');
  },

  startMixerInterface: function(){
    XBOXControllers.getControllers();
    XBOXControllers.startStatusPolling();

    var allowTurntable = false;
    var previousTurntableValue = null;

    var coolDowns = {
      green: Date.now(),
      red: Date.now()
    }

    XBOXControllers.onUpdate = function(){
      var controller = XBOXControllers.controllers[this.controllerIndex];

      var now = Date.now();

      // CUE BUTTON
      if(controller.buttons.green){
        if(now > coolDowns.green){
          switch(this.cueStatus){
            case 'start':
              this.startCue();
              break;
            case 'stop':
              this.endCue();
              break;
            case 'abort':
              this.abortCue();
              break;
          }
          coolDowns.green = now + 150;
        }
      }

      // CROSSFADE
      var crossfade = controller.axes.crossfade;
      if(this.lastCrossFade != crossfade){
        this.lastCrossFade = crossfade;
        this.$gainRangeElement.val(1 - ((crossfade + 1) / 2));
        this.setGain();
      }

      // TURNTABLE
      var turntable = controller.axes.turntable
      if(allowTurntable && turntable != previousTurntableValue)
        this.model.adjustSpeed(-turntable * 88)

      previousTurntableValue = turntable;

      // ENABLE TURNTABLE
      if(controller.buttons.red){
        if(now > coolDowns.red){
          allowTurntable = !allowTurntable;
          coolDowns.red = now + 200;
        }
      }
    }.bind(this);
  }

});