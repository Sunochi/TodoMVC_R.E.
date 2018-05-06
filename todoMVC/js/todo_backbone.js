/*参考: http://backbonejs.org/docs/todos.html*/


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

const TaskList = Backbone.Collection.extend({
    model: Task,
    comparator: "number",

    done: function() {
      return this.where({done: true});
    },
    remaining: function() {
      return this.where({done: false});
    },
});

// the Root View (controller view)
const ParentView = Backbone.View.extend({
  initialize: () => {
    // create models and collections
    this.taskCollection = new TaskCollection();

    // create sub views
    this.tasksView = new TasksView({ collection: this.taskCollection })
    this.addTaskView = new AddTaskView()

    // set event handlers
    this.addTaskView.on(EVENT_SUBMITTED, (value) => {
      const model = new TaskModel({
        title: value
      })
      this.taskCollection.add(model)
    })
  },
})


// this has input form (presentational view)
const AddTaskView = Backbone.View.extend({
  el: '',

  events: {
    submit: 'onSubmitted'
  },

  onSubmitted: (e) => {
    this.trigger(EVENT_SUBMITTED, $('#input_todo').val())
  },
})


// mixed presentational and controller
const TasksView = Backbone.View.extend({
  el: '',

  // NOTE: this class does NOT have any "taskViewList" or something,
  // because this class has collection, collection includes models,
  // and the each model is attached to the view, so we can access all views
  initialize: () => {
    this.collection.on('add', (model) => {
      const newView = new TaskView(model)

      // set event handlers
      newView.once(EVENT_TASK_DELETED, () => {
        newView.remove()
        this.collection.remove(model)
      })

      // render
      this.$el.append(this.newView.$el);
      newView.render()
    })
  },
})


// single task view (presentational view)
const TaskView = Backbone.View.extend({
  el: '#todo_list',

  events: {
    'click .delete': 'onDeleteClicked'
  },

  onDeleteClicked: (e) => {
    this.trigger(EVENT_TASK_DELETED)
  },

  render: function(){
      $(this.el).html(_.template($('#task-template').html(), {name: 'foo', text: 'bar'}));
  },
})

var pview = new ParentView;
