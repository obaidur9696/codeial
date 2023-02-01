const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;

const User = require('../model/user')

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   
    secretOrKey: 'codeial'
}

passport.use(new JwtStrategy(opts, function (jwtPayLoad, done) {
    //Payload contain the all information about 
    User.findById(jwtPayLoad._id, function (err, userdata) {
        if (err) {
            console.log("err to find user in db!?");
            return;
        }
        if (userdata) {
            return done(null, userdata)
        } else {
            return done(null, false);
        }

    })

}))


module.exports = passport