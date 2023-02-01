const Like = require('../model/like');
const Comment = require("../model/comment");
const Post = require('../model/post');

module.exports.toggleLike = async function (request, response) {
    try {
        // route will be like : likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;

        if (request.query.type == 'Post') {
            likeable = await Post.findById(request.query.id).populate('like')
        } else {
            likeable = await Post.findById(request.query.id).populate('like')
        }


        //Check if a like already exits.
        let existingLike = await Like.findOne({
            likeable: request.query.id,
            onModel: request.query.type,
            user: request.user
        })

        //If a like already exits then delete it 
        if (existingLike) {
            likeable.like.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }
        else {
            //Else make a like.

            let newLike = await Like.create({
                user: request.user,
                likeable: request.query.id,
                onModel: request.query.type

            })

            likeable.like.push(newLike._id)
            likeable.save()
        }

        return response.json(200, {
            message: "Request successfully",
            data: {
                deleted : deleted
            }
        })
    }
    catch (err) {
        console.log(err)
        return response.json(500, {
            message: "Internal server error"
        })
    }
}