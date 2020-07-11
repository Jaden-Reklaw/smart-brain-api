const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

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
    const {email, password} = req.body;

    db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(error => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(error => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
    const{ email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    //Create a transaction using knex
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => {
        //don't return the error so hackers can 
        //find out what went wrong on your db
        res.status(400).json('unable to register');
    })       
});


// Put routes
app.put('/image/:id', (req, res) => {
    const { id } = req.params;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
       res.json(entries[0]);
   })
   .catch(error => res.status(400).json('unable to get entries'));
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
