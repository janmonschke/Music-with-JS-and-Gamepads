this.MixerView = BaseView.extend({
  template: _.template($('#mixer-template').html()),

  events: {
    'change .gain [type=range]': 'setGain',
    'click #play': 'play',
    'click #stop': 'stop',
    'click .cue-button.start': 'startCue',
    'click .cue-button.stop': 'stopCue',
    'click .cue-button.abort': 'abortCue'
  },

  afterRender: function(){
    this.$gainRangeElement = this.$('.gain [type=range]');
    this.$cueButton = this.$('.cue-button');
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
    this.model.startCue();
  },

  stopCue: function(){
    this.$cueButton.removeClass('stop').addClass('abort');
    this.model.stopCue();
  },

  abortCue: function(){
    this.$cueButton.removeClass('abort').addClass('start');
    this.model.abortCue();
  }

});