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
const { raw } = require('body-parser');

var recipes = []

const ingredients = [
    {ing_name: 'Salt', ing_stock: false},
    {ing_name: 'Chicken', ing_stock: true},
    {ing_name: 'Tortilla', ing_stock: true},
    {ing_name: 'Pepper', ing_stock: false}
]

app.listen(process.env.PORT || 3000)

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

app.get('/getRecipes', (req, res) => {
    if( req.session.loggedIn == true){
        var recipeObject = [];
        recipeModel.find({userRef: req.session.userRef}).exec(function (err, result){
            result.forEach(function (document){
                recipeObject.push(document.toObject());
            });
            console.log("Inside /getRecipes: ")
            console.log(recipeObject)
            recipes = recipeObject;
            console.log(recipes);
        })
        res.redirect('/');
    }
})

app.post('/addRecipe', urlencoder, (req, res) => {

    if(req.session.loggedIn == true){
        var newRecipe = new recipeModel({
            userRef: req.session.userRef,
            recipeName: req.body.modal_recipeName,
            recipeTag: req.body.modal_recipeTag.split(','),
            recipeIngredients: req.body.modal_recipeIngredients,
            recipeNotes: req.body.modal_recipeNotes,
            recipePhoto: req.body.modal_recipePhoto
        })
    
        newRecipe.save((err, user) => {
            if(err) {
                console.log(err);
                alert('Recipe was not registered');
            } else {
                console.log("Successfully added recipe!");
                console.log(user);
                res.redirect('/getRecipes');
            }
        })
    } else {
        res.redirect('/')
    }

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
                req.session.userRef = userQuery._id;
                // TODO: ADD RECIPES TO SESSION
                console.log(userQuery);
                res.redirect('/getRecipes');
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

app.get('/recipe/:id', (req, res) => {
    const link = req.params.id;
    recipeModel.findOne({_id: link}, function(err, recipe){
        res.render('recipe', {recipe});
    })
})

app.get('/delete/:id', (req, res) => {
    if( req.session.loggedIn == true ){
        const link = req.params.id;
        recipeModel.deleteOne({_id: link}, function (err){
            if(err){
                console.log(err);
            } else {
                console.log("Delete Succesful")
                res.redirect('/getRecipes');
            }
        })   
    }
})

app.get('/app', (req, res) => {
    // TODO : FETCH USER DATA, ADD TO SESSION, PASS TO APP
    if(req.session.loggedIn){
        console.log("Inside /app: ")
        console.log(recipes);
        setTimeout(function(){
            res.render('app', {user: req.session.userEmail, recipes})
        }, 2000);
    } else {
        res.redirect('/')
    }
})

app.use((req, res) => {
    res.status(404).render('404');
})