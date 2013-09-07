this.BaseView = Backbone.View.extend({
  template: function(){ throw new Error("You need to define a template"); },

  render: function(){
    var data = {};
    if(this.model)
      this.model.toJSON();
    this.$el.html(this.template(data));
    this.afterRender();
  },

  afterRender: function(){}
});