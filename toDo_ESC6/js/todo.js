/********************************
@TODO 保存の動作対応 2018/04/18 簾内
*********************************/


window.onload = function () {
    const disp_all    = 3;
    const disp_active = 1;
    const disp_comp   = 2;
    let todo_num   = 0; //現在のTodoの数(allで表示される数)
    let todo_count = 1; //今までのTodoの数（主Key）
    let active_num = 0; //activeの数
    let view_content = disp_all; //表示するコンテンツの切り替え用。"all":3, "active":1, "complete":2

    // 常に使用しそうなDOMは最初に用意しておく
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

    //リストの表示を変更する用。主Keyを保存しておく
    var active_list    = [];
    var completed_list = [];

    all_check_box.addEventListener("change", allchecked);
    //todoの入力のイベント
    input_todo.addEventListener("keypress", onKeyPress);
    input_todo.addEventListener("blur", addToDoList);

    //入力欄でのキーの押下時の動作
    function onKeyPress(e){
        if ( e.keyCode !== 13) {
            return false;
        }
        addToDoList();
    }

    //todoリストに入力内容を追加する。保存から復元する関数と類似した部分は別関数にする。
    function addToDoList(){
        if(input_todo.value == ""){
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
        chk.addEventListener('change', changeTodoStatus);

        //todoの内容のテキストの作成
        var todo_text       = document.createElement("SPAN");
        todo_text.innerHTML = input_todo.value;

        //todoを削除するボタンの作成
        var btn   = document.createElement("BUTTON");
        btn.value = todo_count;
        btn.name  = "todo_" + todo_count;
        btn.setAttribute("type", "button");
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
        input_todo.value = "";
        active_list.push(chk.value);
        todo_num++;
        todo_count++;
        active_num++;
        //todo_listの数が必ず１個以上になるので、全チェックボタンとフッターを有効に
        setCheckBoxforAll();
        setTodoFooter();
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
        target_tr.remove();
        todo_num--;

        //表示する内容が１件もない
        if(todo_num === 0){
            setCheckBoxforAll();
        }
        setTodoFooter();
    }

    //全チェックボタンの表示・非表示の切り替え
    function setCheckBoxforAll(){
        all_check_box.disabled = (active_num > 0) ? false:true;
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
    }

    change_display_all_btn.addEventListener("click",change_display_all);
    change_display_active_btn.addEventListener("click",change_display_active);
    change_display_comp_btn.addEventListener("click",change_display_completed);
    comp_clear_btn.addEventListener("click",change_display_clear);
    //activeとcompletedのリストを見てtrの表示を変えるだけ。簡単
    function change_display_all(){
        view_content = disp_all;
        view()
    }
    function change_display_active(){
        view_content = disp_active;
        view()
    }
    function change_display_completed(){
        view_content = disp_comp;
        view()
    }
    //completedのリストを見て、削除を行うだけ。簡単
    function change_display_clear(){

    }

    function view(){
        var checkboxes = document.getElementsByName("todo_check");
        checkboxes.forEach(function(cb){
            var tr_id = "todo_" + cb.value;
            var todo_tr = document.getElementById(tr_id);
            console.log(active_list);
            console.log(cb.value);
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
    change_display_clear();
    view();
};
