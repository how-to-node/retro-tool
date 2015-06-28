// modules require
var util = require('util'),
    _ = require('lodash');

// items' signs
var ITEM_SIGN = {
    POSITIVE: 'positive',
    NEGATIVE: 'negative'
};

// posible status of a retro
var retroStatus = ['adding-items', 'voting', 'adding-actions-to-take', 'closed'];

/**
 * @constructor Retro
 */
function Retro(name, ownerUsername, participants) {
    this.name = name;
    this.owner = ownerUsername;
    this.participants = participants instanceof Array ? participants : [participants];
    this.status = retroStatus[0];

    this.$$itemsCount = 0;

    // the owner is a participant of the retro
    if (this.participants.indexOf(ownerUsername) === -1) {
        this.participants.push(ownerUsername);
    }

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

/**
 * Updates the status of the retro, to the next one
 * @param {string} who - user who is intending to update status - needs to be the owner
 */
Retro.prototype.nextStatus = function(who) {
    var currentIndex = retroStatus.indexOf(this.status);
    // if is a valid status AND next status is not the last one AND is the owner of the retro
    if (currentIndex > -1 && (currentIndex + 1) < retroStatus.length && who === this.owner) {
        this.status = retroStatus[currentIndex + 1];
    }
};

/**
 * Updates the status of the retro, to the previous one
 * @param {string} who - user who is intending to update status - needs to be the owner
 */
Retro.prototype.prevStatus = function(who) {
    var currentIndex = retroStatus.indexOf(this.status);
    // if is a valid status AND prev status is the first one or further AND is the owner
    if (currentIndex > -1 && (currentIndex - 1) >= 0 && who === this.owner) {
        this.status = retroStatus[currentIndex - 1];
    }
};

/**
 * Adds an item to the retro
 * @param {string} description
 * @param {string} sign - valid ITEM_SIGN
 * @param {string} author
 * @return {object | boolean} item if it was created, false if was not
 */
Retro.prototype.addItem = function(description, sign, author) {
    // status validation
    if (!this.isAddingItems()) {
        return false;
    }
    // parameters validations
    if (this.participants.indexOf(author) === -1) {
        console.error('ERROR - Guest %s is not a participant of %s', author, this.name);
        return false;
    } else if (!description || !sign || !author) {
        console.error('ERROR - Missing data');
        return false;
    }

    var newItem = {
        id: ++this.$$itemsCount,
        author: author,
        description: description,
        sign: sign,
        votes: []
    };

    // sign validations
    if (sign === ITEM_SIGN.POSITIVE) {
        this.items.positives.push(newItem);
    } else if (sign === ITEM_SIGN.NEGATIVE) {
        this.items.negatives.push(newItem);
    } else {
        console.error('ERROR - Sign %s does not exist', sign);
        return false;
    }

    return newItem;
}

/**
 * Removes an item from the list
 * @param {string} itemId
 * @param {string} who - needs to be the author of the item
 * @return {boolean} true if was successfuly removed
 */
Retro.prototype.removeItem = function(itemId, who) {
    // status validation
    if (!this.isAddingItems()) {
        return false;
    }

    return removeIfFound(this.items.positives, itemId) || removeIfFound(this.items.negatives, itemId);

    /**
     * Helper function to remove item if is found.
     * Don't move from current scope
     * @param {array} itemsArray
     * @param {string} itemId
     * @return {boolean} true if was found and removed
     */
    function removeIfFound(itemsArray, itemId) {
        var item = _.find(itemsArray, function(item) {
            return item.id === itemId;
        });

        if (item && item.author === who) {
            itemsArray.splice(itemsArray.indexOf(item), 1);
            return true;
        }

        return false;
    }
};

/**
 * Adds a voter to the item
 * @param {string} who - new voter
 * @param {string} itemId - voted item
 * @return {array} new votes list
 */
Retro.prototype.addVoter = function(who, itemId) {
    // status validation
    if (!this.isVoting()) {
        return false;
    }

    var item = this.findItem(itemId);
    console.log(item, who);
    if (item && item.author !== who && item.votes.indexOf(who) === -1) {
        item.votes.push(who);
        return item.votes;
    }
    return null;
};

/**
 * Removes a voter from the item
 * @param {string} who
 * @param {string} itemId - unvoted item
 * @return {array} new votes list
 */
Retro.prototype.removeVoter = function(who, itemId) {
    // status validation
    if (!this.isVoting()) {
        return null;
    }

    var item = this.findItem(itemId),
        index;

    if (item) {
        index = item.votes.indexOf(who);
        if (index > -1) {
            item.votes.splice(index, 1);
            return item.votes;
        }
    }

    return null;
};

/**
 * Find an item
 * @param {string} itemId
 * @return {object} item
 */
Retro.prototype.findItem = function(itemId) {
    var item = find(this.items.positives, itemId);

    if (!item) {
        item = find(this.items.negatives, itemId);
    }

    return item || null;

    /**
     * Helper function
     */
    function find(items, itemId) {
        var item = _.find(items, function(item) {
            return item.id === itemId;
        });

        return item || null;
    };
};

/**
 * Status check for ADDING ITEMS
 * @return {boolean} true if is ADDING ITEMS
 */
Retro.prototype.isAddingItems = function() {
    return this.status === retroStatus[0];
};

/**
 * Status check for VOTING
 * @return {boolean} true if is VOTING
 */
Retro.prototype.isVoting = function() {
    return this.status === retroStatus[1];
};

module.exports = Retro;
