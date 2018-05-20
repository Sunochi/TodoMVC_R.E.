/*参考: http://backbonejs.org/docs/todos.html*/
$(function(){
    // Model
    const Task = Backbone.Model.extend({
        defaults: function(){
            return {
            title: "empty todo...",
            done: false,
            key: -1
          };
        },

        initialize: function(){
            if(!this.get("title")){
                this.set({"title": this.defaults().title});
            }
        },

        toggle: function(){
            this.save({done: !this.get("done")});
        }
    });

    // Collection
    const TaskList = Backbone.Collection.extend({
        model: Task,
        localStorage: new Backbone.LocalStorage("todos"),
        comparator: "key",

        done: function() {
          return this.where({done: true});
        },
        remaining: function() {
          return this.where({done: false});
        },
    });

    var Todos = new TaskList;

    // Todo１つ（行）
    const TaskView = Backbone.View.extend({
      tagName: 'tr',
      taskTemplate: _.template($('#task-template').html()),
      events: {
        'click .delete_btn' : 'onDeleteClicked',
        'click .todo_chbox'  : 'changeDone',
        'dblclick .todo_text': 'edit',
        'keypress .edit_text': 'onEnterPress',
        'blur .edit_text'    : 'closeEdit'
      },
      initialize: function(){
          this.listenTo(this.model, 'change', this.render);
          this.listenTo(this.model, 'destroy', this.remove);
      },

      render: function(){
          this.$el.html(this.taskTemplate(this.model.toJSON()));
          this.$el.toggleClass('done', this.model.get('done'));
          this.input = this.$('.edit');
          return this;
      },

      onDeleteClicked: function() {
        this.model.destroy();
      },

      changeDone: function(){
          this.model.toggle();
      },

      edit: function(){
          this.$el.addClass("editing");
          this.input.focus();
      },

      onEnterPress: function(e){
          if(e.keyCode == 13) this.closeEdit();
      },

      closeEdit: function(){
          var value = this.input.val();
          if(value){
              this.model.save({title: value});
              this.$el.removeClass("editing");
          }
      },


    });

    // the Root View (controller view)
    const ParentView = Backbone.View.extend({
      el: $("#todo_table"),
      infoTemplate: _.template($("#info-template").html()),

      events: {
          "keypress #input_todo"      : "createOnEnter",
          "click #completed_clear_btn": "clearCompleted",
          "click #all_check"          : "toggleAllCheck",
          "click #change_display_all_btn"       : "changeDisplayAll",
          "click #change_display_active_btn"    : "changeDisplayActive",
          "click #change_display_completed_btn" : "changeDisplayComp",
      },
      initialize: function(){
        this.input       = this.$("#input_todo");
        this.allCheckBox = this.$("#all_check")[0];

        this.listenTo(Todos, 'add', this.addOne);
        this.listenTo(Todos, 'reset', this.addAll);
        this.listenTo(Todos, 'all', this.render);

        this.footer = this.$('#footer');
        this.main   = $('#todo_list');
        Todos.fetch();
      },

      addOne: function(todo){
          var view = new TaskView({model: todo});
          this.$el.append(view.render().el);
          $(".active").trigger('click');
      },

      addAll: function(){
          Todos.each(this.addOne, this);
      },

      render: function(){
          var done = Todos.done().length;
          var remaining = Todos.remaining().length;
          if(Todos.length){
              this.main.show();
              this.footer.show();
              this.footer.html(this.infoTemplate({done: remaining}))
          }else{
              this.main.hide();
              this.footer.hide();
          }

          this.allCheckBox.checked = !remaining;
      },

      createOnEnter: function(e){
          if (e.keyCode != 13) return;
          if(!this.input.val()) return;
          Todos.create({title: this.input.val()});
          this.input.val('')
      },

      clearCompleted: function(){
          _.invoke(Todos.done(), 'destroy');
          $(".active").trigger('click');
          return true;
      },

      toggleAllCheck: function(){
          var done = this.allCheckBox.checked;
          Todos.each(function (todo){ todo.save({'done':done});});
          $(".active").trigger('click');
      },
      changeDisplayAll: function(){
          $('tr').show();
          $('.active').removeClass("active");
          $('#change_display_all_btn').addClass("active");
      },

      changeDisplayActive: function(){
          this.main.find('tr:not(.done)').show();
          this.main.find('tr.done').hide();
          $('.active').removeClass("active");
          $('#change_display_active_btn').addClass("active");
      },

      changeDisplayComp: function(){
          this.main.find('tr:not(.done)').hide();
          this.main.find('tr.done').show();
          $('.active').removeClass("active");
          $('#change_display_completed_btn').addClass("active");
      },

    })

    var pview = new ParentView;
})
