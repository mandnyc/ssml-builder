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
   * amazon:effect
   * audio
   * break
   * emphasis
   * prosody
   * p
   * s
   * phoneme
   * speak
   * say-as which supports all of the known interpret-as values and formats. For more information, see [Amazon Documentation here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) 
      * characters
      * spell-out
      * cardinal
      * number
      * ordinal
      * digits
      * fraction
      * unit
      * date
      * time
      * telephone
      * address
      * interjection
      * expletive
  * sub
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
speech.say('Hello')
      .pause('1s')
      .say('fellow Alexa developers')
      .pause('500ms')
      .say('Testing phone numbers')
      .sayAs({
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
speech.say('Hello')
      .pause('1s')
      .say('fellow Alexa developers');
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
## Amazon SSML specific tags
When using Amazon specific tags, like whisper, you will need to import and use the AmazonSpeech object directly.

```javascript
var AmazonSpeech = require('ssml-builder/amazon_speech');

var speech = new AmazonSpeech();
speech.say('Hello')
      .pause('1s')
      .whisper('I can see you when you are sleeping')
      .pause('500ms')
      .say('Is your phone number still')
      .sayAs({
              word: "+1-377-777-1888",
              interpret: "telephone"
            });
var ssml = speech.ssml();
```

## Tag Examples

#### [amazon:effect](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#amazon-effect)
```javascript
speech.whisper('I can see you when you are sleeping');
```

#### [audio](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#audio) 
```javascript
speech.audio('https://carfu.com/audio/carfu-welcome.mp3');
```

#### [break](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#break)
```javascript
speech.pause('500ms')
      .say('you hear this after a 500 millisecond pause')
      .pause('2s')
      .say('you heard this after a 2 second pause');
```

#### [emphasis](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#emphasis)
```javascript
speech.emphasis('strong', 'phrase will be strong');
speech.emphasis('moderate', 'phrase will be moderate');
speech.emphasis('reduced', 'phrase will be reduced');
```

#### [prosody](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#prosody)
```javascript
speech.prosody({rate: 'slow'}, 'say slow');
speech.prosody({rate: 'fast'}, 'say fast');
speech.prosody({rate: '120%'}, 'increase the rate of speech by 20%');
speech.prosody({rate: '35%'}, 'decrease the rate of speech by 35%');
speech.prosody({pitch: 'medium'}, 'set pitch to medium');
speech.prosody({pitch: 'x-high'}, 'set pitch to extra high');
speech.prosody({pitch: '+20%'}, 'increase the pitch by 20%');
speech.prosody({pitch: '-10%'}, 'decrease the pitch by 10%');
speech.prosody({volume: 'soft'}, 'set volume to soft');
speech.prosody({volume: 'loud'}, 'set volume to loud');
speech.prosody({volume: '+2db'}, 'increase volume by 2db');
speech.prosody({volume: '-3db'}, 'decrease volume by 3db');
```

#### [p](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#p)
```javascript
speech.paragraph('phrase will be said with extra strong breaks before and after itself');
```

#### [s](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#s)
```javascript
speech.sentence('phrase will be said with strong breaks before and after itself');
```

#### [phoneme](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#phoneme)
```javascript
speech.phoneme('ipa', "pɪˈkɑːn", 'pecan');
speech.phoneme('x-sampa', "fr\oU.z@n", 'frozen');
```

#### [speak](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#speak)
```javascript
speech.say('this will be said');
```

#### [say-as](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#say-as)
```javascript
speech.sayAs({word: '12345', interpret: 'digits'});
speech.sayAs({word: 'usa', interpret: 'characters'});
speech.sayAs({word: '5553329939', interpret: 'telephone'});
```

#### [sub](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#sub)
```javascript
speech.sub('magnesium', 'Mg');
```

#### [w](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#w)
```javascript
speech.partOfSpeech({word: 'record', role: 'amazon:VB'});
speech.partOfSpeech({word: 'record', role: 'amazon:NN'});
```