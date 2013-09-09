this.Looper = Backbone.Model.extend({
  defaults: {
    beats: 31,
    bpm: 80,
    isStopped: false,
    currentBeat: -1
  },

  initialize: function(context){
    this.context = context;
    _.bindAll(this, 'tick', 'calculateTimings');
    this.listenTo(this, 'change:bpm', this.calculateTimings);
  },

  start: function(){
    var now = Date.now();
    this.set({
      isStopped: false,
      lastTick: now,
      nextBeatTime: 0,
      lastBeatTime: 0
    }, {silent: false});

    this.calculateTimings();
    this.tick();
  },

  tick: function(){
    var nextBeatTime = this.get('nextBeatTime');

    if(nextBeatTime <= this.context.currentTime + 0.1 ){
      // set to the next beat, and sanitize it
      var nextBeat = this.attributes.currentBeat + 1;
      if(nextBeat >= this.attributes.beats) nextBeat = 0;

      nextBeatTime += this.get('secondsBetweenBeats');
      console.log(this.get('secondsBetweenBeats'))

      this.set({
        currentBeat: nextBeat,
        nextBeatTime: nextBeatTime
      });
    }

    if(!this.get('isStopped'))
      requestAnimationFrame(this.tick);
  },

  calculateTimings: function(){
    var beats = this.attributes.beats;
    var bpm = this.attributes.bpm;

    this.set({
      secondsBetweenBeats: (60 / bpm) / 4,
      msBetweenBeats: (60 / bpm) * 1000
    })
  }
});