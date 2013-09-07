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
      this.trigger('trackLoaded');
    }.bind(this));
  },

  play: function(){
    this.get('track').play();
  },

  stop: function(){
    this.get('track').stop();
  },

  startCue: function(){
    var context = this.get('context');
    var cue = new CueNode({ context: context, buffer: this.get('track').get('buffer') });
    cue.set({startCue: context.currentTime });
    this.set('cue', cue);
  },

  stopCue: function(){
    var cue = this.get('cue');
    cue.set({endCue: this.get('context').currentTime });
    this.stop();
    cue.loop();
  },

  abortCue: function(){
    this.get('cue').abort();
    this.play();
  }
});