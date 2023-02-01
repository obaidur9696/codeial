
module.exports.chatSocket = function (socketServer) {
    let io = require('socket.io')(socketServer,
        {
            cors: {
                origin: "http://localhost:8000",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        }
    );

    io.sockets.on('connection', function (socket) {
        console.log('new connection received', socket.id);

        socket.on('disconnect', function () {
            console.log('socket disconnected!');
        });

        // Receving the connection from the user who want to join chat room. 
        // Note: in socket.io for detecting any thing from client side. we will use (socket.on).
        socket.on('join_room', function (data) {
            console.log('joining request received : ', data);

            //joining the room. if data.chatroom is available then that will be enter into that chatroom. if does not availabe then it will be create and enter into to that chatroom.
            socket.join(data.chatroom);

            //Now when i enter to chat room then all other should be received the notification this user has join the chatroom. But  we will be only do sending a notification(emmiting) including me  someone join the chat room.
            io.in(data.chatroom).emit('user_join', data)

        });


        // Receving message from client or user
        socket.on('send_message', function(data){
            //Sending emit back to client message received.
            io.in(data.chatroom).emit('receive_message', data); 
        })

    });

}