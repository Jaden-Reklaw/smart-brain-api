const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('this server is working');
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