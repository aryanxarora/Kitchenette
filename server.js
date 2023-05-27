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
//const mongoose = require('mongoose');
//const userModel = require('./models/user');
//const recipeModel = require('./models/recipe');
const { raw } = require('body-parser');

var recipes = [
    {
      id: "12345",
      recipePhoto:
        "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
      recipeName: "Mozarella Gnocchi",
      recipeTag: "Healthy",
    },
    {
      id: "23456",
      recipePhoto:
        "https://www.slenderkitchen.com/sites/default/files/styles/gsd-1x1/public/recipe_images/pesto-chicken.jpg",
      recipeName: "Pesto Chicken",
      recipeTag: "Italian",
    },
    {
      id: "34567",
      recipePhoto:
        "https://www.rachelcooks.com/wp-content/uploads/2022/09/Beef-Stir-Fry-with-Vegetables016-web-square.jpg",
      recipeName: "Beef Stir Fry",
      recipeTag: "Asian",
    },
    {
      id: "45678",
      recipePhoto:
        "https://www.theflavorbender.com/wp-content/uploads/2018/03/Butter-and-Lemon-Slow-Roasted-Salmon-The-Flavor-Bender-Featured-Image-SQ-11.jpg",
      recipeName: "Salmon with Lemon Butter Sauce",
      recipeTag: "Seafood",
    },
    {
      id: "56789",
      recipePhoto:
        "https://plantbasedandbroke.com/wp-content/uploads/2021/03/Thai-Style-Vegetable-Curry-1200x1200-1.png",
      recipeName: "Vegetable Curry",
      recipeTag: "Vegetarian",
    },
    {
      id: "67890",
      recipePhoto:
        "https://jessicainthekitchen.com/wp-content/uploads/2021/06/Teriyaki-Tofu-14.jpg",
      recipeName: "Teriyaki Tofu",
      recipeTag: "Vegetarian",
    },
    {
      id: "78901",
      recipePhoto:
        "https://www.simplyrecipes.com/thmb/hcdnhU89fQgsmMkeppMwHx4TKnk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2011__08__dads-greek-salad-horiz-a-1600-bc71b85bc907414a9bb3179a923b58fc.jpg",
      recipeName: "Greek Salad",
      recipeTag: "Healthy",
    },
    {
      id: "89012",
      recipePhoto:
        "https://assets.bonappetit.com/photos/5ea8f0df16738800085ad5d2/1:1/w_2560%2Cc_limit/Chicken-Parmesean-Recipe-Lede.jpg",
      recipeName: "Chicken Parmesan",
      recipeTag: "Italian",
    },
    {
      id: "90123",
      recipePhoto:
        "https://www.modernhoney.com/wp-content/uploads/2023/01/Ground-Beef-Tacos-11-crop-scaled.jpg",
      recipeName: "Beef Tacos",
      recipeTag: "Mexican",
    },
    {
      id: "01234",
      recipePhoto:
        "https://www.allrecipes.com/thmb/jiV_4f8vXFle1RdFLgd8-_31J3M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/229960-shrimp-scampi-with-pasta-DDMFS-4x3-e065ddef4e6d44479d37b4523808cc23.jpg",
      recipeName: "Shrimp Scampi",
      recipeTag: "Seafood",
    },
    {
      id: "98765",
      recipePhoto:
        "https://www.wholesomeyum.com/wp-content/uploads/2022/05/wholesomeyum-Caprese-Salad-5.jpg",
      recipeName: "Caprese Salad",
      recipeTag: "Italian",
    },
    {
      id: "87654",
      recipePhoto:
        "https://www.eatwell101.com/wp-content/uploads/2018/03/Chicken-Pasta-and-Broccoli-Skillet.jpg",
      recipeName: "Stir-Fried Noodles",
      recipeTag: "Asian",
    },
    {
      id: "76543",
      recipePhoto:
        "https://cdn.loveandlemons.com/wp-content/uploads/2023/01/mushroom-risotto.jpg",
      recipeName: "Mushroom Risotto",
      recipeTag: "Italian",
    },
    {
      id: "65432",
      recipePhoto:
        "https://hips.hearstapps.com/del.h-cdn.co/assets/17/39/1600x1600/square-1506456157-delish-honey-garlic-glazed-salmon-1.jpg?resize=1200:*",
      recipeName: "Honey Garlic Salmon",
      recipeTag: "Seafood",
    },
    {
      id: "54321",
      recipePhoto:
        "https://i0.wp.com/seonkyounglongest.com/wp-content/uploads/2020/02/Egg-Fried-Rice-2.jpg?fit=1300%2C867&ssl=1",
      recipeName: "Egg Fried Rice",
      recipeTag: "Asian",
    },
    {
      id: "43210",
      recipePhoto:
        "https://www.whiskaffair.com/wp-content/uploads/2021/02/Mediterranean-Chickpea-Quinoa-Salad-2-3.jpg",
      recipeName: "Quinoa Salad",
      recipeTag: "Healthy",
    },
    {
      id: "32109",
      recipePhoto:
        "https://joyfoodsunshine.com/wp-content/uploads/2022/03/chicken-fajitas-recipe-square.jpg",
      recipeName: "Chicken Fajitas",
      recipeTag: "Mexican",
    },
    {
      id: "21098",
      recipePhoto:
        "https://www.eatingwell.com/thmb/lAEwtQROBY8pEVjuip5Q-eSfQ3U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1501p130-spinach-feta-stuffed-chicken-breasts-8030825-66b09a00be4340c6a6af32fda656319c.jpg",
      recipeName: "Spinach and Feta Stuffed Chicken",
      recipeTag: "Healthy",
    },
    {
      id: "10987",
      recipePhoto:
        "",
      recipeName: "Penne alla Vodka",
      recipeTag: "Italian",
    },
    {
      id: "09876",
      recipePhoto:
        "",
      recipeName: "Thai Green Curry",
      recipeTag: "Asian",
    },
    {
      id: "98760",
      recipePhoto:
        "",
      recipeName: "Avocado Toast",
      recipeTag: "Healthy",
    },
  ];
  

const ingredients = [
    {ing_name: 'Salt', ing_stock: false},
    {ing_name: 'Chicken', ing_stock: true},
    {ing_name: 'Tortilla', ing_stock: true},
    {ing_name: 'Pepper', ing_stock: false}
]

app.listen(process.env.PORT || 3000)

app.get('/', (req, res) => {
    if(req.session.loggedIn == false){
        res.redirect('/app')
    } else {
        res.render('index')
    }
});

app.get('/login', (req, res) => {
    res.render('login', {error: ""});
});

app.get('/register', (req, res) => {
    // res.render('register', {
    //     error: "",
    // });
    res.render('app', {recipes: recipes});
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