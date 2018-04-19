/********************************
@TODO 保存の動作対応 2018/04/18 簾内
@TODO comp_clear_btnの実装　2018/04/19 すのうち
*********************************/


$(document).ready(function(){
    const disp_all    = 3;
    const disp_active = 1;
    const disp_comp   = 2;
    let todo_count = 1; //今までのTodoの数（主Key）
    let view_content = disp_all; //表示するコンテンツの切り替え用。"all":3, "active":1, "complete":2

    //リストの表示を変更する用。主Keyを保存しておく
    $("#all_check").on("change", function(){
        var checked = $(this).prop('checked');
        $.each($("input[name='todo_check']"),function(index, v){
            if($(v).prop('checked') != checked){
                $(v).prop('checked',checked);
            }
        });
        setTodoFooter();
        view();
    });

    //todoの入力のイベント
    $("#input_todo").on("keypress", function(e){
        if ( e.keyCode === 13) {
            addToDoList();
        }
    }).on("blur", function(){
        addToDoList();
    });

    function addToDoList(){
        if($("#input_todo").val() == ""){
            return false;
        }
        //tableに追加するタグを生成
        var $tr       = $('<tr>').attr("id","todo_" + todo_count).on("mouseover", function(){
            $("button[name='"+$(this).attr("id")+"']:first").show();
        }).on("mouseout", function(){
            $("button[name='"+$(this).attr("id")+"']:first").hide();
        });
        var $td_check = $('<td>');
        var $td_text  = $('<td>');

        //todoのチェックボタン作成
        var $chk   = $("<input>").attr({
            value: todo_count,
            type: "checkbox",
            name: 'todo_check'
        }).on("change",function(){changeTodoStatus();});

        //todoの内容のテキストの作成
        var $todo_text = $("<span>").html($("#input_todo").val()).on("dblclick", function(){
            var tr = $(this).parent().parent();
            var span = this;
            if(!$(tr).hasClass('on')){
                $(tr).addClass('on');
                var input_tr   = $("<tr>").append($("<td>"));
                var input_area = $("<input>").attr({
                    type: "text",
                    value: $(this).text(),
                });
                $(input_tr).append($("<td>").append(input_area));
                $(tr).after($(input_tr));
                $(tr).hide();
                $(input_area).focus().on("blur",function(){
                    var inputVal = $(this).val();
                    //もし空欄だったら空欄にする前の内容に戻す
                    if(inputVal===''){
                        inputVal = this.defaultValue;
                    }
                    //編集が終わったらtextで置き換える
                    $(span).text(inputVal);
                    $(tr).removeClass('on');
                    $(tr).show();
                    $(input_tr).remove();
                }).on("keypress", function(e){
                    if ( e.keyCode === 13) {
                        var inputVal = $(this).val();
                        //もし空欄だったら空欄にする前の内容に戻す
                        if(inputVal===''){
                            inputVal = this.defaultValue;
                        }
                        //編集が終わったらtextで置き換える
                        $(span).text(inputVal);
                        $(tr).removeClass('on');
                        $(tr).show();
                        $(input_tr).remove();
                    }
                });
            }

        });

        //todoを削除するボタンの作成
        var $btn   = $("<button>").attr({
            value: todo_count,
            name: "todo_" + todo_count,
            type: "button"
        }).hide().on("click", function(){
            var todo_number = this.value;
            $("#todo_"+todo_number).remove();
            setTodoFooter();
            setCheckBoxforAll();
        });

        //整形してtodoリストに追加
        $td_check.append($chk);
        $td_text.append($todo_text,$btn);
        $tr.append($td_check,$td_text);
        $("#todo_list").append($tr);

        //todoの入力をリセット,アクティブリストへの追加,todo数の管理
        $("#input_todo").val("");
        todo_count++;
        //todo_listの数が必ず１個以上になるので、全チェックボタンとフッターを有効に
        setCheckBoxforAll();
        setTodoFooter();
        changeCheckBoxforAll();
    }

    //全チェックボタンの表示・非表示の切り替え
    function setCheckBoxforAll(){
        if($("input[name='todo_check']").length == 0){
            $("#all_check").prop("checked", false);
        }
        $("#all_check").prop("disabled", ($("input[name='todo_check']").length > 0) ? false:true);
    }

    function changeCheckBoxforAll(){
        $("#all_check").prop("checked",($("input[name='todo_check']:not(:checked)").length > 0) ? false :true);
    }

    //テーブルのフッターの整形/表示・非表示
    function setTodoFooter(){
        $("#items_left_text").html("" + $("input[name='todo_check']:not(:checked)").length + " items left");
        $("#todo_footer").toggle($("input[name='todo_check']").length > 0);
        $("#completed_clear_btn").toggle($("input[name='todo_check']:checked").length > 0);
    }


    function changeTodoStatus(){
        setTodoFooter();
        changeCheckBoxforAll();
        view();
    }

    //activeとcompletedのリストを見てtrの表示を変えるだけ。簡単
    $("#change_display_all_btn").on("click",function(){
        view_content = disp_all;
        view();
    });

    $("#change_display_active_btn").on("click", function(){
        view_content = disp_active;
        view();
    });
    $("#change_display_completed_btn").on("click",function(){
        view_content = disp_comp;
        view();
    });
    //completedのリストを見て、削除を行うだけ。簡単
    $("#completed_clear_btn").on("click",function(){
        $.each($("input[name='todo_check']:checked"),function(index, cb){
            $("#todo_" + $(cb).val()).remove();
        });
        view();
        setTodoFooter();
        setCheckBoxforAll();
    });

    function view(){
        $.each($("input[name='todo_check']"),function(index, cb){
            var tr_id = "#todo_" + $(cb).val();
            if($(cb).prop("checked") == false && ((view_content & 1) > 0)){
                $(tr_id).show();
            }else if($(cb).prop("checked") == true && ((view_content & 2) > 0)){
                $(tr_id).show();
            }else{
                $(tr_id).hide();
            }
        });
    }

    setTodoFooter();
    view();
})
