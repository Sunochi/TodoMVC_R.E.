/*参考: http://backbonejs.org/docs/todos.html*/

// Model
const Task = Backbone.Model.extend({
    defaults: function(){
        return {
        title: "empty todo...",
        done: false,
        number: -1
      };
    },

    toggle: function(){
        this.save({done: !this.get("done")});
    }
});

// Collection
const TaskList = Backbone.Collection.extend({
    model: Task,
    localStorage: new Backbone.LocalStorage("todos"),
    comparator: "number",

    done: function() {
      return this.filter(function(todo){return todo.get('done')});
    },
    remaining: function() {
      return this.where({done: false});
    },
});

var Todos = TaskList;

// Todo１つ（行）
const TaskView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#task-template').html()),
  events: {
    'click .todo_delete' : 'onDeleteClicked',
    'click .todo_chbox'  : 'changeDone',
    'dblclick .todo_text': 'edit',
    'keypress .todo_edit': 'onEnterPress',
    'blur .todo_edit'    : 'closeEdit'
  },
  initialize: function(){
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function(){
      this.$el.html(this.template(this.model.toJSON()));
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
      this.$el.addClass("edit");
      this.input.focus();
  },

  onEnterPress: function(){
      if(e.keyCode == 13) this.closeEdit();
  },

  closeEdit: function(){
      var value = this.input.val();
      if(value){
          this.model.save({title: value});
          this.$el.removeClass("edit");
      }
  }
});

// the Root View (controller view)
const ParentView = Backbone.View.extend({
  el: $("#todo_table"),
  infoTemplate: _.template($("#info-template").html()),

  events: {
      "keypress #input_todo"      : "createOnEnter",
      "click #completed_clear_btn": "clearCompleted",
      "click #all_check"          : "toggleAllCheck",
      "click #change_display_all_btn"      : "dispAll",
      "click #change_display_active_btn"   : "dispActive",
      "click #change_display_completed_btn": "dispComp",
  },
  initialize: function(){
    this.input       = this.$("new-todo");
    this.allCheckBox = this.$("#all_check");

    this.listenTo(Todos, 'add', this.addOne);
    this.listenTo(Todos, 'all', this.render);

    this.footer = this.$('footer');
    this.main   = $('#todo_list');
  },
  addOne: function(){

  },
  render: function(){

  }

})

var pview = new ParentView;
