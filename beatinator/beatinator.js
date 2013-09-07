window.Looper = Backbone.Model.extend({
  defaults: {
    beats: 16,
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
      nextBeatTime: Date.now() / 1000,
      lastBeatTime: 0
    }, {silent: false});

    this.calculateTimings();
    this.tick();
  },

  tick: function(){
    var nextBeatTime = this.get('nextBeatTime');

    if(nextBeatTime <= (Date.now() + 100) / 1000 ){
      // set to the next beat, and sanitize it
      var nextBeat = this.attributes.currentBeat + 1;
      if(nextBeat >= this.attributes.beats) nextBeat = 0;

      console.log(nextBeatTime += this.get('secondsBetweenBeats'))
      console.log('context time', this.context.currentTime)

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
      secondsBetweenBeats: (60 / bpm),
      msBetweenBeats: (60 / bpm) * 1000
    })
  }
});