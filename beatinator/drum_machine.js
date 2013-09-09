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

    machine.set('kick',     [1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0]);
    machine.set('snare',    [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1]);
    machine.set('hatOpen',  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    machine.set('hatClosed',[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]);
  },

  scheduleBeats: function(){
    var looper = this.get('looper');
    var currentBeat = looper.get('currentBeat');
    var nextBeatTime = looper.get('nextBeatTime');
    var machine = this;

    this.beatNames.forEach(function(name){
      var beat = machine.get(name);
      if(beat[currentBeat]){
        console.log(nextBeatTime, machine.get('context').currentTime)
        machine.get('buffers')[name].play(nextBeatTime);
      }
    });
  }
});