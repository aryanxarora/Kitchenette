// * EXPRESS APP
const express = require('express');
const app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var fileUpload = require('express-fileupload');

// * VIEW ENGINE
app.set('view engine', 'ejs');

// * EXPRESS SESSIONS
const session = require('express-session')
app.use(session({
    secret: "very super secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*60*24*30,
        httpOnly: true
    }
}))

// * COOKIES
const cookieparser = require("cookie-parser")
app.use(cookieparser())

// * BODY PARSER - URL ENCODER
const bodyparser = require("body-parser")
const urlencoder = bodyparser.urlencoded({
    extended: false
})

// * MONGODB - MONGOOSE
const mongoose = require('mongoose');
const userModel = require('./models/user');
const recipeModel = require('./models/recipe');
const ingredientModel = require('./models/ingredient');

const recipes = [
    {
        rec_name: 'Chicken Tacos', 
        rec_tags: ['2HRS', 'PROTEIN'],
        rec_img: 'https://www.cook2eatwell.com/wp-content/uploads/2019/02/Shredded-Chicken-Tacos-Image-2.jpg'
    },
    {
        rec_name: 'Japanse Curry', 
        rec_tags: ['1HRS', 'CARBS'], 
        rec_img: 'https://www.justonecookbook.com/wp-content/uploads/2020/03/Japanese-Chicken-Curry-2417-I.jpg'
    },
    {
        rec_name: 'Shrimp Pasta',
        rec_tags: ['3HRS', 'SEAFOOD', 'PASTA'],
        rec_img: 'https://carlsbadcravings.com/wp-content/uploads/2020/01/Cajun-Shrimp-Pasta-v6.jpg'
    }
]

const ingredients = [
    {ing_name: 'Salt', ing_stock: false},
    {ing_name: 'Chicken', ing_stock: true},
    {ing_name: 'Tortilla', ing_stock: true}
]


app.listen(3000, () => {
    console.log("Listening to port 3000...");
})

app.get('/', (req, res) => {
    if(req.session.loggedIn == true){
        res.redirect('/app')
    } else {
        res.render('index')
    }
});

app.get('/login', (req, res) => {
    res.render('login', {error: ""});
});

app.get('/register', (req, res) => {
    res.render('register', {
        error: "",
    });
});

app.get('/signOut', (req, res) => {
    req.session.loggedIn = false;
    res.redirect('/')
})

app.post('/login', urlencoder, function (req, res){

    var user = 
    {
        userEmail: req.body.user_email,
        userPassword : req.body.user_password
    }

    userModel.findOne({userEmail: user.userEmail}, function (err, userQuery){
        if(err)
        {
            console.log(err.errors);
            res.render('login', {error: "ERR: DB validation"})
        }

        if(userQuery)
        {
            console.log("User found!")
            if(user.userPassword == userQuery.userPassword)
            {
                console.log("Login successful!");
                req.session.loggedIn = true;
                req.session.userEmail = userQuery.userEmail;
                // TODO: ADD RECIPES AND INGREDIENTS TO SESSION
                res.render('app', {user: req.session.userEmail, recipes, ingredients});
            } 
            else {
                res.render('login', {error: "Incorrect password, please try again!"})
            }
        } 
        else 
        {
            res.render('login', {error: "Username not found!"})
        }
    })
})

app.post('/register', urlencoder, function (req, res){

    var newUser = new userModel({
        userEmail: req.body.email,
        userPassword: req.body.password,
    })

    if(newUser.userEmail == "" || newUser.userPassword == ""){
        // ERR: INCOMPLETE DETAILS
        res.render('register', {
            error: "Please enter complete details!"
        })
    } else {
        userModel.findOne({userEmail: newUser.userEmail}, function (err1, userQuery){
            if (err1) {
                console.log(err1.errors);
                res.render('register', {
                    error: "ERR: DB validation"
                })
            }
            if (userQuery){
                console.log('ERR: User found');
                res.render('register', {
                    error: "User already exists! Please sign in!"
                })
            } else{
                newUser.save(function(err2, user) {
                    if (err2) {
                        console.log(err2.errors);
                        res.render('register', {
                            error: "User was not registered!"
                        })
                    } else {
                        console.log("Successfully registered user!");
                        console.log(user);
                        res.render('register', {
                            error: "User has succesfully registered!"
                        })
                    }
                });
            }
        });
    }
});

app.get('/app', (req, res) => {
    // TODO : FETCH USER DATA, ADD TO SESSION, PASS TO APP
    res.render('app', {user: req.session.userEmail, recipes, ingredients})
})

app.use((req, res) => {
    res.status(404).render('404');
})