/********************************
@TODO 保存の動作対応 2018/04/18 簾内
*********************************/


window.onload = function () {
    let todo_num   = 0; //現在のTodoの数(allで表示される数)
    let todo_count = 1; //今までのTodoの数（主Key）
    let active_num = 0; //activeの数

    // 常に使用しそうなDOMは最初に用意しておく
    var input_todo    = document.getElementById("input_todo");
    var todo_list     = document.getElementById("todo_list");
    var todo_footer   = document.getElementById("todo_footer");
    var footer_text   = document.getElementById("items_left_text");
    var all_check_box = document.getElementById("all_check");

    //リストの表示を変更する用。主Keyを保存しておく
    var active_list    = [];
    var completed_list = [];

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

    //todoリストに入力内容を追加する
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
        chk.value = "todo_" + todo_count;
        chk.setAttribute("type", "checkbox");
        chk.setAttribute('name', 'todo_check');

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
        active_list.add(todo_count);
        todo_num++;
        todo_count++;
        active_num++;
        //todo_listの数が必ず１個以上になるので、全チェックボタンとフッターを有効に
        setCheckBoxforAll(true);
        setTodoFooter(true);
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
        target_tr.remove();
        todo_num--;
        //表示する内容が１件もない
        if(todo_num === 0){
            setAllCheckBox(false);
            setTodoFooter(false);
        }else{
            setTodoFooter(true);
        }
    }

    //全チェックボタンの表示・非表示の切り替え
    function setCheckBoxforAll(flg){
        all_check_box.disabled = !flg;
    }

    //テーブルのフッターの整形/表示・非表示
    function setTodoFooter(flg){
        footer_text.innerHTML = "" + active_num + " items left";
        if(flg){
            todo_footer.style.display = "";
        }else{
            todo_footer.style.display = "none";
        }
    }
};
