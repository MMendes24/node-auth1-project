const router = require('express').Router();

const Users = require('./usersModel');

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err.message);

            res.status(500).json({ message: err.message });
        });
})

module.exports = router