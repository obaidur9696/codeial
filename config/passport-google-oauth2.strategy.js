const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');
const User = require('../model/user');

// tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID: "153732210720-9lc4ao0f9m0qc68oq64vbu931t19aef2.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    //Google also send us to accessToken when our access token expire then refresh token help to regenerate accessToken.
    function (accessToken, refreshToken, profile, done) {
        //find a user
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('error in google strategy', err);
                return;
            }

            console.log(profile)

            if(user){
                return done(null, user)
            }else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('err to creating accout', err)
                        return;
                    }
                    return done(null, user)
                })
            }
        })
    }


))

module.exports = passport;