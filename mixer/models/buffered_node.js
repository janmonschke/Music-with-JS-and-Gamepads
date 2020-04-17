window.BufferedNode = Backbone.Model.extend({
  defaults: {
    location: '',
    context: null,
    buffer: null,
    stoppedAt: 0
  },

  url: function(){ return this.get('location') },

  initialize: function(){
    this.listenTo(this.get('mixer'), 'change:gain', this.adjustGain.bind(this));
  },

  fetch: function(){
    if(!this.get('context'))
      throw new Error('No context defined!');

    var deferred = $.Deferred();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.url(), true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      this._processArrayBuffer(xhr.response, deferred);
    }.bind(this);
    xhr.send();

    return deferred;
  },

  isPlaying: function(){
    var source = this.get('source');
    return (source && source.playbackState == source.PLAYING_STATE);
  },

  _processArrayBuffer: function(arrayBuffer, deferred){
    this.get('context').decodeAudioData(arrayBuffer, function(buffer) {
      this.set('buffer', buffer);
      deferred.resolve();
      console.log('decoded!');
    }.bind(this), function(e) {
      deferred.reject('Error decoding file', e);
    });
  },

  adjustGain: function(){
    var source = this.get('source');
    var gainNode = this.get('gainNode');
    if(source && source.playbackState == source.PLAYING_STATE) {
      gainNode.gain.value = this.get('mixer').get('gain');
    }
  },

  adjustSpeed: function(byValue){
    this.get('source').playbackRate.value += byValue;
  },

  play: function(when){
    // console.log('play: ' + this.get('location'))
    var context = this.get('context');
    var source = context.createBufferSource();
    var gainNode = context.createGain();
    source.buffer = this.get('buffer');
    source.connect(gainNode);
    gainNode.connect(context.destination)
    gainNode.gain.value = this.get('mixer').get('gain');

    if(!when){ when = 0; }
    source.start(when, this.get('stoppedAt'));
    this.set('source', source);
    this.set('gain', gainNode);
  },

  stop: function(){
    var stoppedAt = this.get('context').currentTime - this.get('mixer').cueTimeSum;
    this.set('stoppedAt', stoppedAt);

    this.get('source').stop(0);
  },

  destroy: function(){
    this.stopListening();
  }
});
