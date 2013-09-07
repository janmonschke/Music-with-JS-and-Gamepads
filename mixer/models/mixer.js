this.Mixer = Backbone.Model.extend({
  defaults: {
    gain: 1
  },

  minGain: 0,
  maxGain: 2,
  setGainPercentage: function(percentage){
    this.set('gain', percentage * this.maxGain);
  },

  setTrack: function(node){
    node.set('context', this.get('context'));
    node.fetch().done(function(){
      this.set('track', node);
    }.bind(this));
  },

  play: function(){
    this.get('track').play();
  },

  stop: function(){
    this.get('track').stop();
  }
});