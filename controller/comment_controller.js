const Comment = require("../model/comment")
const Post = require('../model/post')
const commentsMailer = require('../mailers/comments_mailer');
const kue=require('../config/kue');
const commentEmailworker = require('../workers/comments_email_worker');
const queue = require("../config/kue");

module.exports.create = async function (request, response) {
    // First we need to find the post id, then we need to comment on this. other anyone inspect and save wrong data into our database.
    try {
        let post_data = await Post.findById(request.body.post);

        if (post_data) {
            let comments = await Comment.create({
                content: request.body.content,
                user: request.user,
                post: request.body.post
            });
            post_data.comment.push(comments)
            post_data.save();


            //Send mail when a comment created by any users. First fetch the comments with user email and name and pass as an argument. 
            comments = await Comment.find({_id: comments._id}).populate('user', 'name email');

            // console.log("*******************", comments[0])
            // commentsMailer.newComment(comments[0]); this is change by workers.

            let job = queue.create('emails', comments[0]).save(function(err){
                if(err){
                    console.log('err in sending in queue', err)
                    return;
                }
                console.log('job enqueued ', job.id);
            })

            request.flash('success', 'Comment published!')

            return response.redirect('/');

        }
    } catch (err) {
        request.flash('error', err)
        return response.redirect('/');
    }

}


module.exports.destroy = async function (request, response) {
    let Comment_data = await Comment.findById(request.params.id);
    if (Comment_data.user == request.user) {
        let postId = Comment_data.post;
        Comment_data.remove();

        await Post.findByIdAndUpdate(postId, { $pull: { comment: request.params.id } });

      // CHANGE :: destroy the associated likes for this comment
      await Like.deleteMany({likeable: Comment_data._id, onModel: 'Comment'});

        request.flash('success', 'Comment deleted!')
        return response.redirect('back');
    }
    else {
        return response.redirect('back');
    }
}