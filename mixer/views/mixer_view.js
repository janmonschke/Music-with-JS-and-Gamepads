this.MixerView = BaseView.extend({
  template: _.template($('#mixer-template').html()),

  events: {
    'change .gain [type=range]': 'setGain',
    'click #play': 'play',
    'click #stop': 'stop'
  },

  afterRender: function(){
    this.$gainRangeElement = this.$('.gain [type=range]');
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
  }

});