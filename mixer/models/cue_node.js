window.CueNode = Backbone.Model.extend({
  defaults: {
    startCue: 0,
    endCue: 1,
    offset: 0
  },

  setUpSourceNode: function(){
    var context = this.get('context');
    var source = context.createBufferSource();
    source.buffer = this.get('buffer');
    source.connect(context.destination);
    this.set('source', source);
  },

  startCue: function(){
    this.set('startCue', this.get('context').currentTime - this.get('offset'));
  },

  endCue: function(){
    this.set('endCue', this.get('context').currentTime - this.get('offset'));
  },

  play: function(){
    this.stopCue();
    var startCue = this.get('startCue');
    var endCue = this.get('endCue');
    var duration = endCue - startCue;
    this.get('source').start(0, startCue, duration);
  },

  loop: function(){
    this.stopCue();
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
  }
});