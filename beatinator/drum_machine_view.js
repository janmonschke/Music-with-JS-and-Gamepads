this.DrumMachineView = Backbone.View.extend({

  events: {
    'change input[type=checkbox]': 'beatChanged'
  },

  beatChanged: function(event){
    var element = $(event.currentTarget);
    var beatName = element.parent('.row').data('name');
    var isChecked = element.prop('checked');
    var beatIndex = element.data('beat-index');
    var beats = this.model.get(beatName);
    beats[beatIndex] = isChecked;
  },

  render: function(){
    var view = this;
    view.$el.html();
    var element = view.$el;

    this.model.beatNames.forEach(function(name){
      var beats = view.model.get(name);
      var row = $('<div/>')
      row.addClass('row').attr('data-name', name);

      for(var i = 0; i < beats.length; i++){
        var checked = (beats[i] == true);
        var input = $('<input/>');
        input.attr('type', 'checkbox').prop('checked', checked).attr('data-beat-index', i);
        row.append(input);
      }
      row.append('<span>' + name + '</span>');

      element.append(row);
    });
  }
});