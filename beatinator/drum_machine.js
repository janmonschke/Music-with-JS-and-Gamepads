this.DrumMachine = Backbone.Model.extend({
  beatNames: ['base', 'kick', 'snare', 'hatClosed', 'hatOpen'],

  initialize: function(){
    this.initBeats();
    this.listenTo(this.get('looper'), 'change:nextBeatTime', this.scheduleBeats.bind(this));
  },

  initBeats: function(){
    var looper = this.get('looper');
    var beats = looper.get('beats');
    var machine = this;
    this.beatNames.forEach(function(name){
      machine.set(name, new Array(beats));
    });
  },

  reset: function(){
    this.get('looper').set('beats', 16);
    this.initBeats();
  },

  deftones: function(){
    this.get('looper').set({
      beats: 32,
      bpm: 80
    });
    this.set('base', new Array(32));
    this.set('kick',     [1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0]);
    this.set('snare',    [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1]);
    this.set('hatClosed',[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]);
    this.set('hatOpen',  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  },

  hiphop: function(){
    this.get('looper').set({
      beats: 16,
      bpm: 92
    });

    this.set('base',     [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]);
    this.set('kick',     [0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0]);
    this.set('snare',    [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]);
    this.set('hatClosed',[1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0]);
    this.set('hatOpen', new Array(16));
  },

  scheduleBeats: function(){
    var looper = this.get('looper');
    var currentBeat = looper.get('currentBeat');
    var nextBeatTime = looper.get('nextBeatTime');
    var machine = this;

    this.beatNames.forEach(function(name){
      var beat = machine.get(name);
      if(beat[currentBeat]){
        machine.get('buffers')[name].play(nextBeatTime - .1);
      }
    });
  }
});