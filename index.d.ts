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
declare class Speech {
  constructor()
  /**
   * This appends raw text into the <speak/> tag.
   * @param saying The raw text to insert into the speak tag.
   * @returns {Speech}
   */
  say(saying: string): Speech
  /**
   * Creates and inserts a paragraph tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#p
   * @param paragraph The paragraph of text to insert.
   * @returns {Speech}
   */
  paragraph(paragraph: string): Speech
  /**
   * Creates and inserts a sentence tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#s
   * @param saying The sentence to insert.
   * @returns {Speech}
   */
  sentence(saying: string): Speech
  /**
   * Creates and inserts a break tag. This method will also validate the break time conforms to the restrictions to Amazon Alexa.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#break
   * @param duration the duration represented by a number + either 's' for second or 'ms' for milliseconds.
   * @returns {Speech}
   */
  pause(duration: string): Speech
  /**
   * Creates a break tag that will pause the audio based upon the strength provided.
   * For more information, please see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#break
   * @param strength such as none, x-weak, weak, medium, strong, x-strong
   * @returns {Speech}
   */
  pauseByStrength(strength: string): Speech
  /**
   * Creates and inserts an audio tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#audio
   * @param url a link to an audio file to play.
   * @param callback - an optional callback which is called to build the nested SSML
   *                   for the audio tag. The callback takes a single parameter of type
   *                   Speech.
   * @returns {Speech}
   */
  audio(url: string, callback?: Speech): Speech
  /**
   * Creates and inserts a say-as tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
   * @param word word or text to insert
   * @returns {Speech}
   */
  spell(word: string): Speech
  /**
   * Creates and inserts a say-as tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
   * @param word word or text to insert
   * @param delay the delay represented by a number + either 's' for second or 'ms' for milliseconds.
   * @returns {Speech}
   */
  spellSlowly(word: string, delay: string): Speech
  /**
   * This constructs an object that the AlexaSkill.js accepts to send to the user.
   * @returns {{type: string, speech}}
   */
  toObject(): AlexaObject
  /**
   * This method will construct an SSML xml string.
   * @param excludeSpeakTag when true, no root tag <speak/> is provided; otherwise,
   *        the content is surrounded by the <speak/>, default is false
   * @returns {string} An XML string.
   */
  ssml(excludeSpeakTag: boolean): string
  /**
   * Creates and inserts a say-as tag that has multiple attributes such as interpret-as and format
   * interpret-as="characters|spell-out|cardinal|number|ordinal|digits|fraction|unit|date|time|telephone|address|interjection|expletive" + format="mdy|dmy|ymd|md|dm|ym|my|d|m|y"
   *
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
   * @param options an object that has three properties: word, interpret and format
   * word being the text to insert, interpret represents the attribute interpret-as and format represents the attribute format
   * @returns {Speech}
   */
  sayAs(options: SayAsOptions): Speech
  /**
   * Creates and inserts a w tag that customizes the pronunciation of words by specifying the word’s part of speech
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#w
   * @param options an object that has two properties: word and role
   * word being the text to insert and role represents the part of speech
   * @returns {Speech}
   */
  partOfSpeech(options: Options): Speech
  /**
   * Creates and inserts a phoneme tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#phoneme
   * @param alphabet, ph, word
   * alphabet i.e "ipa"
   * ph i.e "pɪˈkɑːn"
   * word being the text to insert
   * @returns {Speech}
   */
  phoneme(alphabet: string, ph: string, word: string): Speech
  /**
   * Creates and inserts a emphasis tag.
   * see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#emphasis
   * @param level includes strong, moderate and reduced
   * @param word word or text to insert
   * @returns {Speech}
   */
  emphasis(level: EmphasisLevels, word: string): Speech
  /**
   * √ TODO: Handle rate minimum 20%
   * @param attributes
   * @param word
   * @returns {Speech}
   */
  prosody(attributes: ProsodyAttributes, word: string): Speech
  /**
   * This method lets the user provide an alias and pronounce the specified word or pharse as a different word or phrase
   * @param alias is the word that you want to pronounce instead of the original word
   * @param word
   * @returns {Speech}
   */
  sub(alias: string, word: string): Speech
  /**
   * This method lets the user add raw SSML into the speech object without escaping the special characters.
   * For example, if you passed in "<speak>Hi</speak>", it won't escape the less than or greater than tags.
   * @param saying raw string to be appended
   * @returns {Speech}
   */
  sayWithSSML(saying: string): Speech
  /**
   * This method will select a random word or phrase from the choices provided and then say it to the user
   * @param choices - an array of phrases or words
   * @returns {Speech}
   */
  sayRandomChoice(choices: Array<string>): Speech
  /**
   * Validates that the provided value is not null or undefined. It will throw an exception if it's either.
   * @param value The value to check.
   * @param msg The error message stating that exception.
   * @private
   */
  private _present(value, msg): void
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
  private _validateDuration(duration): void
  /**
   * This method escapes any special characters that will cause SSML to be invalid.
   * @param word being the text to insert
   * @returns {*}
   * @private
   */
  private _escape(word): void
  /**
   * This method ensures the input passing in is not null, undefined or empty string. In the case that it is, an exception is thrown with the message provided.
   * @param word
   * @param msg
   * @private
   */
  private _notEmpty(word, msg): void
  /**
   * Ensures 'fnc' is a function.
   * @param fnc the variable to check if it's a function.
   * @param name the name of the parameter used in the error message.
   * @private
   */
  private _isFunction(fnc, name): void
  private _clean(speech): void
}
export default Speech
/**
 * This helper function consolidates the validation checks for rate,pitch and volume. It will first
 * check to see if the attribute is present and whether it's one of the following conditions:
 *  a) the value of the attribute is a valid value or
 *  b) the value does not exist in the list, but passes the onCheck function. A hook for additional checks.
 *
 *  Upon passing the above checks, the onSuccessful function is called allowing the caller to do any additional work.
 *
 * @param obj The object that owns the attribute.
 * @param attribute The attribute name to check. e.g., rate, pitch or volume.
 * @param validList The list of value values that the attribute can be.
 * @param onCheck A hook for additional checks if the value does not exist in the list.
 * @param onSuccessful A hook to call when all validation checks succeed.
 */
declare function validateAttribute(obj, attribute, validList, onCheck, onSuccessful): void
/**
 * This method ensures that the value of the rate must be equal or great than 20%
 * @param num is the value of rate
 */
declare function checkRateRange(num): void
/**
 * This method validates if the value exists in the list of values
 * @param value
 * @param listOfValues
 * @param msg is the error message that will be thrown when the value is not in the list
 */
declare function isInList(value, listOfValues, msg): void

interface AlexaObject {
  type: 'SSML',
  speech: string,
}

interface Options {
  word: string,
  role?: string,
}

interface SayAsOptions {
  word: string,
  interpret?: string,
  format?: string,
}

declare enum EmphasisLevels {
  'strong',
  'moderate',
  'reduced',
}

declare enum Rates {
  'x-slow',
  'slow',
  'medium',
  'fast',
  'x-fast',
}

declare enum Pitches {
  'x-low',
  'low',
  'medium',
  'high',
  'x-high',
}

declare enum Volumes {
  'silent',
  'x-soft',
  'soft',
  'medium',
  'loud',
  'x-loud'
}

interface ProsodyAttributes {
  rate: Rates,
  pitch: Pitches,
  volume: Volumes,
}