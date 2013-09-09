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
    var gain = this.get('mixer').get('gain');
    var source = this.get('source');
    if(source && source.playbackState == source.PLAYING_STATE)
      source.gain.value = this.get('mixer').get('gain');
  },

  play: function(when){
    var context = this.get('context');
    var source = context.createBufferSource();
    source.buffer = this.get('buffer');
    source.connect(context.destination);
    source.gain.value = this.get('mixer').get('gain');
    if(!when){ when = 0; } else { when += context.currentTime }
    source.start(when, this.get('stoppedAt') + this.get('mixer').get('skipped'));
    this.set('source', source);
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