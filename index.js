var http = require('http');
var fs   = require('fs');
var path = require('path');
var mime = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js":  "text/javascript",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
    // 読み取りたいMIMEタイプはここに追記
    // MIMEを宣言しないとクライアント側のHTMLに通した
    // JSやCSSが取得できない
};
//socket.ioモジュールの読み込み
var socketio = require("socket.io");

//HTTPオブジェクトを生成
var server = new http.createServer(function(req, res) {
    if(req.url == '/'){
        filePath = '/root/backbone.html';
    }else{
        filePath = "/root"+req.url;
    }
    //ここで絶対PATHの取得
    var fullPath = __dirname + filePath;
    fs.readFile(fullPath, function(err, data){
        if(err){
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("Error 404: resource not found.");
            res.end();
        }else{
            res.writeHead(200, {"Content-Type": mime[path.extname(fullPath)] || "text/plain"});
            res.end(data, 'UTF-8');
        }
    });
}).listen(3333);

var userHash = {};

/*//イベントハンドラを設定
var io = socketio.listen(server);
io.sockets.on("connection", function (socket){

   //メッセージ送信（送信者にも送られる）
   socket.on("connected", function (name){
       var msg = data + "が入室しました";
       userHash[socket.id] = data;
      io.sockets.emit("publish", {value: msg});
   });

   //ブロードキャスト（送信者以外の全員に送信）
   socket.on("publish", function (data){
      socket.broadcast.emit("publish", {value:data.value});
   });

   //切断したときに送信
   socket.on("disconnect", function (){
       if(userHash[socket.id]){
           var msg = userHash[socket.id] + "が退出しました";
           delete userHash[socket.id];
           io.sockets.emit("publish", {value: msg});
        }
   });
});
*/

var todoServer = require('./lib/server.js');
todoServer.listen(server);
