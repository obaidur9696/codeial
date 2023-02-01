const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    //Comments belongs to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,  //This id will coneectted with that particular post.
        ref: 'User'  //refer to user schema.

    },
    post: {
        type: mongoose.Schema.Types.ObjectId,  //This id will coneectted with that particular post.
        ref: 'Post'  //refer to user schema.

    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,  
            ref: 'Like' 
        }
    ]

}, {
    timestamps: true
})

const Comment= mongoose.model('Comment', commentSchema);

module.exports = Comment;