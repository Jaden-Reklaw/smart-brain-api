const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

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


const database = {
    users: [
        {
            id: '127',
            name: 'Kelsey',
            email: 'kel@aol.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Jordan',
            email: 'Jor@aol.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        },
    ],
    login: [
       {
           id:'987',
           hash: '',
           email:'kel@aol.com'
       } 
    ]
}

//Get routes
app.get('/', (req, res) => {
    res.send(database.users);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    console.log('id is', id);

    db.select('*').from('users').where({id})
    .then(user => {
        //Need to do the if and else statement to not get
        //an error on the promise
        if(user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('not found');
        }
    }).catch(error => {
        res.status(400).json('error getting user');
    })

});

//Post routes
app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const{ email, name, password } = req.body;
    db('users').returning('*').insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0]);
    }).catch(error => {
        //don't return the error so hackers can 
        //find out what went wrong on your db
        res.status(400).json('unable to register');
    })   
    
});


// Put routes
app.put('/image/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if(!found) {
        res.status(404).json('no such user');
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

/*
    --> res = this is working
    signin --> POST = success/fail
    register --> POST = user
    profile/:userId --> GET = user
    image --> PUT --> user
*/