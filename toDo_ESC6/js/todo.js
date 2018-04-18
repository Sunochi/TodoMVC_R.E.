
window.onload = function () {
  let todo_num = 0; //@TODO localの値を代入する
  let todo_count = 1;
  // 常に使用しそうなDOMは最初に用意しておく
  var input_todo = document.getElementById("input_todo");
  var todo_list = document.getElementById("todo_list");
  var under_text = document.getElementById("under_text");
  var all_check_box = document.getElementById("all_check");

  //todoの入力のイベント
  input_todo.addEventListener("keypress", onKeyPress);
  input_todo.addEventListener("blur", addToDoList);
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
      todo_num++;

      //tableに追加するタグを生成
      var tr = document.createElement("TR");
      var td_check = document.createElement("TD");
      var td_text = document.createElement("TD");
      tr.id = "todo_" + todo_count;
      tr.name = "todo";
      tr.addEventListener("mouseover", indicateBtn);
      tr.addEventListener("mouseout", hiddenBtn);

      //todoのチェックボタン作成
      var chk = document.createElement("INPUT");
      chk.setAttribute("type", "checkbox");
      chk.setAttribute('name', 'todo_check');
      chk.value = "todo_" + todo_count;

      //todoの内容のテキストの作成
      var todo_text = document.createElement("SPAN");
      todo_text.innerHTML = input_todo.value;

      //todoを削除するボタンの作成
      var btn = document.createElement("BUTTON");
      btn.setAttribute("type", "button");
      btn.value = todo_count;
      btn.name = "todo_" + todo_count;
      btn.addEventListener('click',deleteTodo);
      btn.style.display = "none";

      //整形してtodoリストに追加
      td_check.appendChild(chk);
      td_text.appendChild(todo_text);
      td_text.appendChild(btn);
      tr.appendChild(td_check);
      tr.appendChild(td_text);
      todo_list.appendChild(tr);

      //todoの入力をリセット
      input_todo.value = "";
      todo_count++;
      //todo_listの数が１個以上になるので、全チェックボタンを有効に
      setAllCheckBox(true);
  }

  function indicateBtn(){
      var btn = document.getElementsByName(this.id)[0];
      btn.style.display = "";
  }
  function hiddenBtn(){
      var btn = document.getElementsByName(this.id)[0];
      btn.style.display = "none";
  }

  function deleteTodo(){
      var target_tr = document.getElementById("todo_" + this.value);
      target_tr.parentNode.removeChild(target_tr);
      todo_num--;
      if(todo_num === 0){
          setAllCheckBox(false);
      }
  }

  function setAllCheckBox(flg){
      all_check_box.disabled = !flg;
  }
};
