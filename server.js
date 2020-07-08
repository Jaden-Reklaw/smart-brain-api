const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
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

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            res.json(user);
        }
    });

    if(!found) {
        res.status(404).json('no such user');
    }
})

//Post routes
app.post('/signin', (req, res) => {
    //comparing correct password against the hash that is generated
    bcrypt.compare("apples", '$2a$10$Qcp6O0WRRLaOM00Qj7530OSrxx4eRzZ1taMkNi4twAJXo51hkP8AW', function(err, res) {
        // res == true
        console.log('first guess', res);
    });
    //comparing wrong password against the hash that is generated
    bcrypt.compare("veggies", '$2a$10$Qcp6O0WRRLaOM00Qj7530OSrxx4eRzZ1taMkNi4twAJXo51hkP8AW', function(err, res) {
        // res = false
        console.log('second guess', res);
    });
    console.log(req.body);
    if(req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const{ email, name, password } = req.body;
    //Creating hash after a post request of a new registered user
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length -1]);
});

// Put routes
app.put('/image/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            res.json(user.entries);
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