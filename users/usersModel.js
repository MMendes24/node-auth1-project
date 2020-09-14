const db = require('../data/dbConfig')

module.exports = {
    get,
}

function get() {
    return db('users')
}