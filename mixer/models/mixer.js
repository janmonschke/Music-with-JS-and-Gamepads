this.Mixer = Backbone.Model.extend({
  defaults: {
    gain: 1,
    skipped: 0
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

  play: function(when){
    if(!when) when = 0;
    this.get('track').play(when);
  },

  stop: function(){
    this.get('track').stop();
  },

  skip: function(seconds){
    var skipped = this.get('skipped');
    this.set('skipped', skipped + seconds);
    this.stop();
    this.get('track').set('stoppedAt', 0);
    this.play();
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

  endCue: function(){
    var cue = this.get('cue');
    cue.set({endCue: this.get('context').currentTime - this.cueTimeSum });
    this.stop();

    this.cuePlaybackStartedAt = Date.now();
    cue.loop();
  },

  abortCue: function(){
    // stop the timing and calculate new sum
    this.cuePlaybackStoppedAt = Date.now();
    var duration = (this.cuePlaybackStoppedAt - this.cuePlaybackStartedAt) / 1000;
    this.cueTimeSum += duration;

    this.cuePlaybackStartedAt = 0;
    this.cuePlaybackStoppedAt = 0;

    // stop the cue and play the original track
    var cue = this.get('cue');
    var cueDuration = cue.duration();
    var remaining = duration / cueDuration; // 12.1 / 3 -> .1
    remaining = remaining - Math.floor(remaining);
    remaining = (1 - remaining) * cueDuration;
    cue.abort(remaining);
    this.set('cue', null);
    this.play(remaining);
  }
});