"use strict";

var assert = require('chai').assert;
var AmazonSpeech = require("../amazon_speech.js");

describe('AmazonSpeech', function () {

    describe('wispher', function () {

        var amazon_speech = null;

        describe('positive', function () {

            beforeEach(function () {
                amazon_speech = new AmazonSpeech();
            });

            it('should create the tag', function () {
                amazon_speech.whisper("good night and sweet dreams");
                assert.equal(amazon_speech.ssml(), "<speak><amazon:effect name=\"whispered\">good night and sweet dreams</amazon:effect></speak>")
            });

            it('should create the tag with special characters', function () {
                amazon_speech.whisper("good night & sweet dreams");
                assert.equal(amazon_speech.ssml(), "<speak><amazon:effect name=\"whispered\">good night &amp; sweet dreams</amazon:effect></speak>")
            });
        });

        describe('negative', function () {

            beforeEach(function () {
                amazon_speech = new AmazonSpeech();
            });

            it('should expect a missing argument for whisper ', function () {
                assert.throws(function () {
                    amazon_speech.whisper();
                }, "The words provided to AmazonSpeech#whisper(..) was 'undefined'");
            });

            it('should throw an exception because of a null input for whisper ', function () {
                assert.throws(function () {
                    amazon_speech.whisper(null);
                }, "The words provided to AmazonSpeech#whisper(..) was 'null'");
            });

            it('should throw an exception because of an empty string input for whisper ', function () {
                assert.throws(function () {
                    amazon_speech.whisper("");
                }, "The words provided to AmazonSpeech#whisper(..) was ''");
            });
        })
    });

});


// var speech = new AmazonSpeech();
// speech.whisper("good night and sweet dreams").pause("1ms");
// console.log(speech.ssml());
