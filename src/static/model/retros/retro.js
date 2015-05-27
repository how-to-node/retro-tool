// modules require
var util = require('util');

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
    this.participants = typeof participants === 'array' ? participants : [participants];
    this.status = retroStatus[0];

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

Retro.prototype.addItem = function(description, sign, author) {
    // validations
    if (this.participants.indexOf(author) === -1) {
        console.error('ERROR - Guest %s is not a participant of %s', author, this.name);
        return false;
    } else if (!description || !sign || !author) {
        console.error('ERROR - Missing data');
        return false;
    }

    var newItem = {
        author: author,
        description: description,
        sign: sign
    };

    // sign validations
    if (sign === ITEM_SIGN.POSITIVE) {
        this.items.positives.push(newItem);
    } else if(sign === ITEM_SIGN.NEGATIVE) {
        this.items.negatives.push(newItem);
    } else {
        console.error('ERROR - Sign %s does not exist', sign);
        return false;
    }

    return true;
}

module.exports = Retro;
