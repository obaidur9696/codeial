class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // import {io} from "socket.io-client";
        // const io = require("socket.io-client");
        this.socket = io("http://localhost:5000", {
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });

        if (this.userEmail) {
            this.connectionHandler();
        }

    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function () {
            console.log('connection established using sockets from client side...!');

            //sending an emit to join the room. and we need to send also some data along with. which user i want to chat with. also send name of chat oom in this case will be Codiel room.
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codielroom'
            });

            // We will be detecting when user join the room. acknowladge by server.
            self.socket.on('user_join', function (data) {
                console.log('A new user joined!! ', data)
            });

        });

        //sending an emit by user with chatroom to server.
        $('#send-message').click(function () {
            let msg = $('#chat-message-input').val();

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codielroom'
                })
            }
        })

        // receving acknowladge from server side about receving the data.
        self.socket.on('receive_message', function(data){
            console.log('message received !!', data.message);

            // creating a new li to pushing the message.
            let newMessage = $('<li>');

            let messageType = 'other-message'

            if(data.user_email == self.userEmail){
                messageType = 'self-message'
            }

            newMessage.append($('<span>', {
                'html': data.message
            }))

            newMessage.append($('<span>', {
                'html' : data.user_email
            }))

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);

        })


    }
}