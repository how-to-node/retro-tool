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

Retro.prototype.nextStatus = function(who) {
    var currentIndex = retroStatus.indexOf(this.status);
    if (currentIndex > -1 && (currentIndex + 1) < retroStatus.length && who === this.owner) {
        this.status = retroStatus[currentIndex + 1];
    }
};

Retro.prototype.prevStatus = function(who) {
    var currentIndex = retroStatus.indexOf(this.status);
    if (currentIndex > -1 && (currentIndex - 1) >= 0 && who === this.owner) {
        this.status = retroStatus[currentIndex - 1];
    }
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

Retro.prototype.removeItem = function(itemId, who) {
    return removeIfFound(this.items.positives, itemId) || removeIfFound(this.items.negatives, itemId);

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

Retro.prototype.addVoter = function(who, itemId) {
    var item = this.findItem(itemId);
    console.log(item, who);
    if (item && item.author !== who && item.votes.indexOf(who) === -1) {
        item.votes.push(who);
        return item.votes;
    }
    return null;
};

Retro.prototype.removeVoter = function(who, itemId) {
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

Retro.prototype.findItem = function(itemId) {
    var item = find(this.items.positives, itemId);

    if (!item) {
        item = find(this.items.negatives, itemId);
    }

    return item || null;

    function find(items, itemId) {
        var item = _.find(items, function(item) {
            return item.id === itemId;
        });

        return item || null;
    };
};

module.exports = Retro;
