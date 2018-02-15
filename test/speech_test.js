'use strict';

var assert = require('chai').assert;
var Speech = require('../index');

describe('Speech', function () {

    var speech = null;

    describe('basics', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        describe('say', function () {

            it('should generate a saying tag2', function () {
                speech.say("star");
                assert.equal(speech.ssml(), "<speak>star</speak>");
            });

            it('say should escape characters', function () {
                speech.say("<star's>");
                assert.equal(speech.ssml(), "<speak>&lt;star&apos;s&gt;</speak>");
            });

            it('say should escape characters', function () {
                speech.say('<star"s>');
                assert.equal(speech.ssml(), "<speak>&lt;star&quot;s&gt;</speak>");
            });

            it('should generate a saying tag', function () {
                speech.say("hi");
                assert.equal(speech.ssml(), "<speak>hi</speak>");
            });

        });

        describe('paragraph', function () {

            it('should build a paragraph tag', function () {
                speech.paragraph("hi");
                assert.equal(speech.ssml(), "<speak><p>hi</p></speak>");
            });

            it('paragraph should escape characters', function () {
                speech.paragraph("<h'i>");
                assert.equal(speech.ssml(), "<speak><p>&lt;h&apos;i&gt;</p></speak>");
            });

        });

        describe('sentence', function () {

            it('should build a sentence tag', function () {
                speech.sentence("hi");
                assert.equal(speech.ssml(), "<speak><s>hi</s></speak>");
            });

            it('should build a sentence tag escape characters', function () {
                speech.sentence("<h'i>");
                assert.equal(speech.ssml(), "<speak><s>&lt;h&apos;i&gt;</s></speak>");
            });

        });

        describe('pause', function () {

            it('should build a pause tag for 1 second', function () {
                speech.pause("1s");
                assert.equal(speech.ssml(), "<speak><break time='1s'/></speak>");
            });

            it('should build a pause tag for 100 milliseconds', function () {
                speech.pause("100ms");
                assert.equal(speech.ssml(), "<speak><break time='100ms'/></speak>");
            });

            it('should build a pause tag for 0.5 seconds', function () {
                speech.pause("0.5s");
                assert.equal(speech.ssml(), "<speak><break time='0.5s'/></speak>");
            });

            it('should build a pause tag for .5 seconds', function () {
                speech.pause(".5s");
                assert.equal(speech.ssml(), "<speak><break time='.5s'/></speak>");
            });

        });

        describe('pauseByStrength', function () {

            describe('positive', function () {

                it('should generate the tag with valid strength', function () {
                    speech.pauseByStrength("x-weak");
                    assert.equal(speech.ssml(), "<speak><break strength='x-weak'/></speak>");
                });

                it('should generate the tag with valid strength case sensitive', function () {
                    speech.pauseByStrength("X-WEAK");
                    assert.equal(speech.ssml(), "<speak><break strength='x-weak'/></speak>");
                });

                it('should generate the tag with valid strength case sensitive and extra space', function () {
                    speech.pauseByStrength("X-WEAK  ");
                    assert.equal(speech.ssml(), "<speak><break strength='x-weak'/></speak>");
                });
            });

            describe('negative', function () {

                it('should throw an exception because of invalid strength', function () {
                    assert.throws(function () {
                        speech.pauseByStrength('banana');
                    }, "The strength provided to Speech#pauseByStrength(..) was not valid. Received strength: banana");
                });

                it('should throw an exception because of missing strength', function () {
                    assert.throws(function () {
                        speech.pauseByStrength(null);
                    }, "The strength provided to Speech#pauseByStrength(..) was null or undefined");
                });

            });
        });

        describe('audio', function () {

            describe('positive', function () {
                it('should build a audio tag', function () {
                    speech.audio("http://www.audio.com/sound.mp3");
                    assert.equal(speech.ssml(), "<speak><audio src='http://www.audio.com/sound.mp3'/></speak>");
                });

                it('should build a audio tag with nested SSML', function () {
                    speech.audio("http://www.audio.com/sound.mp3", function (builder) {
                        builder.say("wow");
                    });
                    assert.equal(speech.ssml(), "<speak><audio src='http://www.audio.com/sound.mp3'>wow</audio></speak>");
                });
            });

            describe('negative', function () {
                it('should throw an error for a string callback', function () {
                    assert.throws(function () {
                        speech.audio("http://www.audio.com/sound.mp3", "callback");
                    }, "callback was not a function. received: string");
                });
            });

        });

        describe('spell', function () {

            it('should build a spell tag', function () {
                speech.spell("mandy");
                assert.equal(speech.ssml(), "<speak><say-as interpret-as='spell-out'>mandy</say-as></speak>");
            });

            it('spell should escape characters', function () {
                speech.spell("<mandy's>");
                assert.equal(speech.ssml(), "<speak><say-as interpret-as='spell-out'>&lt;mandy&apos;s&gt;</say-as></speak>");
            });

        });

        describe('sayWithSSML', function () {

            describe('positive', function () {
                it('should push the raw ssml string into the speech object', function () {
                    speech.sayWithSSML('we should all <w role="amazon:VB">read</w> more');
                    assert.equal(speech.ssml(), '<speak>we should all <w role="amazon:VB">read</w> more</speak>');
                });
            });

            describe('negative', function () {
                it('should throw an error for missing saying', function () {
                    assert.throws(function () {
                        speech.sayWithSSML();
                    }, "The saying provided to Speech#sayWithSSML(..) was null or undefined.");
                });
            });

        });

        describe('spellSlowly', function () {

            it('should build a spell slowly tag', function () {
                speech.spellSlowly("mandy", "500ms");
                assert.equal(speech.ssml(), "<speak><say-as interpret-as='spell-out'>m</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>a</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>n</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>d</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>y</say-as> <break time='500ms'/></speak>");
            });

            it('spell slowly should escape characters', function () {
                speech.spellSlowly("<mandy's>", "500ms");
                assert.equal(speech.ssml(), "<speak><say-as interpret-as='spell-out'>&lt;</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>m</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>a</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>n</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>d</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>y</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>&apos;</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>s</say-as> <break time='500ms'/> <say-as interpret-as='spell-out'>&gt;</say-as> <break time='500ms'/></speak>");
            });

        });

    });

    describe('sayAs', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should build a sayAs interpret as cardinal number', function () {
            speech.sayAs({
                "word": "five",
                "interpret": "cardinal"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='cardinal'>five</say-as></speak>");
        });

        it('should build a sayAs interpret as ordinal number', function () {
            speech.sayAs({
                "word": "1",
                "interpret": "ordinal"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='ordinal'>1</say-as></speak>");
        });

        it('should build a sayAs interpret as digits', function () {
            speech.sayAs({
                "word": "123",
                "interpret": "digits"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='digits'>123</say-as></speak>");
        });

        it('should build a sayAs interpret as fraction', function () {
            speech.sayAs({
                "word": "2/9",
                "interpret": "fraction"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='fraction'>2/9</say-as></speak>");
        });

        it('should build a sayAs interpret as fraction', function () {
            speech.sayAs({
                "word": "3+1/2",
                "interpret": "fraction"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='fraction'>3+1/2</say-as></speak>");
        });

        it('should build a sayAs interpret as unit', function () {
            speech.sayAs({
                "word": "2N",
                "interpret": "unit"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='unit'>2N</say-as></speak>");
        });

        it('should build a sayAs interpret as telephone with extension', function () {
            speech.sayAs({
                "word": "+1-800-555-234 ex. 23",
                "interpret": "telephone"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='telephone'>+1-800-555-234 ex. 23</say-as></speak>");
        });

        it('should build a sayAs interpret as telephone', function () {
            speech.sayAs({
                "word": "*53#",
                "interpret": "telephone"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='telephone'>*53#</say-as></speak>");
        });

        /**
         * Alexa does not support format 39
         **/
        it('should build a sayAs interpret as telephone and format 39', function () {
            speech.sayAs({
                "word": "+39(011)777-7777",
                "interpret": "telephone",
                "format": "39"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='telephone' format='39'>+39(011)777-7777</say-as></speak>");
        });

        /**
         * Alexa does not support format 39
         **/
        it('should build a sayAs interpret as telephone and format 39', function () {
            speech.sayAs({
                "word": "+1-800-EXAMPLE",
                "interpret": "telephone",
                "format": "39"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='telephone' format='39'>+1-800-EXAMPLE</say-as></speak>");
        });

        it('should build a sayAs interpret as address', function () {
            speech.sayAs({
                "word": "320 W Mt Willson Ct",
                "interpret": "address"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='address'>320 W Mt Willson Ct</say-as></speak>");
        });

        it('should build a sayAs interpret as address', function () {
            speech.sayAs({
                "word": "rm. 103",
                "interpret": "address"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='address'>rm. 103</say-as></speak>");
        });

        it('should build a sayAs interpret as address', function () {
            speech.sayAs({
                "word": "Ft Worth, TX 12345",
                "interpret": "address"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='address'>Ft Worth, TX 12345</say-as></speak>");
        });

        /**
         * Alexa does not support format us-state
         **/
        it('should build a sayAs interpret as address and format us-state', function () {
            speech.sayAs({
                "word": "CO",
                "interpret": "address",
                "format": "us-state"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='address' format='us-state'>CO</say-as></speak>");
        });

        it('should throw an exception because of invalid interpret', function () {
            assert.throws(function () {
                speech.sayAs({
                    "word": "CO",
                    "interpret": "banana",
                    "format": "us-state"
                });
            }, "The interpret is invalid. Received this: banana");

        });

    });

    describe('date', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should build a sayAs interpret as date only yyyymmdd', function () {
            speech.sayAs({
                "word": "20070102",
                "interpret": "date"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date'>20070102</say-as></speak>");
        });

        it('should build a sayAs interpret as date only mmdd', function () {
            speech.sayAs({
                "word": "????0102",
                "interpret": "date"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date'>????0102</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format mdy', function () {
            speech.sayAs({
                "word": "01/02/2007",
                "interpret": "date",
                "format": "mdy"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='mdy'>01/02/2007</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format dmy', function () {
            speech.sayAs({
                "word": "01/02/2007",
                "interpret": "date",
                "format": "dmy"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='dmy'>01/02/2007</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format ymd', function () {
            speech.sayAs({
                "word": "2007/01/02",
                "interpret": "date",
                "format": "ymd"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='ymd'>2007/01/02</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format md', function () {
            speech.sayAs({
                "word": "01/02",
                "interpret": "date",
                "format": "md"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='md'>01/02</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format dm', function () {
            speech.sayAs({
                "word": "01/02",
                "interpret": "date",
                "format": "dm"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='dm'>01/02</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format ym', function () {
            speech.sayAs({
                "word": "2007/01",
                "interpret": "date",
                "format": "ym"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='ym'>2007/01</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format my', function () {
            speech.sayAs({
                "word": "01/2007",
                "interpret": "date",
                "format": "my"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='my'>01/2007</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format d', function () {
            speech.sayAs({
                "word": "1",
                "interpret": "date",
                "format": "d"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='d'>1</say-as></speak>");
        });

        it('should build a sayAs interpret as date and format y', function () {
            speech.sayAs({
                "word": "2007",
                "interpret": "date",
                "format": "y"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='date' format='y'>2007</say-as></speak>");
        });

    });

    describe('time', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should build a sayAs interpret as time', function () {
            speech.sayAs({
                "word": "2'10\"",
                "interpret": "time"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='time'>2'10\"</say-as></speak>");
        });

        /**
         * Alexa does not support 24 hours format
         */
        it('should build a sayAs interpret as time and format hms24', function () {
            speech.sayAs({
                "word": "19:21:30",
                "interpret": "time",
                "format": "hms24"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='time' format='hms24'>19:21:30</say-as></speak>");
        });

        /**
         * Alexa does not support 12 hours format
         */
        it('should build a sayAs interpret as time and format hms12', function () {
            speech.sayAs({
                "word": "09:21:15",
                "interpret": "time",
                "format": "hms12"
            });
            assert.equal(speech.ssml(), "<speak><say-as interpret-as='time' format='hms12'>09:21:15</say-as></speak>");
        });

    });

    describe('part of speech', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should build a w which has a role of ivona:VB', function () {
            speech.partOfSpeech({
                "word": "read",
                "role": "ivona:VB"
            });
            assert.equal(speech.ssml(), "<speak><w role='ivona:VB'>read</w></speak>");
        });

        it('should build a w which has a role of ivona:VBD', function () {
            speech.partOfSpeech({
                "word": "read",
                "role": "ivona:VBD"
            });
            assert.equal(speech.ssml(), "<speak><w role='ivona:VBD'>read</w></speak>");
        });

        it('should build a w which has a role of ivona:NN', function () {
            speech.partOfSpeech({
                "word": "conduct",
                "role": "ivona:NN"
            });
            assert.equal(speech.ssml(), "<speak><w role='ivona:NN'>conduct</w></speak>");
        });

        it('should build a w which has a role of ivona:SENSE_1', function () {
            speech.partOfSpeech({
                "word": "bass",
                "role": "ivona:SENSE_1"
            });
            assert.equal(speech.ssml(), "<speak><w role='ivona:SENSE_1'>bass</w></speak>");
        });

    });

    describe('phoneme', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should build a phoneme', function () {
            speech.phoneme("ipa", "pɪˈkɑːn", "pecan");
            assert.equal(speech.ssml(), "<speak><phoneme alphabet='ipa' ph='pɪˈkɑːn'>pecan</phoneme></speak>");
        });

        it('should build a phoneme', function () {
            speech.phoneme("ipa", "pi.kæn", "pecan");
            assert.equal(speech.ssml(), "<speak><phoneme alphabet='ipa' ph='pi.kæn'>pecan</phoneme></speak>");
        });

        it('should build a phoneme', function () {
            speech.phoneme("ipa", "pɪ'kɑːn", "pecan");
            assert.equal(speech.ssml(), "<speak><phoneme alphabet='ipa' ph='pɪ&apos;kɑːn'>pecan</phoneme></speak>");
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

        it('should expect an invalid object for sayAs', function () {
            assert.throws(function () {
                speech.sayAs(null);
            }, "The object provided to Speech#sayAs(..) was invalid.");
        });

        it('should expect a missing argument for sayAs', function () {
            assert.throws(function () {
                speech.sayAs({word: null});
            }, "The word provided to Speech#sayAs(..) was null or undefined.");
        });

        it('should expect an invalid object for partOfSpeech', function () {
            assert.throws(function () {
                speech.partOfSpeech(null);
            }, "The object provided to Speech#partOfSpeech(..) was invalid.");
        });

        it('should expect a missing argument for partOfSpeech', function () {
            assert.throws(function () {
                speech.partOfSpeech({word: null});
            }, "The word provided to Speech#partOfSpeech(..) was null or undefined.");
        });

        it('should expect a missing alphabet in phoneme', function () {
            var word = "pecan";
            var ph = "pɪˈkɑːn";
            assert.throws(function () {
                speech.phoneme(null, ph, word);
            }, "The alphabet provided to Speech#phoneme(..) was null or undefined.");
        });

        it('should expect a missing ph in phoneme', function () {
            var word = "pecan";
            var alphabet = "ipa";
            assert.throws(function () {
                speech.phoneme(alphabet, null, word);
            }, "The ph provided to Speech#phoneme(..) was null or undefined.");
        });

        it('should expect a missing word in phoneme', function () {
            var alphabet = "ipa";
            var ph = "pɪˈkɑːn";
            assert.throws(function () {
                speech.phoneme(alphabet, ph, null);
            }, "The word provided to Speech#phoneme(..) was null or undefined.");
        });

        it('should expect a missing word in spellSlowly', function () {
            var delay = "500ms";
            assert.throws(function () {
                speech.spellSlowly(null, delay);
            }, "The word provided to Speech#spellSlowly(..) was null or undefined.");
        });

        it('should expect a missing delay in spellSlowly', function () {
            var word = "mandy";
            assert.throws(function () {
                speech.spellSlowly(word, null)
            }, "The duration provided to Speech#pause(..) was null or undefined.");
        })

    });

    describe('ssml', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('ssml has speak tag', function () {
            speech.say("Hello");
            assert.equal(speech.ssml(true), "Hello");
        });

        it('ssml has no speak tag', function () {
            speech.say("Hello");
            assert.equal(speech.ssml(false), "<speak>Hello</speak>");
        });

        it('should escape all 5 characters', function () {
            speech.say("<Cat's> & <Dog's>");
            assert.equal(speech.ssml(false), "<speak>&lt;Cat&apos;s&gt; &amp; &lt;Dog&apos;s&gt;</speak>");
        });
    });

    describe('emphasis', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        describe('positive', function () {

            it('should generate the tag with the level and word', function () {
                speech.emphasis('strong', 'really like');
                assert.equal(speech.ssml(), "<speak><emphasis level='strong'>really like</emphasis></speak>");
            });

            it('should generate the tag with the level and word that include special characters', function () {
                speech.emphasis('strong', 'really like & hate');
                assert.equal(speech.ssml(), "<speak><emphasis level='strong'>really like &amp; hate</emphasis></speak>");
            });
        });

        describe('negative', function () {
            it('should expect a missing argument level', function () {
                assert.throws(function () {
                    speech.emphasis(null, 'really like');
                }, "The level provided to Speech#emphasis(..) was null or undefined");
            });

            it('should expect an undefined level', function () {
                assert.throws(function () {
                    speech.emphasis(undefined, 'really like');
                }, "The level provided to Speech#emphasis(..) was null or undefined");
            });

            it('should expect an invalid level', function () {
                assert.throws(function () {
                    speech.emphasis('hello', 'really like');
                }, "The level provided to Speech#emphasis(..) was not valid. Received level: hello");
            });


            it('should expect a missing argument word', function () {
                assert.throws(function () {
                    speech.emphasis('strong', null);
                }, "The word provided to Speech#emphasis(..) was null or undefined");
            });

            it('should expect an undefined word', function () {
                assert.throws(function () {
                    speech.emphasis('strong', undefined);
                }, "The word provided to Speech#emphasis(..) was null or undefined");
            });

            it('should expect an empty word', function () {
                assert.throws(function () {
                    speech.emphasis('strong', '');
                }, "The word provided to Speech#emphasis(..) was empty");
            });

        });
    });

    describe('prosody', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        describe('rate', function () {

            describe('positive', function () {

                it('should generate a prosody tag with the rate attribute and word', function () {
                    var validRates = ['x-slow', 'slow', 'medium', 'fast', 'x-fast'];
                    for (var i = 0; i < validRates.length; i++) {
                        speech.prosody({rate: validRates[i]}, 'really like');
                        assert.equal(speech.ssml(), "<speak><prosody rate='" + validRates[i] + "'>really like</prosody></speak>");
                        speech = new Speech();
                    }
                });


                it('should generate a prosody tag with the rate attribute and word that include special characters', function () {
                    var validRates = ['x-slow', 'slow', 'medium', 'fast', 'x-fast'];
                    for (var i = 0; i < validRates.length; i++) {
                        speech.prosody({rate: validRates[i]}, 'really like & hate');
                        assert.equal(speech.ssml(), "<speak><prosody rate='" + validRates[i] + "'>really like &amp; hate</prosody></speak>");
                        speech = new Speech();
                    }
                });

                it('should generate a prosody tag with the rate attribute case sensitive', function () {
                    speech.prosody({rate: 'x-SLOW'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody rate='x-slow'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the rate attribute case sensitive and extra space', function () {
                    speech.prosody({rate: 'x-SLOW  '}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody rate='x-slow'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the rate attribute being positive %', function () {
                    speech.prosody({rate: '+50%'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody rate='+50%'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the rate attribute', function () {
                    speech.prosody({rate: '40%'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody rate='40%'>really like</prosody></speak>");
                });

            });

            describe('negative', function () {

                it('should expect missing attributes', function () {
                    assert.throws(function () {
                        speech.prosody(null, 'really like');
                    }, "The attributes provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an undefined attributes', function () {
                    assert.throws(function () {
                        speech.prosody(undefined, 'really like');
                    }, "The attributes provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an invalid rate attribute', function () {
                    assert.throws(function () {
                        speech.prosody({rate: 'quick'}, 'really like');
                    }, "attributes.rate is not a valid rate");
                });

                it('should expect an invalid rate attribute with invalid %', function () {
                    assert.throws(function () {
                        speech.prosody({rate: ' d%'}, 'really like');
                    }, "attributes.rate is not a valid rate");
                });

                it('should expect an invalid rate attribute with negative % or any % less than 20', function () {
                    assert.throws(function () {
                        speech.prosody({rate: '-40%'}, 'really like');
                    }, "The minimum rate is twenty percentage. Received: -40");
                });

                // word
                it('should expect a missing argument word', function () {
                    assert.throws(function () {
                        speech.prosody({rate: 'x-slow'}, null);
                    }, "The word provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an undefined word', function () {
                    assert.throws(function () {
                        speech.prosody({rate: 'x-slow'}, undefined);
                    }, "The word provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an empty word', function () {
                    assert.throws(function () {
                        speech.prosody({rate: 'x-slow'}, '');
                    }, "The word provided to Speech#prosody(..) was empty");
                });

            });

        });

        describe('pitch', function () {

            describe('positive', function () {

                it('should generate a prosody tag with the pitch attribute and word', function () {
                    var validPitches = ['x-low', 'low', 'medium', 'high', 'x-high'];
                    for (var i = 0; i < validPitches.length; i++) {
                        speech.prosody({pitch: validPitches[i]}, 'really like');
                        assert.equal(speech.ssml(), "<speak><prosody pitch='" + validPitches[i] + "'>really like</prosody></speak>");
                        speech = new Speech();
                    }
                });

                it('should generate a prosody tag with the pitch attribute and word that include special characters', function () {
                    var validPitches = ['x-low', 'low', 'medium', 'high', 'x-high'];
                    for (var i = 0; i < validPitches.length; i++) {
                        speech.prosody({pitch: validPitches[i]}, 'really like & hate');
                        assert.equal(speech.ssml(), "<speak><prosody pitch='" + validPitches[i] + "'>really like &amp; hate</prosody></speak>");
                        speech = new Speech();
                    }
                });

                it('should generate a prosody tag with the pitch attribute and word case sensitive', function () {
                    speech.prosody({pitch: 'x-HIGH'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody pitch='x-high'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the pitch attribute and word case sensitive and extra space', function () {
                    speech.prosody({pitch: 'x-HIGH  '}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody pitch='x-high'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the pitch attribute positive %', function () {
                    speech.prosody({pitch: '+50%'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody pitch='+50%'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the pitch attribute negative %', function () {
                    speech.prosody({pitch: '-40%'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody pitch='-40%'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the pitch attribute negative and decimal %', function () {
                    speech.prosody({pitch: '-40.5%'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody pitch='-40.5%'>really like</prosody></speak>");
                });

            });

            describe('negative', function () {

                it('should expect missing attributes', function () {
                    assert.throws(function () {
                        speech.prosody(null, 'really like');
                    }, "The attributes provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an undefined attributes', function () {
                    assert.throws(function () {
                        speech.prosody(undefined, 'really like');
                    }, "The attributes provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an invalid attributes.pitch', function () {
                    assert.throws(function () {
                        speech.prosody({pitch: 'quick'}, 'really like');
                    }, "attributes.pitch is not a valid pitch");
                });

                it('should expect an invalid attributes.pitch with non number %', function () {
                    assert.throws(function () {
                        speech.prosody({pitch: ' d%'}, 'really like');
                    }, "attributes.pitch is not a valid pitch");
                });

                // word
                it('should expect a missing argument word', function () {
                    assert.throws(function () {
                        speech.prosody({pitch: 'x-low'}, null);
                    }, "The word provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an undefined word', function () {
                    assert.throws(function () {
                        speech.prosody({pitch: 'x-low'}, undefined);
                    }, "The word provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an empty word', function () {
                    assert.throws(function () {
                        speech.prosody({pitch: 'x-low'}, '');
                    }, "The word provided to Speech#prosody(..) was empty");
                });


            });

        });


        describe('volume', function () {

            describe('positive', function () {

                it('should generate a prosody tag with the volume attribute and word', function () {
                    var validVolumes = ['silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud'];
                    for (var i = 0; i < validVolumes.length; i++) {
                        speech.prosody({volume: validVolumes[i]}, 'really like');
                        assert.equal(speech.ssml(), "<speak><prosody volume='" + validVolumes[i] + "'>really like</prosody></speak>");
                        speech = new Speech();
                    }
                });

                it('should generate a prosody tag with the volume attribute and word that include special characters', function () {
                    var validVolumes = ['silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud'];
                    for (var i = 0; i < validVolumes.length; i++) {
                        speech.prosody({volume: validVolumes[i]}, 'really like & hate');
                        assert.equal(speech.ssml(), "<speak><prosody volume='" + validVolumes[i] + "'>really like &amp; hate</prosody></speak>");
                        speech = new Speech();
                    }
                });

                it('should generate a prosody tag with the volume attribute and word case sensitive', function () {
                    speech.prosody({volume: 'SILENT'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody volume='silent'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the volume attribute and word case sensitive and extra space', function () {
                    speech.prosody({volume: 'SILENT  '}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody volume='silent'>really like</prosody></speak>");
                });

                it('should generate a prosody tag with the volume attribute positive dB', function () {
                    speech.prosody({volume: '+6dB'}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody volume='+6dB'>really like</prosody></speak>");
                });

            });

            describe('negative', function () {

                it('should expect missing attributes', function () {
                    assert.throws(function () {
                        speech.prosody(null, 'really like');
                    }, "The attributes provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an undefined attributes', function () {
                    assert.throws(function () {
                        speech.prosody(undefined, 'really like');
                    }, "The attributes provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an invalid pitch attribute', function () {
                    assert.throws(function () {
                        speech.prosody({volume: 'quick'}, 'really like');
                    }, "attributes.volume is not a valid volume");
                });

                it('should expect an invalid pitch attribute with invalid %', function () {
                    assert.throws(function () {
                        speech.prosody({volume: ' d%'}, 'really like');
                    }, "attributes.volume is not a valid volume");
                });

                // word
                it('should expect a missing argument word', function () {
                    assert.throws(function () {
                        speech.prosody({volume: 'silent'}, null);
                    }, "The word provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an undefined word', function () {
                    assert.throws(function () {
                        speech.prosody({volume: 'silent'}, undefined);
                    }, "The word provided to Speech#prosody(..) was null or undefined");
                });

                it('should expect an empty word', function () {
                    assert.throws(function () {
                        speech.prosody({volume: 'silent'}, '');
                    }, "The word provided to Speech#prosody(..) was empty");
                });

            });
        });

        describe('combination of rate, pitch, volume', function () {

            describe('postive', function () {

                it('should generate a prosody tag with the rate and pitch attributes and word', function () {
                    speech.prosody({rate: "x-slow", pitch: "x-high"}, 'really like');
                    assert.equal(speech.ssml(), "<speak><prosody rate='x-slow' " + "pitch='x-high'>" + "really like</prosody></speak>");
                    speech = new Speech();
                });

                it('should generate a prosody tag with the rate and pitch attributes and word that include special characters', function () {
                    speech.prosody({rate: "x-slow", pitch: "x-high"}, 'really like & hate');
                    assert.equal(speech.ssml(), "<speak><prosody rate='x-slow' " + "pitch='x-high'>" + "really like &amp; hate</prosody></speak>");
                    speech = new Speech();
                });

                it('should generate a prosody tag with the rate and pitch attributes and word case sensitive', function () {
                    speech.prosody({rate: "x-SLOW", pitch: "x-HIGH"}, 'really like & hate');
                    assert.equal(speech.ssml(), "<speak><prosody rate='x-slow' " + "pitch='x-high'>" + "really like &amp; hate</prosody></speak>");
                    speech = new Speech();
                });

                it('should generate a prosody tag with the rate and pitch attributes and word case sensitive and extra space', function () {
                    speech.prosody({rate: "x-SLOW  ", pitch: "x-HIGH  "}, 'really like & hate');
                    assert.equal(speech.ssml(), "<speak><prosody rate='x-slow' " + "pitch='x-high'>" + "really like &amp; hate</prosody></speak>");
                    speech = new Speech();
                });

                it('should generate a prosody tag with the rate, pitch attributes with negative %, and volume attribute with positive dB', function () {
                    speech.prosody({rate: "30%", pitch: '-40.5%', volume: '+6dB'}, 'really like & hate');
                    assert.equal(speech.ssml(), "<speak><prosody rate='30%' " + "pitch='-40.5%' " + "volume='+6dB'>" + "really like &amp; hate</prosody></speak>");
                    speech = new Speech();
                });

            });

        });

    });

    describe('check rate range', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        it('should expect an exception when rate is less than 20 percentage', function () {
            assert.throws(function () {
                speech.prosody({rate: '10%'}, 'really like');
            }, "The minimum rate is twenty percentage");
        });

    });

    describe('sub', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        describe('positive', function () {

            it('should generate a sub tag', function () {
                speech.sub('magnesium', 'Mg');
                assert.equal(speech.ssml(), "<speak><sub alias='magnesium'>Mg</sub></speak>");
            });

            it('should generate a sub tag special characters', function () {
                speech.sub('magnesium', 'Mg &');
                assert.equal(speech.ssml(), "<speak><sub alias='magnesium'>Mg &amp;</sub></speak>");
            });
            it('should generate a sub tag special characters', function () {
                speech.sub('mine', "It's mine");
                assert.equal(speech.ssml(), "<speak><sub alias='mine'>It&apos;s mine</sub></speak>");
            });

        });

        describe('negative', function () {

            it('should throw an exception for missing alias', function () {
                assert.throws(function () {
                    speech.sub(null, 'Mg');
                }, "The alias provided to Speech#sub(..) was null or undefined");
            });

            it('should throw an exception for missing alias', function () {
                assert.throws(function () {
                    speech.sub('', 'Mg');
                }, "The alias provided to Speech#sub(..) was empty");
            });

            it('should throw an exception for missing alias', function () {
                assert.throws(function () {
                    speech.sub('magnesium', null);
                }, "The word provided to Speech#sub(..) was null or undefined");
            });

            it('should throw an exception for missing alias', function () {
                assert.throws(function () {
                    speech.sub('magnesium', '');
                }, "The word provided to Speech#sub(..) was empty");
            });

        });

    });

    describe('sayRandomChoice', function () {

        beforeEach(function () {
            speech = new Speech();
        });

        describe('positive', function () {

            it('should give you a random item', function () {
                var choices = ['apple', 'peach'];
                var results = [];
                for (var i = 0; i < 1000; i++) {
                    var speech = new Speech();
                    var choice = speech.sayRandomChoice(choices).ssml();
                    if (!results.includes(choice)) {
                        results.push(choice);
                    }
                }

                var count = results.length;
                assert.isTrue(count > 1, "expected to find more than one element but only got 1");
            });

            it('should give you a random item', function () {
                var choices = ['apple'];
                var results = [];
                for (var i = 0; i < 100; i++) {
                    var speech = new Speech();
                    var choice = speech.sayRandomChoice(choices).ssml();
                    if (!results.includes(choice)) {
                        results.push(choice);
                    }
                }

                var count = results.length;
                assert.isTrue(count === 1, "expected to find one element in the results, but got " + count);
            });

        });

        describe('negative', function () {

            it('should fail when a string is provided instead of an array', function () {
                assert.throws(function () {
                    speech.sayRandomChoice('apple');
                }, 'The words must be an array');
            });

            it('should fail when an object is provided instead of an array', function () {
                assert.throws(function () {
                    speech.sayRandomChoice(new Speech());
                }, 'The words must be an array');
            });
        });

    });

});
