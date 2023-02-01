const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user')

// We need to tell passport to use this LocalStrategy.

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passReqToCallback: true  //here we don't have request but if write passreqtocallback make true then we are able to write requestion.
    },
    function (request, email, password, done) {
        // Find the user and establish the identity.
        User.findOne({ email: email }, function (err, userdata) {
            if (err) {
                request.flash('error', err)
                return done(err);  //This done function report error to passport.
            }
            if (!userdata || userdata.password != password) {
                request.flash('error', 'Invalid username/password');
                return done(null, false)
            }

            return done(null, userdata)

        })
    }


));

// Serializing the user to decide which key is to be kept in the cookies.
passport.serializeUser(function (userdata, done) {
    done(null, userdata.id);
})

// Deserializing the user from the key in the cookies.
passport.deserializeUser(function (id, done) {

    User.findById(id, function (err, userdata) {
        // console.log(userdata)
        if (err) {
            console.log("error in  finding user in deserializing")
            return done(err);
        }

        return done(null, userdata.id)
    })
})

// Check if the user is authenticated.

passport.checkAuthentication = function (request, response, next) {
    //  if the user is signed, then pass on the request to the next function.
    if (request.isAuthenticated()) {
        return next();
    }

    // if the user is not sign in.
    return response.redirect('/users/sign-in')
}

passport.setAuthenticatedUser = function (request, response, next) {
    if (request.isAuthenticated()) {
        // request.user contain the current signed in user from the session cookie and we are just sending this to locals for the views.

        User.findById(request.user, function (err, userdata) {
            // console.log('*******', userdata)
            if (err) {
                console.log("error in  finding user in deserializing")
                return done(err);
            }
            // console.log(userdata)
            response.locals.user = userdata

        })
    }
    next();
}

module.exports = passport;
