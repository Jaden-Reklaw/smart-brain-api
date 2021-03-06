const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//Add controllers to endpoints
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//Connect to the pg database using knex
const db= knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    }
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//Get routes
app.get('/', (req, res) => res.send('hello world'));

//Using dependency injection you can pass bcrypt and db to the routes
app.get('/profile/:id',(req, res) =>  profile.handleProfile(req, res, db));

//Post routes
//another way of doing it by passing req and res on the function in the module
//checkout signin.js to see how the function is structured
//both ways work just do which ever is less confusing
app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/register',(req, res) => register.handleRegister(req, res, db, bcrypt));

//POST for API request to Clarifai
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

// Put routes
app.put('/image/:id', (req, res) => image.handleImage(req, res, db));

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
