var users = require('./users_mock.json');

module.exports = {
    /**
     * Retrieves user data.
     * @param {string} username
     * @return {object | null}
     */
    getUserData: function getUserData(username) {
        return users[username] || null;
    },

    /**
     * Retrieves all usernames
     * @return {array}
     */
    getAllUsernames: function() {
        return Object.keys(users);
    }
};
