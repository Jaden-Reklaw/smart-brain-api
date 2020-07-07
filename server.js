const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
}
//Get routes
app.get('/', (req, res) => {
    res.send(database.users);
});

//Post routes
app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const{ email, name, password } = req.body;
    database.users.push({
        id: '124',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length -1]);
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