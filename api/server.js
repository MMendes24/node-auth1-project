const express = require('express')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/usersRouter')
const connection = require('../data/dbConfig');

const server = express()

server.use(express.json());

const sessionConfig = {
    name: "marschip",
    secret: "Malachor V",
    resave: false,
    userId: null,
    saveUninitialized: true, // ask the client if it's ok to save cookies (GDPR compliance)
    cookie: {
        maxAge: 1000 * 60 * 60, // in milliseconds
        secure: false, // true means use only over https connections
        httpOnly: true, // true means the JS code on the clients CANNOT access this cookie
    },
    store: new KnexSessionStore({
        knex: connection, // knex connection to the database
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60, // remove expired sessions every hour
    }),
}

server.use(session(sessionConfig)); //  <<< turn un sessions, adds a req.session object

server.use('/api', usersRouter);



module.exports = server;