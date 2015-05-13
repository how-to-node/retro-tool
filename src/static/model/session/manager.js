// @todo: replace by module
var usersManager = require('./users_mock.json');

// Modules
var randtoken = require('rand-token');

var sessions = {};

module.exports = {
    login: function login(username, password) {
        var user = usersManager[username],
            newKey;

        if (!user || user.password !== password) {
            return null;
        }

        do {
            newKey = randtoken.generate(10);
        } while (sessions[newKey]);

        sessions[newKey] = user;

        return newKey;
    },
    logout: function logout(key) {
        delete sessions[key];
    },
    getUser: function getUser(key) {
        var user = sessions[key];

        return user || null;
    }
};
