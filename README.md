# ssml-builder

This package creates Speech Synthesis Markup Language (SSML) using the builder pattern.
It is fully unit-tested to ensure the best quality. 
It works with both the new and old Alexa SDKs. See the code examples below.

## Installation
```sh
npm install ssml-builder --save
```
## Features
* Works with both the new and old Alexa SDKs.
* Handles special characters to ensure the SSML is well-formated.
* This library supports the following SSML tags
   * audio
   * break
   * p
   * s
   * phoneme
   * speak
   * say-as which supports all of the known interpt-as values and formats. For more information, see [Amazon Documentation here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) 
      * cardinal
      * ordinal
      * digits
      * fraction
      * unit
      * date
      * time
      * telephone
      * address
  * w
      * ivona:VB: Interpret the word as a verb (present simple).
      * ivona:VBD: Interpret the word as a past participle.
      * ivona:NN: Interpret the word as a noun.
      * ivona:SENSE_1: for more information, see [Amazon Documentation here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#w)  
  

## Code Example for the new Alexa SDK
#### see link to the new Alexa SDK https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
```javascript
var Speech = require('ssml-builder');

var speech = new Speech();
speech.say('Hello');
speech.pause('1s');
speech.say('fellow Alexa developers');
var speechOutput = speech.ssml(true);
this.emit(':tell', speechOutput);
```

## The above code will produce the following SSML
> Note: In this example, the SSML is not surrounded by &lt;speak/&gt; because we passed 'true' into the ssml(boolean) method. This is intentional to work with the new SDK due to their current design.
```xml
  Hello <break time='1s'/> fellow Alexa developers
```

## Code Example for the old Alexa SDK
```javascript
var Speech = require('ssml-builder');

var speech = new Speech();
speech.say('Hello');
speech.pause('1s');
speech.say('fellow Alexa developers');
var speechOutput = speech.toObject();
response.tell(speechOutput);
```

## The above code will produce the following object
```json
  { 
    "type": "SSML",
    "speech": "<speak>Hello <break time='1s'/> fellow Alexa developers</speak>"
  }
```
