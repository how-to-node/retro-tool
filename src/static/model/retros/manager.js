// modules require
var util = require('util'),
    Retro = require('./retro');

// todo: When he have persistance, populate this pool
var retros = {};

module.exports = {
    /**
     * Creates a new active retro.
     */
    createRetro: function(name, owner, participants) {
        if (retros[name]) {
            return false;
        }

        var retro = new Retro(name, owner, participants);
        retros[name] = retro;

        console.log('INFO - New Retro created: ', util.inspect(retro));

        return true;
    },

    /**
     * Determines if a retro is active
     */
    isActiveRetro: function(name) {
        var retro = retros[name];
        return !!retro && retro.isActive();
    },

    /**
     * Determines if indicated user is the owner of the indicated retro
     */
    isRetroOwner: function(retroName, username) {
        var retro = retros[retroName];
        return !!retro && retro.owner === username;
    },

    /**
     * Determines if name is already taken for a retro
     */
     existsRetroName: function(name) {
         return !!retros[name];
     },

     /**
      * Determines if the user has access to the retro
      */
     hasAccess: function(retroName, username) {
         var retro = retros[retroName];

         if (!retro) {
             return false;
         }

         return retro.participants.indexOf(username) > -1;
     },

     getRetro: function(retroName) {
         return retros[retroName] || null;
     }

};
