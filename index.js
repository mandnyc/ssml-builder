'use strict';

/**
 * This class helps simplify using SSML (Speech Synthesis Markup Language).
 * This only supports a subset of SSML tags which the Alexa device supports.
 * An example of how to use this class.
 * <code>
 *  var speech = new Speech();
 *  speech.say("Let's begin your lesson");
 *  speech.pause("1s");
 *
 * </code>
 * Implement a method for <phoneme/>, <w/>, <say-as> All done
 * interpret-as="cardinal|ordinal|digits|fraction|unit|date|time|telephone|address" + format="mdy|dmy|ymd|md|dm|ym|my|d|m|y" All done
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
    this._elements.push(this._escape(saying));
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
    this._elements.push("<p>" + this._escape(paragraph) + "</p>");
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
    this._elements.push("<s>" + this._escape(saying) + "</s>");
    return this;
};

/**
 * Creates and inserts a break tag. This method will also validate the break time conforms to the restrictions to Amazon Alexa.
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

/**
 * Creates and inserts an audio tag.
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#audio
 * @param url
 * @returns {Speech}
 */
Speech.prototype.audio = function (url) {
    this._present(url, "The url provided to Speech#audio(..) was null or undefined.");
    this._elements.push("<audio src='" + url + "'/>");
    return this;
};

/**
 * Creates and inserts a say-as tag.
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
 * @param word word or text to insert
 * @returns {Speech}
 */
Speech.prototype.spell = function (word) {
    this._present(word, "The word provided to Speech#spell(..) was null or undefined.");
    this._elements.push("<say-as interpret-as='spell-out'>" + this._escape(word) + "</say-as>");
    return this;
};

/**
 * Creates and inserts a say-as tag.
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
 * @param word word or text to insert , delay the delay represented by a number + either 's' for second or 'ms' for milliseconds.
 * @returns {Speech}
 */
Speech.prototype.spellSlowly = function (word, delay) {
    this._present(word, "The word provided to Speech#spellSlowly(..) was null or undefined.");
    for (var i = 0; i < word.length; i++) {
        this._elements.push("<say-as interpret-as='spell-out'>" + this._escape(word.charAt(i)) + "</say-as>");
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
Speech.prototype.ssml = function (excludeSpeakTag) {
    if (excludeSpeakTag) {
        return this._elements.join(" ");
    }
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

/**
 * Creates and inserts a say-as tag that has multiple attributes such as interpret-as and format
 * interpret-as="cardinal|ordinal|digits|fraction|unit|date|time|telephone|address" + format="mdy|dmy|ymd|md|dm|ym|my|d|m|y"
 *
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
 * @param options an object that has three properties: word, interpret and format
 * word being the text to insert, interpret represents the attribute interpret-as and format represents the attribute format
 * @returns {Speech}
 */
Speech.prototype.sayAs = function (options) {
    this._present(options, "The object provided to Speech#sayAs(..) was invalid.");
    this._present(options.word, "The word provided to Speech#sayAs(..) was null or undefined.");
    if (options.interpret) {
        if (options.format) {
            this._elements.push("<say-as interpret-as=\'" + options.interpret + "\'" + " format=\'" + options.format + "'>" + options.word + "</say-as>");
            return this;
        }
        this._elements.push("<say-as interpret-as=\'" + options.interpret + "'>" + options.word + "</say-as>");
        return this;
    } else {
        this._elements.push(options.word);
        return this;
    }
};

/**
 * Creates and inserts a w tag that customizes the pronunciation of words by specifying the word’s part of speech
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#w
 * @param options an object that has two properties: word and role
 * word being the text to insert and role represents the part of speech
 * @returns {Speech}
 */
Speech.prototype.partOfSpeech = function (options) {
    this._present(options, "The object provided to Speech#partOfSpeech(..) was invalid.");
    this._present(options.word, "The word provided to Speech#partOfSpeech(..) was null or undefined.");
    var word = this._escape(options.word);
    if (options.role) {
        this._elements.push("<w role=\'" + options.role + "'>" + word + "</w>")
    }
};

/**
 * Creates and inserts a phoneme tag.
 * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#phoneme
 * @param alphabet, ph, word
 * alphabet i.e "ipa"
 * ph i.e "pɪˈkɑːn"
 * word being the text to insert
 * @returns {Speech}
 */
Speech.prototype.phoneme = function (alphabet, ph, word) {
    this._present(alphabet, "The alphabet provided to Speech#phoneme(..) was null or undefined.");
    this._present(ph, "The ph provided to Speech#phoneme(..) was null or undefined.");
    this._present(word, "The word provided to Speech#phoneme(..) was null or undefined.");
    var escapedWord = this._escape(word);
    if (ph.indexOf("'") !== -1) {
        ph = ph.replace(/'/g, '&apos;')
    }
    this._elements.push("<phoneme alphabet=\'" + alphabet + "\'" + " ph=\'" + ph + "'>" + escapedWord + "</phoneme>");
};

/**
 * This method escapes any special characters that will cause SSML to be invalid.
 * @param word being the text to insert
 * @returns {*}
 * @private
 */
Speech.prototype._escape = function (word) {
        if (typeof(word) === "string") {
            word = word.replace(/&/g, 'and');
            word = word.replace(/</g, '');
            word = word.replace(/>/g, '');
            word = word.replace(/"/g, '');
            word = word.replace(/'/g, '');
            return word;
        }
        if (typeof(word) === "number") {
            return word;
        }
        if (typeof(word) === "boolean") {
            return word;
        }
        throw new Error('received invalid type ' + typeof(word));
};

module.exports = Speech;
