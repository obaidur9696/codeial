const mongoose = require('mongoose');


const frienshipSchema = new mongoose.Schema({

    //the user who send request.
    from_user: {
        type: mongoose.Schema.Types.ObjectId,  //This id will coneectted with that particular post.
        ref: 'User'  //refer to user schema.

    },

    // The user who accept the request.
    to_user: {
        type: mongoose.Schema.Types.ObjectId,  //This id will coneectted with that particular post.
        ref: 'User'  //refer to user schema.

    }
}, {
    timestamps: true
})

const Friendship = mongoose.model('Friendship', frienshipSchema);

module.exports = Friendship;