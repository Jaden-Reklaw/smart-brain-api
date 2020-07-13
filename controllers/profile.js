const handleProfile= (req, res, db) => {
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
}

module.exports = {
    handleProfile: handleProfile
}