var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = [];
var namesUsed = [];
var currentRoom = [];

exports.listen = function(server){
    io = socketio.listen(server);

    io.sockets.on("connection", function(socket){
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

        joinRoom(socket, "Lobby");

        socket.on("changeName", function(name){
            if(name.indexOf('Guest') == 0){
                socket.emit("nameResult",{
                    success: false,
                    message: '"Guest"から始まる名前は使えません。'
                });
            } else {
                if(namesUsed.indexOf(name) == -1){
                    var prename = nickNames[socket.id];
                    var prenameIndex = namesUsed.indexOf(prename);
                    namesUsed.push(name);
                    nickNames[socket.id] = name;
                    delete namesUsed[prenameIndex];

                    socket.emit("nameResult",{
                        success: true,
                        name: name
                    });
                    io.to(currentRoom[socke.id]).emit("message",{
                        text: prename + ' さんが' + name + 'に名前を変更しました。'
                    });
                } else {
                    socket.emit("nameResult",{
                        success: false,
                        message: '既に使われている名前です。"'
                    });
                }
            }
        });

        socket.on("message", function(message){
            io.to(message.room).emit("message", {
                text: nickNames[socket.id] + ": " + message.text
            });
        });

        socket.on("join", function(room){
            if(currentRoom[socket.id] != "Lobby"){
                socket.broadcast.to(room.room).emit("message", {
                    text: nickNames[socket.id] + "さんが退出しました。"
                });
            }
            socket.leave(currentRoom[socket.id]);
            joinRoom(socket, room.newRoom);
            console.log(room);
        });

        socket.on("disconnect", function(){
            var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
            delete namesUsed[nameIndex];
            delete nickNames[socket.id];
        });
    });
};


function assignGuestName(socket, guestNumber, nickNames, namesUsed){
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function joinRoom(socket, room){
    socket.join(room);

    currentRoom[socket.id] = room;
    socket.emit("jointResult", {room: room});

    socket.broadcast.to(room).emit("message",{
        text: nickNames[socket.id] + 'さんが入室しました。'
    });
}
