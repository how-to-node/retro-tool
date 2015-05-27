// modules require
var util = require('util'),
    events = require("events");

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

    events.EventEmitter.apply(this);

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

util.inherits(Retro, events.EventEmitter);

/**
 * Determines if the retro is in one of these: adding-items, voting, adding-actions-to-take
 */
Retro.prototype.isActive = function() {
    return retroStatus.indexOf(this.status) < 3;
};

Retro.prototype.addItem = function(description, sign, author) {
    if (this.participants.indexOf(author) === -1) {
        console.error('INFO - Guest ' + author + ' is not a participant of ' + this.name);
        return;
    } else if(!description || !sign || !author) {
        console.error('INFO - Missing data');
        return;
    }

    var newItem = {
        author: author,
        description: description,
        sign: sign
    };

    if (sign === ITEM_SIGN.POSITIVE) {
        this.items.positives.push(newItem);
    } else if(sign === ITEM_SIGN.NEGATIVE) {
        this.items.negatives.push(newItem);
    } else {
        console.error('INFO - Sign ' + sign + ' does not exist.');
        return;
    }

    this.emit('item:added', newItem);
}

module.exports = Retro;
