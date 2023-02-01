const User = require('../../../model/user');
const Post = require('../../../model/post')
const Comment = require('../../../model/comment');
const { post } = require('../../../routes');

module.exports.index = async function (request, response) {

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user'
            }
        });

    return response.json(200, {
        message: "List of post in v1",
        posts: posts
    })
}

module.exports.destroy = async function (request, response) {

    try{
        let Post_data = await Post.findById(request.params.id);
        if (Post_data.user == request.user) {
            // For deleting data from data base
            Post_data.remove();
    
            //We also need to delete all comment associated with that particular post.
            await Comment.deleteMany({
                post: request.params.id
            });
           
        
            return response.json(200, {
                message: "Post and associate comment deleted"
            })
        }
        else {
           return response.json(401, {
            message: "you can't delete this post"
           })
        }
    }
    catch (err) {
    
        return response.json(500, {
            message: 'Internal server erros'
        })
    }
  
}
