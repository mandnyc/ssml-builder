'use strict';

/**
 * This class helps simplify using SSML (Speech Synthesis Markup Language).
 * This only supports a subset of SSML tags which the Alexa device supports.
 * An example of how to use this class.
 * <code>
 *  var speech = new Speech();
 *  speech.say("Let's begin your lesson");
 *  speech.pause("1s");
 *  speech.say("How do you say " + word);
 *
 *  response.tell(speech.toObject(), ...);
 * </code>
 * TODO: Implement a method for <phoneme/>, <w/>,
 * TODO: interpret-as="cardinal|ordinal|digits|fraction|unit|date|time|telephone|address" + format="mdy|dmy|ymd|md|dm|ym|my|d|m|y"
 * @constructor
 */
function Speech() {
    this._elements = [];
}

/**
 * This appends raw text into the <speak/> tag.
 * @param saying The raw text to insert into the speak tag.
 * @returns {Speech}
 */
Speech.prototype.say = function (saying) {
    this._present(saying, "The saying provided to Speech#saying(..) was null or undefined.");
    this._elements.push(saying);
    return this;
};

/**
 * Creates and inserts a paragraph tag.
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#p
 * @param paragraph The paragraph of text to insert.
 * @returns {Speech}
 */
Speech.prototype.paragraph = function (paragraph) {
    this._present(paragraph, "The paragraph provided to Speech#paragraph(..) was null or undefined.");
    this._elements.push("<p>" + paragraph + "</p>");
    return this;
};

/**
 * Creates and inserts a sentence tag.
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#s
 * @param saying The sentence to insert.
 * @returns {Speech}
 */
Speech.prototype.sentence = function (saying) {
    this._present(saying, "The sentence provided to Speech#sentence(..) was null or undefined.");
    this._elements.push("<s>" + saying + "</s>");
    return this;
};

/**
 * Creates and inserts a break tag. This method will also validate the break time conforms to the restrictions
 * to Amazon Alexa.
 *
 * TODO: Accept 'strength'
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#break
 * @param duration the duration represented by a number + either 's' for second or 'ms' for milliseconds.
 * @returns {Speech}
 */
Speech.prototype.pause = function (duration) {
    this._present(duration, "The duration provided to Speech#pause(..) was null or undefined.");
    this._validateDuration(duration);
    this._elements.push("<break time='" + duration + "'/>");
    return this;
};

// <audio src="{url}"/>
Speech.prototype.audio = function (url) {
    this._present(url, "The url provided to Speech#audio(..) was null or undefined.");
    this._elements.push("<audio src='" + url + "'/>");
    return this;
};

// <say-as interpret-as="spell-out">{word}</say-as>
Speech.prototype.spell = function (word) {
    this._present(word, "The word provided to Speech#spell(..) was null or undefined.");
    this._elements.push("<say-as interpret-as='spell-out'>" + word + "</say-as>");
    return this;
};

Speech.prototype.spellSlowly = function (word, delay) {
    this._present(word, "The word provided to Speech#spell(..) was null or undefined.");
    for (var i = 0; i < word.length; i++) {
        this._elements.push("<say-as interpret-as='spell-out'>" + word.charAt(i) + "</say-as>");
        this.pause(delay);
    }
    return this;
};

/**
 * This constructs an object that the AlexaSkill.js accepts to send to the user.
 * @returns {{type: string, speech}}
 */
Speech.prototype.toObject = function () {
    return {
        type: 'SSML',
        speech: this.ssml()
    }
};

/**
 * This method will construct an SSML xml string.
 * @returns {string} An XML string.
 */
Speech.prototype.ssml = function () {
    return "<speak>" + this._elements.join(" ") + "</speak>";
};

/**
 * Validates that the provided value is not null or undefined. It will throw an exception if it's either.
 * @param value The value to check.
 * @param msg The error message stating that exception.
 * @private
 */
Speech.prototype._present = function (value, msg) {
    if (value === null || value === undefined) {
        throw msg;
    }
};

/**
 * This validates that a duration is in the correct format and doesn't exceed the
 * maximum duration of 10 seconds or 10000 milliseconds.
 *
 * The expected format is a positive number followed by 's' for second or 'ms' for milliseconds.
 *
 * @param duration The duration of a pause.
 * @throws an exception when the duration doesn't conform to the proper format or duration length.
 * @private
 */
Speech.prototype._validateDuration = function (duration) {
    var re = /^(\d+)(s|ms)$/;
    if (duration.match(re)) {
        var parts = re.exec(duration);
        var pauseDuration = parts[1];
        var pauseType = parts[2];
        if (pauseType.toLowerCase() === 's' && pauseDuration > 10) {
            throw "The pause duration exceeds the allowed 10 second duration. Duration provided: " + duration;
        } else if (pauseDuration > 10000) {
            throw "The pause duration exceeds the allowed 10,000 milliseconds duration. Duration provided: " + duration;
        }
    } else {
        throw "The duration must be a number followed by either 's' for second or 'ms' for milliseconds. e.g., 10s or 100ms. Max duration is 10 seconds (10000 milliseconds)."
    }
};

Speech.prototype.sayAs = function (options) {
    this._present(options.word, "The word provided to Speech#spell(..) was null or undefined.");
    if (options.interpretParams) {
        if(options.format){
            this._elements.push("<say-as interpret-as=\'" + options.interpretParams + "\'" + " format=\'" + options.format + "'>"+ options.word + "</say-as>");
            return this;
        }
        this._elements.push("<say-as interpret-as=\'" + options.interpretParams + "'>" + options.word + "</say-as>");
        return this;
    } else {
        this._elements.push(options.word);
        return this;
    }
};

module.exports = Speech;
