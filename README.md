# ssml-builder
This package creates Speech Synthesis Markup Language (SSML) using the builder pattern.


Tired of creating SSML using string concatenation or worring about special characters like '&amp;' ? This project aims to eliminate all these headaches by providing a clean and easy to use API. In addition to making SSML easier to create, this library is fully unit-tested to ensure things work as expected.

Whether you're building an Amazon Alexa Skill using the older version of the JavaScript SDK or the new one, this library is compatible. See the examples in the lower portion of this documentation.

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
   * say-as which supports all of the known interpret-as values and formats. For more information, see [Amazon Documentation here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) 
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
speech.pause('500ms');
speech.say('Testing phone numbers');
speech.sayAs({
              word: "+1-377-777-1888",
              interpret: "telephone"
            });
var speechOutput = speech.ssml(true);
this.emit(':tell', speechOutput);
```

## The above code will produce the following SSML
> Note: In this example, the SSML is not surrounded by &lt;speak/&gt; because we passed 'true' into the ssml(boolean) method. This is intentional to work with the new SDK due to their current design.
```xml
  'Hello <break time='1s'/> fellow Alexa developers <break time='500ms'/> Testing phone numbers <say-as interpret-as='telephone'>+1-377-777-1888</say-as>'
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
