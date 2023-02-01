const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();
const port = 9000;
const expressLayouts = require('express-ejs-layouts');

/*Connecting to MongoDB*/
const db = require('./config/mongoose.js');

// Use for session cookie.
const session = require('express-session');
//passport
const passport = require('passport')
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2.strategy')

//Mongo store is use to store session cookies into data base.
const MongoStore = require('connect-mongo');

// Saas middle ware to convert scss to css because browser does not understand scss sass file.
const sassMiddleware = require('node-sass-middleware');

// This one use for flash-message.
const flash = require('connect-flash')
const customMware = require('./config/middleware')

// Socket.io for chatting box. Setup chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSocket = require('./config/chat_socket').chatSocket(chatServer)
chatServer.listen(5000);
console.log('chat server is listen on port 5000');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',  // extended means scss file converted into different file.
    prefix: '/css'

}))


//Decoding data from browser
app.use(express.urlencoded());
app.use(cookieParser())


//Accessing Static file 
app.use(express.static('assets'))

// Make the upload path available to the browser.
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


/* Set up View engine */
app.set('view engine', 'ejs');
app.set('views', './views_folder')

//Session cookies middle ware which handle all cookies
// Mongo store is use to store the session cookie in the Data base.
app.use(session({
    name: 'authen_pj',
    //TODO change the secrate before the deplyoment in production mode.
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false.valueOf,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        //options)
        // store : new MongoStore({
        mongoUrl: "mongodb://localhost:27017/user_database_pj",
        autoremove: "disabled",
    }, function (err) {
        console.log("error at mongo store", err || "connection established to store cookie");
    })

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// using flash-connect
app.use(flash())
app.use(customMware.setFlash)

/*Use express router*/
app.use('/', require('./routes/index.js'))


app.listen(port, function (err) {
    if (err) {
        console.log(`Error is : ${err}`)
    }

    console.log(`Server is running on the port number : ${port}`)
})