const db = require('../data/dbConfig')

module.exports = {
    get,
    add,
}

function get() {
    return db('users')
}

function add(user) {
    return db('users')
    .insert(user)
}