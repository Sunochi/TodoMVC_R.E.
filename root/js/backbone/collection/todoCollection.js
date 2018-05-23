const TodoList = Backbone.Collection.extend({
    model: Todo,
    comparator: "key",

    done: function() {
      return this.where({done: true});
    },
    remaining: function() {
      return this.where({done: false});
    },
});

var Todos = new TodoList;
