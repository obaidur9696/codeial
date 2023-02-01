const express = require('express')
const router = express.Router();
const fs = require('fs');
const path = require('path');

const User = require('../model/user')
/*Decoding input data from browser*/
router.use(express.urlencoded());

// Profile 
module.exports.profile = function (request, response) {
    // request.user contain the id of current sign in user from session cookies.
    User.findById(request.params.id, function (err, userdata) {
        if (err) {
            console.log('error in finding user in data base')
            return response.redirect('back');
        }

        if (userdata) {
            // console.log(userdata)
            return response.render('profile', {
                title: "Profile",
                userdata: userdata
            })
        }
        else {
            return response.redirect('/users/sign-in')
        }
    })
}
// Updating a profile.
module.exports.update = async function (request, response) {
    if (request.params.id == request.user) {
        try {
            let user = await User.findById(request.params.id,)
            User.uploadedAvatar(request, response, function (err) {
                if (err) {
                    console.log('********multer err', err)
                }

                // console.log(request.file)
                user.name = request.body.name;
                user.email = request.body.email;
                if (request.file) {
                    // Whenever we uploaded an avatar we will just check there is a previous version or not. if yes then delete it first. then append new one.

                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                    }

                    // This is saving the path of uploaded file into data base.
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }
                user.save();
                return response.redirect('back');
            });

        } catch (err) {
            request.flash('error', err);
            return response.redirect('back');
        }
    } else {
        request.flash('error', 'Profile Updated not successfully.')
        return response.status(401).send('Unauthorized');
    }

}


// render the sign up page
module.exports.signUp = function (request, response) {
    if (request.isAuthenticated()) {
        return response.redirect('/users/profile')
    }
    return response.render('sign_up', {
        title: "Authen Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function (request, response) {
    if (request.isAuthenticated()) {
        return response.redirect('/users/profile')
    }
    return response.render('sign_in', {
        title: "Authen Sign In"
    })
}

// get the sign up data
module.exports.create = function (request, response) {
    if (request.body.password != request.body.cpassword) {
        console.log("password did not match with conform password.")
        return response.redirect('back')
    }
    User.findOne({ email: request.body.email }, function (err, userdata) {
        if (err) {

            console.log('error in finding user in sign up')
            return response.redirect('back');
        }

        if (!userdata) {

            User.create(request.body, function (err, userData) {
                if (err) {
                    console.log('error in ctreating user while in sign up')
                    return;
                }
                else {

                    return response.redirect('/users/sign-in');
                }
            })
        } else {
            // console.log(userdata)
            console.log("This email is already exits")
            return response.redirect('/users/sign-up');
        }

    })

}

// get sign in data
module.exports.createSession = function (request, response) {
    //flash message
    request.flash('success', 'Logged in successfully');
    return response.redirect('/');
}


module.exports.destroySession = function (request, response, next) {
    //   request.logout();   This is define in pass port js for log out.

    request.logout(function (err) {
        if (err) {
            return next(err);
        }
        request.flash('success', 'Logged out successfully');
        return response.redirect('/');
    });

}
