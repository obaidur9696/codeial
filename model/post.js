const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,  //This id will connected with that particular post.
        ref: 'User'  //refer to user schema.

    },

    // include the array of ids of all comments in this post schema it sellf.
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,  
            ref: 'Comment' 
        }
    ],

    like: [
        {
            type: mongoose.Schema.Types.ObjectId,  
            ref: 'Like' 
        }
    ]

}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;