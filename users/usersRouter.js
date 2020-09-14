const router = require('express').Router();
const bcryptjs = require("bcryptjs");

const Users = require('./usersModel');

router.get('/users', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err.message);

            res.status(500).json({ message: err.message });
        });
})

router.post('/register', (req, res) => {
    const user = req.body
    const valid = validateUser(user)

    if (valid) {
        const hash = bcryptjs.hashSync(user.password, 8);
        user.password = hash

        Users.add(user)
            .then(thenRes => {
                res.status(201).json({ data: thenRes });
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
    } else {
        res.status(400).json({
            message: "Invalid information, plese verify and try again",
        });
    }
})

function validateUser(user) {
    // has username, password and role
    return user.username && user.password ? true : false;
}

function validateCredentials(creds) {
    // has username, password and role
    return creds.username && creds.password ? true : false;
}

module.exports = router