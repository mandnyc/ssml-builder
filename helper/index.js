'use strict';

/**
 * This helper class has a bunch of utility methods
 * @constructor
 */
function Helper() {
}

/**
 * This method will give you a random word or phrase
 * @param words - an array of words or phrases
 * @returns {*} a random word or phrase
 */
Helper.prototype.chooseRandomWord = function (words) {
    if (!Array.isArray(words)) {
        throw new Error('The words must be an array');
    }
    var index = this.random(words.length);
    return words[index];
};

/**
 * This method will give you a random index that is between 0 to max-1.
 * @param max is the max number that the result will never equal to or exceed.
 * @returns {number}
 */
Helper.prototype.random = function (max) {
    return Math.floor(Math.random() * max);
};

module.exports = Helper;
