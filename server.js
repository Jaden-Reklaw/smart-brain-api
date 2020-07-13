const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//Add controllers to endpoints
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');

//Connect to the pg database using knex
const db= knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'jswalk117',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//Get routes
app.get('/', (req, res) => {
    
});

app.get('/profile/:id',(req, res) =>  profile.handleProfile(req, res, db));

//Post routes
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));

//Using dependency injection
app.post('/register',(req, res) => register.handleRegister(req, res, db, bcrypt));


// Put routes
app.put('/image/:id', (req, res) => image.handleImage(req, res, db));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
