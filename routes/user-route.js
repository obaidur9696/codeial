const express = require('express')
const router = express.Router();
const passport = require('passport')

const userController = require('../controller/user_controller')
router.get('/profile/:id',passport.checkAuthentication, userController.profile)
router.post('/update/:id',passport.checkAuthentication, userController.update)
router.get('/sign-up', userController.signUp)
router.get('/sign-in', userController.signIn)

router.post('/create', userController.create)

// Use passport as a middleware to authenticate.
router.post('/createSession', passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'},
     
) , userController.createSession)

router.get('/sign-out', userController.destroySession)  

// This is route for google authentication.

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession)


module.exports= router;
