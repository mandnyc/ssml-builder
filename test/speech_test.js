var assert = require('chai').assert;
var Speech = require('../index');

describe('Speech', function () {

    var speech = null;

    describe('basics', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should generate a saying tag2', function () {
            speech.say("star");
            assert.equal(speech.ssml(), "<speak>star</speak>");
        });

        it('should generate a saying tag', function () {
            speech.say("hi");
            assert.equal(speech.ssml(), "<speak>hi</speak>");
        });

        it('should build a paragraph tag', function () {
            speech.paragraph("hi");
            assert.equal(speech.ssml(), "<speak><p>hi</p></speak>");
        });

        it('should build a sentence tag', function () {
            speech.sentence("hi");
            assert.equal(speech.ssml(), "<speak><s>hi</s></speak>");
        });

        it('should build a pause tag for 1 second', function () {
            speech.pause("1s");
            assert.equal(speech.ssml(), "<speak><break time='1s'/></speak>");
        });

        it('should build a pause tag for 100 milliseconds', function () {
            speech.pause("100ms");
            assert.equal(speech.ssml(), "<speak><break time='100ms'/></speak>");
        });

        it('should build a audio tag', function () {
            speech.audio("http://www.audio.com/sound.mp3");
            assert.equal(speech.ssml(), "<speak><audio src='http://www.audio.com/sound.mp3'/></speak>");
        });

        it('should build a spell tag', function () {
            speech.spell("mandy");
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='spell-out'>mandy</say-as></speak>");
        });

    });

    describe('sayAs', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should build a sayAs interpret as spell-out', function () {
            speech.sayAs({
                "word": "mandy",
                "interpretParams": "spell-out"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='spell-out'>mandy</say-as></speak>");
        });

        it('should build a sayAs interpret as cardinal number', function () {
            speech.sayAs({
                "word": "five",
                "interpretParams": "number"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='number'>five</say-as></speak>");
        });

        it('should build a sayAs interpret as ordinal number', function () {
            speech.sayAs({
                "word": "1",
                "interpretParams": "ordinal"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='ordinal'>1</say-as></speak>");
        });

        it('should build a sayAs interpret as digits', function () {
            speech.sayAs({
                "word": "123",
                "interpretParams": "digits"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='digits'>123</say-as></speak>");
        });

        it('should build a sayAs interpret as fraction', function () {
            speech.sayAs({
                "word": "2/9",
                "interpretParams": "fraction"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='fraction'>2/9</say-as></speak>");
        });

        it('should build a sayAs interpret as unit', function () {
            speech.sayAs({
                "word": "2N",
                "interpretParams": "unit"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='unit'>2N</say-as></speak>");
        });
        

    });

    describe('compound examples', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should generate a speech tag with a paragraph tag', function () {
            speech.say("Hello");
            speech.paragraph("Mandy");
            assert.equal(speech.ssml(), "<speak>Hello <p>Mandy</p></speak>");
        });

        it('should generate a speech speak tag, paragraph tag', function () {
            speech.say("How");
            speech.paragraph("are");
            speech.say("you");
            assert.equal(speech.ssml(), "<speak>How <p>are</p> you</speak>");
        });

    });

    describe('to object', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should generate a speech tag with a paragraph tag', function () {
            speech.say("Hello");
            speech.paragraph("Mandy");
            assert.deepEqual(speech.toObject(), {type: 'SSML', speech: "<speak>Hello <p>Mandy</p></speak>"});
        });

    });

    describe('input validation', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should expect a missing argument for saying', function () {
            assert.throws(function () {
                speech.say(null);
            }, "The saying provided to Speech#saying(..) was null or undefined.");
        });

        it('should expect a missing argument for paragraph', function () {
            assert.throws(function () {
                speech.paragraph(null);
            }, "The paragraph provided to Speech#paragraph(..) was null or undefined.");
        });

        it('should expect a missing argument for sentence', function () {
            assert.throws(function () {
                speech.sentence(null);
            }, "The sentence provided to Speech#sentence(..) was null or undefined.");
        });

        it('should expect a missing argument for pause', function () {
            assert.throws(function () {
                speech.pause(null);
            }, "The duration provided to Speech#pause(..) was null or undefined.");
        });

        it('should expect an exception for exceeding the duration', function () {
            assert.throws(function () {
                speech.pause("11s");
            }, "The pause duration exceeds the allowed 10 second duration. Duration provided: 11");
        });

        it('should expect an exception for exceeding the duration', function () {
            assert.throws(function () {
                speech.pause("10001ms");
            }, "The pause duration exceeds the allowed 10,000 milliseconds duration. Duration provided: 10001");
        });

        it('should expect a missing argument for audio', function () {
            assert.throws(function () {
                speech.audio(null);
            }, "The url provided to Speech#audio(..) was null or undefined.");
        });

        it('should expect a missing argument for spell', function () {
            assert.throws(function () {
                speech.spell(null);
            }, "The word provided to Speech#spell(..) was null or undefined.");
        });

    });

});