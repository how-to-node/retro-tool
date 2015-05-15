// todo: When he have persistance, populate this pool
var retros = {};

// posible status of a retro
var retroStatus = ['adding-items', 'voting', 'adding-actions-to-take', 'closed'];

/**
 * @constructor Retro
 */
function Retro(name, ownerUsername, participants) {

    this.name = name;
    this.owner = ownerUsername;
    this.participants = participants || [];
    this.status = retroStatus[0];

    // the owner is a participant of the retro
    this.participants.push(ownerUsername);

    this.items = {
        positives: [],
        negatives: []
    };
}

/**
 * Determines if the retro is in one of these: adding-items, voting, adding-actions-to-take
 */
Retro.prototype.isActive = function() {
    return retroStatus.indexOf(this.status) < 3;
};

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

        return true;
    },

    /**
     * Determines if a retro y active
     */
    isActiveRetro: function(name) {
        var retro = retros[name];
        return !!retro && retro.isActive();
    },

    /**
     * Determines if indicated user is the owner of the indicated retro
     */
    isRetroOwner: function(retroName, username) {
        var retro = retros[name];
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
     }

};
