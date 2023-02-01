const Post = require("../model/post")
const Comment = require('../model/comment')

module.exports.create = async function (request, response) {

    try {
        await Post.create({
            content: request.body.content,
            user: request.user
        });
        request.flash('success', 'Post published!')
        return response.redirect('back');

    } catch (err) {
        request.flash('error', err)
        return response.redirect('back');
    }

}

module.exports.destroy = async function (request, response) {

    try{
        let Post_data = await Post.findById(request.params.id);
        if (Post_data.user == request.user) {

         // CHANGE :: delete the associated likes for the post and all its comments' likes too
         await Like.deleteMany({likeable: Post_data, onModel: 'Post'});
         await Like.deleteMany({_id: {$in: Post_data.comment}});


            // For deleting data from data base
            Post_data.remove();
    
            //We also need to delete all comment associated with that particular post.
            await Comment.deleteMany({
                post: request.params.id
            });

            request.flash('success', 'Post and associated comments deleted')
            return response.redirect('back');
        }
        else {
            request.flash('error', "You can't delete this post")
            return response.redirect('back');
        }
    }
    catch (err) {
        request.flash('error', err)
        return response.redirect('back');
    }
  
}
