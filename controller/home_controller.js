const User = require('../model/user');
const Post = require('../model/post')

module.exports.home = async function (request, response) {
  // To show what is currently in cookies
  // console.log(request.cookies)
  // Updated in cookies using below code.
  // response.cookie('user_id', 20)

  // request.user has the current sign in user id. This is a global variable.

  //  console.log(request)


  // Fetching post without User.
  // Post.find({}, function(err, Postdata){
  //   console.log(Postdata)
  //   return response.render('home', {
  //     title: "Home",
  //     posts:Postdata
  //   })
  // })

  // Populate the user for each post only
  //   Post.find({}).populate('user').exec(function(err, Postdata){
  //  if(err){
  //   console.log("error to find user in data base")
  //  }
  //     return response.render('home', {
  //       title: "Home",
  //       posts: Postdata
  //     })
  //   })

  // Populate the user for each post along with all comments. nested populating without async await.
  // Post.find({})
  //   .populate('user')
  //   .populate({
  //     path: 'comment',
  //     populate: {
  //       path: 'user'
  //     }
  //   })
  //   .exec(function (err, Postdata) {
  //     if (err) {
  //       console.log("error to find user in data base")
  //     }
  //     User.find({}, function (err, user_data) {
  //       return response.render('home', {
  //         title: "Home",
  //         posts: Postdata,
  //         all_user: user_data
  //       })
  //     })

  //   })


  // This is the code with async await. look code more relieable and clean
  try {
    let Postdata = await Post.find({})
      .populate('user')
      .populate({
        path: 'comment',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'like'
      }
      }).populate('comment')
      .populate('like');

    let user_data = await User.find({});

    return response.render('home', {
      title: "Home",
      posts: Postdata,
      all_user: user_data
    })

  }
  catch (err) {
    console.log('error : ', err)
    return;
  }
}



