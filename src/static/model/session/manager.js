// Modules
var randtoken = require('rand-token'),
    usersManager = require('../users/manager');

var sessions = {};

module.exports = {
    /**
     * If username and password match, add the session to the storage and saves user info.
     * @param {string} username
     * @param {string} password
     * @return {string | null} - userKey. null if credentials don't match
     */
    login: function login(username, password) {
        var user = usersManager.getUserData(username),
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

    /**
     * Removes user key from the storage
     * @param {string} key
     */
    logout: function logout(key) {
        delete sessions[key];
    },

    /**
     * Retrieves user data.
     * @param {string} key
     * @return {object} user
     */
    getUser: function getUser(key) {
        var user = sessions[key];

        return user || null;
    },

    /**
     * Retrieves logged user data.
     * @param {object} session
     * @return {object} user
     */
    getLoggedUser: function(session) {
        if (session && session.userKey) {
            return this.getUser(session.userKey) || null;
        } else {
            return null;
        }
    }
};
