window.onload = function () {
    // 常に使用しそうなDOMは最初に用意
    var input_todo    = document.getElementById("input_todo");
    var todo_list     = document.getElementById("todo_list");
    var todo_footer   = document.getElementById("todo_footer");
    var footer_text   = document.getElementById("items_left_text");
    var all_check_box = document.getElementById("all_check");

    /***表示内容変更ボタン関連***/
    var change_display_all_btn    = document.getElementById("change_display_all_btn");
    var change_display_active_btn = document.getElementById("change_display_active_btn");
    var change_display_comp_btn   = document.getElementById("change_display_completed_btn");
    var comp_clear_btn            = document.getElementById("completed_clear_btn");

    /***************************************************
        ローカルストレージから保存したデータを復元する
    ****************************************************/
    const disp_all    = 3;
    const disp_active = 1;
    const disp_comp   = 2;
    let todo_num   = 0; //現在の全てのTodoの数
    let todo_count = 1; //今までのTodoの数（保存時のKey）
    let active_num = 0; //active状態の数
    let view_content = disp_all; //表示するコンテンツの切り替え。"all":3, "active":1, "complete":2

    //リストの表示を変更する用。主Keyを保存しておく
    var active_list    = [];
    var completed_list = [];

    if(localStorage.getItem('todo_count')){
        todo_count = localStorage.getItem('todo_count');
        setTodo(todo_count);
        setCheckBoxforAll();
        if(todo_num > 0){
            changeCheckBoxforAll();
        }
    }

    function setTodo(num){
        for(i = 1; i < num; i++ ){
            //tableに追加するタグを生成
            if(!localStorage.getItem('' + i)){
                continue;
            }
            var data = JSON.parse(localStorage.getItem(""+i));
            var tr       = document.createElement("TR");
            var td_check = document.createElement("TD");
            var td_text  = document.createElement("TD");
            tr.id   = "todo_" + i;
            tr.name = "todo";
            tr.addEventListener("mouseover", indicateBtn);
            tr.addEventListener("mouseout", hiddenBtn);

            //todoのチェックボタン作成
            var chk   = document.createElement("INPUT");
            chk.value = i;
            chk.setAttribute("type", "checkbox");
            chk.setAttribute('name', 'todo_check');
            chk.setAttribute('class', 'check_box');
            chk.addEventListener('change', changeTodoStatus);
            if(data["checked"] == 1){
                chk.checked = true;
                completed_list.push(chk.value);
            }else{
                active_list.push(chk.value);
                active_num++;
            }

            todo_num++;
            //todoの内容のテキストの作成
            var todo_text       = document.createElement("LABEL");
            todo_text.innerHTML = data["text"];
            todo_text.setAttribute('class', 'todo_text');

            //todoを削除するボタンの作成
            var btn   = document.createElement("BUTTON");
            btn.value = i;
            btn.name  = "todo_" + i;
            btn.setAttribute("type", "button");
            btn.setAttribute("class", "delete_btn");
            btn.addEventListener('click',deleteTodo);
            btn.style.display = "none";

            //整形してtodoリストに追加
            td_check.appendChild(chk);
            td_text.appendChild(todo_text);
            td_text.appendChild(btn);
            tr.appendChild(td_check);
            tr.appendChild(td_text);
            todo_list.appendChild(tr);
        }
    }

    /***************************************************
        TODOリストの挙動と表示
    ****************************************************/

    all_check_box.addEventListener("change", allchecked);
    input_todo.addEventListener("keypress", onKeyPress);
    input_todo.addEventListener("blur", addToDoList);

    //入力欄でのキーの押下時の動作
    function onKeyPress(e){
        if ( e.keyCode !== 13) {
            return false;
        }
        addToDoList();
    }

    function escape_html (string) {
        if(typeof string !== 'string') {
            return string;
        }
        return string.replace(/[&'`"<>]/g, function(match) {
            return {
              '&': '&amp;',
              "'": '&#x27;',
              '`': '&#x60;',
              '"': '&quot;',
              '<': '&lt;',
              '>': '&gt;',
            }[match]
        });
    }

    //リストに入力内容を追加する。
    function addToDoList(){
        var text_val = input_todo.value;
        text_val = text_val.replace(/(^(\s|　)+)|((\s|　)+$)/g, "");
        text_val = escape_html(text_val);
        if(text_val == ""){
            return false;
        }
        //tableに追加するタグを生成
        var tr       = document.createElement("TR");
        var td_check = document.createElement("TD");
        var td_text  = document.createElement("TD");
        tr.id   = "todo_" + todo_count;
        tr.name = "todo";
        tr.addEventListener("mouseover", indicateBtn);
        tr.addEventListener("mouseout", hiddenBtn);

        //todoのチェックボタン作成
        var chk   = document.createElement("INPUT");
        chk.value = todo_count;
        chk.setAttribute("type", "checkbox");
        chk.setAttribute('name', 'todo_check');
        chk.setAttribute('class', 'check_box')
        chk.addEventListener('change', changeTodoStatus);

        //todoの内容のテキストの作成
        var todo_text       = document.createElement("LABEL");
        todo_text.innerHTML = text_val;
        todo_text.setAttribute('class', 'todo_text');

        //todoを削除するボタンの作成
        var btn   = document.createElement("BUTTON");
        btn.value = todo_count;
        btn.name  = "todo_" + todo_count;
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "delete_btn");
        btn.addEventListener('click',deleteTodo);
        btn.style.display = "none";

        //整形してtodoリストに追加
        td_check.appendChild(chk);
        td_text.appendChild(todo_text);
        td_text.appendChild(btn);
        tr.appendChild(td_check);
        tr.appendChild(td_text);
        todo_list.appendChild(tr);

        //todoの入力をリセット,アクティブリストへの追加,todo数の管理
        var data = {
            text: input_todo.value,
            checked: 0
        }
        localStorage.setItem(''+todo_count, JSON.stringify(data));
        input_todo.value = "";
        active_list.push(chk.value);
        todo_num++;
        todo_count++;
        active_num++;
        localStorage.setItem("todo_count", ''+todo_count);
        //todo_listの数が必ず１個以上になるので、全チェックボタンとフッターを有効に
        setCheckBoxforAll();
        setTodoFooter();
        changeCheckBoxforAll();
        view();
    }

    //Todoの行にマウスオーバーした時の削除ボタンの表示
    function indicateBtn(){
        var btn = document.getElementsByName(this.id)[0];
        btn.style.display = "";
    }

    //Todoの行からマウスアウトした時の削除ボタンの非表示
    function hiddenBtn(){
        var btn = document.getElementsByName(this.id)[0];
        btn.style.display = "none";
    }

    //削除ボタンを押した際の動作
    function deleteTodo(){
        var target_tr = document.getElementById("todo_" + this.value);
        var todo_number = this.value;
        active_list.some(function(v, i){
            if (v==todo_number){
                active_list.splice(i,1);
                active_num--;
            }
        });
        completed_list.some(function(v, i){
            if (v==this.value) completed_list.splice(i,1);
        });
        localStorage.removeItem(""+this.value);
        target_tr.remove();
        todo_num--;

        //表示する内容が１件もない
        if(todo_num === 0){
            localStorage.clear();
            todo_count = 1;
            setCheckBoxforAll();
        }
        setTodoFooter();
    }

    //全チェックボタンの表示・非表示の切り替え
    function setCheckBoxforAll(){
        all_check_box.disabled = (todo_num > 0) ? false:true;
    }

    function changeCheckBoxforAll(){
        all_check_box.checked = (active_list.length > 0) ? false :true;
    }

    //テーブルのフッターの整形/表示・非表示
    function setTodoFooter(){
        footer_text.innerHTML = "" + active_num + " items left";
        if(todo_num > 0){
            todo_footer.style.display = "";
        }else{
            todo_footer.style.display = "none";
        }
        if(completed_list.length > 0){
            comp_clear_btn.style.display = "";
        }else{
            comp_clear_btn.style.display = "none";
        }
    }

    function allchecked(){
      var checked = this.checked;
      var checkboxes = document.getElementsByName("todo_check");
      checkboxes.forEach(function(cb){
          if(cb.checked != checked){
              cb.checked = checked;
              changeStatus(cb);
          }
      });
      setTodoFooter();
      view();
    }

    function changeTodoStatus(){
        changeStatus(this);
        setTodoFooter();
        changeCheckBoxforAll();
        view();
    }

    function changeStatus(checkbox){
        var todo_number = checkbox.value;
        if(checkbox.checked){
            active_list.some(function(v, i){
                if (v==todo_number){
                    active_list.splice(i,1);
                    active_num--;
                }
            });
            completed_list.push(todo_number);
        }else{
            completed_list.some(function(v, i){
                if (v==todo_number) completed_list.splice(i,1);
            });
            if(active_list.indexOf(todo_number) == -1){
                active_list.push(todo_number);
                active_num++;
            }
        }
        var data = JSON.parse(localStorage.getItem(""+todo_number));
        data["checked"] = checkbox.checked ? 1 : 0;
        localStorage.setItem(''+todo_number, JSON.stringify(data));
    }

    change_display_all_btn.addEventListener("click",change_display_all);
    change_display_active_btn.addEventListener("click",change_display_active);
    change_display_comp_btn.addEventListener("click",change_display_completed);
    comp_clear_btn.addEventListener("click",change_display_clear);
    //activeとcompletedのリストを見てtrの表示を変えるだけ。簡単
    function change_display_all(){
        remove_attribute_active();
        change_display_all_btn.setAttribute("class","active");
        view_content = disp_all;
        change_display_all_btn.blur();
        view()
    }
    function change_display_active(){
        remove_attribute_active();
        change_display_active_btn.setAttribute("class","active");
        view_content = disp_active;
        change_display_active_btn.blur();
        view()
    }
    function change_display_completed(){
        remove_attribute_active();
        change_display_comp_btn.setAttribute("class","active");
        view_content = disp_comp;
        change_display_comp_btn.blur();
        view()
    }

    //completedのリストを見て、削除を行うだけ。簡単
    function change_display_clear(){
      completed_list.forEach(function(v, i){
          var target_tr = document.getElementById("todo_" + v);
          localStorage.removeItem(''+v);
          target_tr.remove();
          todo_num--;
      });
      completed_list = [];

      //表示する内容が１件もない
      if(todo_num === 0){
          setCheckBoxforAll();
          all_check_box.checked = false;
          localStorage.clear();
          todo_count = 1;
      }else{
          changeCheckBoxforAll();
      }
      setTodoFooter();
      view();
    }

    function remove_attribute_active(){
        change_display_comp_btn.setAttribute("class","");
        change_display_all_btn.setAttribute("class","");
        change_display_active_btn.setAttribute("class","");
    }

    function view(){
        var checkboxes = document.getElementsByName("todo_check");
        checkboxes.forEach(function(cb){
            var tr_id = "todo_" + cb.value;
            var todo_tr = document.getElementById(tr_id);
            if(active_list.indexOf(cb.value) > -1 && ((view_content & 1) > 0)){
                todo_tr.style.display = "";
            }else if(completed_list.indexOf(cb.value) > -1 && ((view_content & 2) > 0)){
                todo_tr.style.display = "";
            }else{
                todo_tr.style.display = "none";
            }
        });
    }

    setTodoFooter();
    change_display_all();
    view();
};
