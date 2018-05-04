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

    if(localStorage.getItem('todo_count')){
        todo_count = localStorage.getItem('todo_count');
        setTodo(todo_count);
        setCheckBoxforAll();
        changeCheckBoxforAll();
    }

    function setTodo(num){
        for(i = 1; i < num; i++ ){
            //tableに追加するタグを生成
            if(!localStorage.getItem('' + i)){
                continue;
            }
            var data = JSON.parse(localStorage.getItem(""+i));
            //tableに追加するタグを生成
            var $tr       = $('<tr>').attr("id","todo_" + i).on("mouseover", function(){
                $("button[name='"+$(this).attr("id")+"']:first").show();
            }).on("mouseout", function(){
                $("button[name='"+$(this).attr("id")+"']:first").hide();
            });
            var $td_check = $('<td>');
            var $td_text  = $('<td>');

            //todoのチェックボタン作成
            var $chk   = $("<input>").attr({
                value: i,
                type: "checkbox",
                name: 'todo_check'
            }).prop("checked",data["checked"] == 1 ? true: false).on("change",function(){
                var datat = JSON.parse(localStorage.getItem(""+$(this).val()));
                datat["checked"] = $(this).prop("checked") ? 1 : 0;
                localStorage.setItem(""+$(this).val(), JSON.stringify(datat));
                changeTodoStatus();
            });

            //todoの内容のテキストの作成
            var $todo_text = $("<label>").html(data["text"]).on("dblclick", function(){
                var tr = $(this).parent().parent();
                var label = this;
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
                        var inputVal = escape_html($(this).val()).replace(/(^(\s|　)+)|((\s|　)+$)/g, "");
                        //もし空欄だったら空欄にする前の内容に戻す
                        if(inputVal===''){
                            inputVal = this.defaultValue;
                        }
                        var datat = JSON.parse(localStorage.getItem(""+$(label).next("button").val()));
                        datat["text"] = inputVal;
                        localStorage.setItem(""+$(label).next("button").val(), JSON.stringify(datat));
                        //編集が終わったらtextで置き換える
                        $(label).text(inputVal);
                        $(tr).removeClass('on');
                        $(tr).show();
                        $(input_tr).remove();
                    }).on("keypress", function(e){
                        if ( e.keyCode === 13) {
                            var inputVal = escape_html($(this).val()).replace(/(^(\s|　)+)|((\s|　)+$)/g, "");
                            //もし空欄だったら空欄にする前の内容に戻す
                            if(inputVal===''){
                                inputVal = this.defaultValue;
                            }
                            var datat = JSON.parse(localStorage.getItem(""+$(label).next("button").val()));
                            datat["text"] = inputVal;
                            localStorage.setItem(""+$(label).next("button").val(), JSON.stringify(datat));
                            //編集が終わったらtextで置き換える
                            $(label).text(inputVal);
                            $(tr).removeClass('on');
                            $(tr).show();
                            $(input_tr).remove();
                        }
                    });
                }

            }).addClass("todo_text");

            //todoを削除するボタンの作成
            var $btn   = $("<button>").attr({
                value: i,
                name: "todo_" + i,
                type: "button",
                class: "delete_btn"
            }).hide().on("click", function(){
                var todo_number = this.value;
                localStorage.removeItem(""+todo_number);
                $("#todo_"+todo_number).remove();
                setTodoFooter();
                changeCheckBoxforAll();
                setCheckBoxforAll();
            });

            //整形してtodoリストに追加
            $td_check.append($chk);
            $td_text.append($todo_text,$btn);
            $tr.append($td_check,$td_text);
            $("#todo_list").append($tr);
        }
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

    //リストの表示を変更する用。主Keyを保存しておく
    $("#all_check").on("change", function(){
        var checked = $(this).prop('checked');
        $.each($("input[name='todo_check']"),function(index, v){
            var datat = JSON.parse(localStorage.getItem("" + $(v).val()));
            datat["checked"] = checked ? 1 : 0;
            localStorage.setItem(""+$(v).val(), JSON.stringify(datat));
            $(v).prop('checked',checked);
        });
        setTodoFooter();
        view();
    });

    //todoの入力のイベント
    $("#input_todo").on("keypress", function(e){
        if ( e.keyCode === 13) {
            addToDoList();
            view();
        }
    }).on("blur", function(){
        addToDoList();
        view();
    });

    function addToDoList(){
        var input_text = escape_html($("#input_todo").val()).replace(/(^(\s|　)+)|((\s|　)+$)/g, "");
        if(input_text == ""){
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
        }).on("change",function(){
            var datat = JSON.parse(localStorage.getItem(""+$(this).val()));
            datat["checked"] = $(this).prop("checked") ? 1 : 0;
            localStorage.setItem(""+$(this).val(), JSON.stringify(datat));
            changeTodoStatus();
        });

        //todoの内容のテキストの作成
        var $todo_text = $("<label>").html(input_text).on("dblclick", function(){
            var tr = $(this).parent().parent();
            var label = this;
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
                    var inputVal = escape_html($(this).val()).replace(/(^(\s|　)+)|((\s|　)+$)/g, "");
                    //もし空欄だったら空欄にする前の内容に戻す
                    if(inputVal===''){
                        inputVal = this.defaultValue;
                    }
                    var datat = JSON.parse(localStorage.getItem(""+$(label).next("button").val()));
                    datat["text"] = inputVal;
                    localStorage.setItem(""+$(label).next("button").val(), JSON.stringify(datat));
                    //編集が終わったらtextで置き換える
                    $(label).text(inputVal);
                    $(tr).removeClass('on');
                    $(tr).show();
                    $(input_tr).remove();
                }).on("keypress", function(e){
                    if ( e.keyCode === 13) {
                        var inputVal = escape_html($(this).val()).replace(/(^(\s|　)+)|((\s|　)+$)/g, "");
                        //もし空欄だったら空欄にする前の内容に戻す
                        if(inputVal===''){
                            inputVal = this.defaultValue;
                        }
                        var datat = JSON.parse(localStorage.getItem(""+$(label).next("button").val()));
                        datat["text"] = inputVal;
                        localStorage.setItem(""+$(label).next("button").val(), JSON.stringify(datat));
                        //編集が終わったらtextで置き換える
                        $(label).text(inputVal);
                        $(tr).removeClass('on');
                        $(tr).show();
                        $(input_tr).remove();
                    }
                });
            }

        }).addClass("todo_text");

        //todoを削除するボタンの作成
        var $btn   = $("<button>").attr({
            value: todo_count,
            name: "todo_" + todo_count,
            type: "button",
            class: "delete_btn"
        }).hide().on("click", function(){
            var todo_number = this.value;
            localStorage.removeItem(""+todo_number);
            $("#todo_"+todo_number).remove();
            setTodoFooter();
            setCheckBoxforAll();
            changeCheckBoxforAll();
        });

        //整形してtodoリストに追加
        $td_check.append($chk);
        $td_text.append($todo_text,$btn);
        $tr.append($td_check,$td_text);
        $("#todo_list").append($tr);
        var data = {
            text: input_text,
            checked: 0
        }
        localStorage.setItem(''+todo_count, JSON.stringify(data));
        //todoの入力をリセット,アクティブリストへの追加,todo数の管理
        $("#input_todo").val("");
        todo_count++;
        localStorage.setItem('todo_count',todo_count);
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
        if($("input[name='todo_check']").length > 0){
            $("#all_check").prop("checked",($("input[name='todo_check']:not(:checked)").length > 0 )? false :true);
        }else{
            $("#all_check").prop("checked", false);
            localStorage.removeItem("todo_count");
        }
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
        $(".active").removeClass("active");
        $(this).addClass("active").blur();
        view();
    });

    $("#change_display_active_btn").on("click", function(){
        view_content = disp_active;
        $(".active").removeClass("active");
        $(this).addClass("active").blur();
        view();
    });
    $("#change_display_completed_btn").on("click",function(){
        view_content = disp_comp;
        $(".active").removeClass("active");
        $(this).addClass("active").blur();
        view();
    });
    //completedのリストを見て、削除を行うだけ。簡単
    $("#completed_clear_btn").on("click",function(){
        $.each($("input[name='todo_check']:checked"),function(index, cb){
            localStorage.removeItem(""+$(cb).val());
            $("#todo_" + $(cb).val()).remove();
        });
        view();
        setTodoFooter();
        changeCheckBoxforAll();
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
    changeCheckBoxforAll();
    view();
})
