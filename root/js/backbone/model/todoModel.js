
// @TODO socket.emit()してDBを更新する。
const Todo = Backbone.Model.extend({
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
        this.set({done: !this.get("done")});
    }
});
