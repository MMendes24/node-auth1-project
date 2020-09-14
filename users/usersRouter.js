const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const session = require('express-session');

const Users = require('./usersModel');

router.get('/users', protected, (req, res) => {
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

router.post('/login', (req, res) => {
    const creds = req.body;
    const valid = validateCredentials(creds);

    if (valid) {
        Users.getBy({ username: creds.username })
            .then(([user]) => {
                if (user && bcryptjs.compareSync(creds.password, user.password)) {
                    req.session.username = user.username;
                    req.session.userId = user.id

                    res.status(200).json({
                        message: `welcome ${creds.username}`, mvpCookie: req.session.userId
                    });
                } else {
                    res.status(401).json({ message: "You shall not pass!" });
                }
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
    } else {
        res.status(400).json({
            message: "Invalid information.",
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

function protected(req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: 'You shall not pass!' });
    }
  }

module.exports = router