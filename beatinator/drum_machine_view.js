this.DrumMachineView = Backbone.View.extend({

  events: {
    'change input[type=checkbox]': 'beatChanged',
    'change #bpm-range': 'bpmChanged'
  },

  initialize: function(){
    this.looper = this.options.looper;
    this.listenTo(this.looper, 'change:currentBeat', this.highlightBeats.bind(this));
    this.listenTo(this.model, 'change', this.render.bind(this));
  },

  bpmChanged: function(){
    var bpmRange = this.$('#bpm-range').val();
    this.looper.set('bpm', bpmRange);
    this.$('.bpm-view').text('BPM: ' + bpmRange);
  },

  highlightBeats: function(){
    var currentBeat = this.looper.get('currentBeat');
    this.$('.highlight').removeClass('highlight');
    this.$('span[data-beat-index=' + currentBeat + ']').addClass('highlight');
  },

  beatChanged: function(event){
    var element = $(event.currentTarget);
    var beatName = element.parents('.row').data('name');
    var isChecked = element.prop('checked');
    var beatIndex = element.data('beat-index');
    var beats = this.model.get(beatName);
    beats[beatIndex] = isChecked;
  },

  render: function(){
    var view = this;
    view.$el.html('');
    var element = view.$el;

    this.model.beatNames.forEach(function(name){
      var beats = view.model.get(name);
      var row = $('<div/>')
      row.addClass('row').attr('data-name', name);

      for(var i = 0; i < beats.length; i++){
        var checked = (beats[i] == true);
        var span = $('<span />');
        var input = $('<input/>');
        input.attr('type', 'checkbox').prop('checked', checked).attr('data-beat-index', i);
        span.attr('data-beat-index', i);
        span.append(input);
        row.append(span);
      }
      row.append(name);
      element.append(row);
    });

    var controlsContainer = $('<div/>');
    controlsContainer.addClass('controls');
    var bpmRange = $('<input />');
    bpmRange.attr({
      type: 'range',
      min: '10',
      max: '200',
      step: '1',
      id: 'bpm-range',
      value: this.looper.get('bpm')
    });
    controlsContainer.append(bpmRange);

    var bpmDiv = $('<div />');
    bpmDiv.text('BPM: ' + this.looper.get('bpm')).addClass('bpm-view');
    controlsContainer.append(bpmDiv);

    element.append(controlsContainer);
  }
});