require.config({
  paths:{
    "jquery":"jquery-1.11.3",
    "underscore":"underscore-min",
    "backbone":"backbone-min",
    "localStorage":"backbone.localStorage"
  },
  shim:{
    "underscore":{
      exports:"_"
    },
    "Backbone":{
      deps:["jquery","underscore"],
      exports:"Backbone"
    },
    ""
  }
})
 var i = 1;
    var MSingel = Backbone.Model.extend({
      defaults: function () {
        return {
          index: i++,
          key: "",
          value: ""
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
        "blur [placeholder='index']": "updateOnBlur",
        "blur [placeholder='key']": "updateOnBlur",
        "blur [placeholder='value']": "updateOnBlur"
      },
      initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
      },
      render: function () {//model的值改变后调用
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
      clear: function () {
        this.model.destroy();
      },
      updateOnBlur: function () {//监听blur事件,改变model的值
        this.model.set({
          index: this.$("[placeholder='index']").val(),
          key: this.$("[placeholder='key']").val(),
          value: this.$("[placeholder='value']").val()
        })
      }
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
        Ml.each(function (ml) {//遍历Ml集合,把每个集合中的对象push进arr数组
          arr.push(ml);
        });
         arr.sort(function (a, b) {//依据数组中每个对象的index属性排序
         return a.get("index") - b.get("index");
         });
        var json={};
        $.each(arr,function(i,v){//把arr的数组中变成json格式
          json[v.get("key")]= v.get("value");
        });
        console.log(json);
      }
    });
    var appView = new AppView;