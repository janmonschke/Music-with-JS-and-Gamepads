window.CueNode = BufferedNode.extend({
  defaults: {
    startCue: 0,
    endCue: 1,
    offset: 0
  },

  setUpSourceNode: function(){
    var context = this.get('context');
    var source = context.createBufferSource();
    var gainNode = context.createGain();
    source.buffer = this.get('buffer');
    gainNode.gain.value = this.get('mixer').get('gain');
    source.connect(gainNode);
    gainNode.connect(context.destination);
    this.set('source', source);
  },

  duration: function(){
    var startCue = this.get('startCue');
    var endCue = this.get('endCue');
    return endCue - startCue;
  },

  play: function(){
    this.stop();
    this.get('source').start(0, startCue, this.duration());
  },

  loop: function(){
    this.stop();
    var source = this.get('source');
    var start = this.get('startCue');
    source.loop = true;
    source.loopStart = start;
    source.loopEnd = this.get('endCue');
    source.start(0, start);
  },

  stop: function(){
    var source = this.get('source');
    if(source) source.stop(0);
    this.setUpSourceNode();
  },

  abort: function(when){
    var source = this.get('source');
    var context = this.get('context');

    if(!when){ when = 0; } else { when += context.currentTime }

    source.stop(when);
    this.destroy();
  }
});
