(function ($) {
  $(function () {
    var i = 1;
    var MSingel = Backbone.Model.extend({
      defaults: function () {
        return {
          index: i++,
          key: "key",
          value: "value"
        }

      }
    });
    var MList = Backbone.Collection.extend({
      model: MSingel,
      comparator: "index"
    });
    var Ml = new MList;
    var InputView = Backbone.View.extend({
      tagName: "div",
      template: _.template($("#input-template").html()),
      events: {
        "click .destroy": "clear",
        "blur [placeholder='index']": "updateIndex",
        "blur [placeholder='key']": "updateKey",
        "blur [placeholder='value']": "updateValue"
      },
      initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
      },
      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
      clear: function () {
        this.model.destroy();
      },
      updateIndex: function () {
        this.model.attributes.index = this.$("[placeholder='index']").val();
      },
      updateKey: function () {
        this.model.attributes.key = this.$("[placeholder='key']").val();
      },
      updateValue: function () {
        this.model.attributes.value = this.$("[placeholder='value']").val();
      },
    });
    var AppView = Backbone.View.extend({
      el: $("body"),
      events: {
        "click #addInput": "addInput",
        "click #submit": "submit"
      },
      initialize: function () {
        this.listenTo(Ml, "add", this.addOne);
      },
      addInput: function () {
        var ms = new MSingel;
        Ml.add(ms);
      },
      addOne: function (ms) {
        var view = new InputView({model: ms});
        this.$(".container").append(view.render().el);
      },
      submit: function () {
        var arr = [];
        var json = {};
        $.each(Ml.models, function (index, value) {
          arr.push(value.attributes);
        });
        arr.sort(function (a, b) {
          return a.index - b.index;
        });
        $.each(arr, function (index, value) {
          json[value.key] = value.value;
        });
        console.log(json);
      }
    });
    var appView = new AppView;
  })
}(jQuery));