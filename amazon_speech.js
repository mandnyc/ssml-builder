"use strict";

var Speech = require("./index.js");
var AmazonSpeech = function () {
    this._elements = [];
};

AmazonSpeech.prototype = Object.create(Speech.prototype);

AmazonSpeech.prototype.whisper = function (words, shouldEscape=true) {
    this._notEmpty(words,"The words provided to AmazonSpeech#whisper(..) was '" + words + "'");
    var escapedWords = shouldEscape ? this._escape(words) : words
    this._elements.push("<amazon:effect name=\"whispered\">" + escapedWords + "</amazon:effect>");
    return this;
};

module.exports = AmazonSpeech;
