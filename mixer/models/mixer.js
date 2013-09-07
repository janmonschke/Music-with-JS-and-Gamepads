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

  cuePlaybackStartedAt: 0,
  cuePlaybackStoppedAt: 0,
  cueTimeSum: 0,
  startCue: function(){
    var context = this.get('context');
    var cue = new CueNode({ context: context, buffer: this.get('track').get('buffer'), mixer: this });
    cue.set({startCue: context.currentTime - this.cueTimeSum });
    this.set('cue', cue);
  },

  stopCue: function(){
    var cue = this.get('cue');
    cue.set({endCue: this.get('context').currentTime - this.cueTimeSum });
    this.stop();

    this.cuePlaybackStartedAt = Date.now();
    cue.loop();
  },

  abortCue: function(){
    // stop the timing and calculate new sum
    this.cuePlaybackStoppedAt = Date.now();
    var duration = this.cuePlaybackStoppedAt - this.cuePlaybackStartedAt;
    this.cueTimeSum += (duration / 1000);

    // stop the cue and play the original track
    var cue = this.get('cue');
    cue.abort();
    this.play();
  },

  resetCueTime: function(){
    this.cuePlaybackStartedAt = 0;
    this.cuePlaybackStoppedAt = 0;
    return this.cueTimeSum;
  }
});