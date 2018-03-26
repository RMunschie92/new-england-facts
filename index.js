const Alexa = require('alexa-sdk');
const SKILL_NAME = "New England Facts";
const WELCOME_MESSAGE = "Welcome to New England Facts.";
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = "  You can say tell me a fact,  tell me a fact about a certain state in New England, for example,  tell me a fact about Vermont,   or  you can say exit...";
const HELP_REPROMPT = "What can I help you with";
const STOP_MESSAGE = "Thanks for dropping by.";
const PROMPT = "   Would you like to hear another fact?";
const REPROMPT = "Say yes to hear another fact or say no to exit.";
const INVALID_SLOT = "Please enter a valid state name.";
const data = require('./data.js');
const goodbyes = require('./goodbyes.js');
const slotName = "State";

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
  'LaunchRequest': function () {
    const speechOutput = WELCOME_MESSAGE + HELP_MESSAGE;
    this.response.speak(speechOutput)
      .listen(HELP_MESSAGE);
    this.emit(':responseReady');
  },
  'GetFactIntent': function () {
    const factArr = data.facts;
    const isValid = true;
    const intent = this.event.request.intent;
    const state = intent.slots.State.value;

    let speechOutput = '';
    console.log('slots are -->');
    console.log(state);

    // test for slot value and set sub-array index to fetch data from accordingly
    if (state !== undefined && state !== null) {
      if (state === "Connecticut") {
        factArrIndex = 1;
      }
      else if (state === "Maine") {
        factArrIndex = 2;
      }
      else if (state === "Massachusetts" || state === "mass") {
        factArrIndex = 3;
      }
      else if (state === "New Hampshire") {
        factArrIndex = 4;
      }
      else if (state === "Rhode Island") {
        factArrIndex = 5;
      }
      else if (state === "Vermont") {
        factArrIndex = 6;
      }
      else {
        factArrIndex = 10;
      }
    }
    else {
      factArrIndex = Math.floor(Math.random() * factArr.length);
    }

    console.log(factArrIndex);

    const subArr = factArr[factArrIndex];

    if (factArrIndex === 10) {
      speechOutput = "Please state a valid New England state name."
    } else {
        const factIndex = Math.floor(Math.random() * subArr.length);
        const randomFact = subArr[factIndex];
        speechOutput = GET_FACT_MESSAGE + randomFact + PROMPT;
    }
    this.response.cardRenderer(SKILL_NAME, speechOutput);
    this.response.speak(speechOutput)
      .listen(REPROMPT);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    const byeArr = goodbyes.byes;
    const byeIndex = Math.floor(Math.random() * byeArr.length);
    const randomBye = byeArr[byeIndex];
    this.response.speak(STOP_MESSAGE + randomBye);
    this.emit(':responseReady');
  },
  'AMAZON.YesIntent': function () {
    const factArr = data.facts;
    const factArrIndex = Math.floor(Math.random() * factArr.length);
    const subArr = factArr[factArrIndex];
    const factIndex = Math.floor(Math.random() * subArr.length);
    const randomFact = subArr[factIndex];
    const speechOutput = randomFact + PROMPT;

    this.response.cardRenderer(SKILL_NAME, speechOutput);
    this.response.speak(speechOutput)
      .listen(REPROMPT);
    this.emit(':responseReady');
  },
  'AMAZON.NoIntent': function () {
    this.emit('AMAZON.StopIntent');
  },
  'Unhandled': function () {
    this.emit('AMAZON.HelpIntent');
  },
};

function isSlotValid(request, slotName){
        var slot = request.intent.slots.slotName;
        console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value;
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

function generateFact() {
  const factArr = data.facts;
  const factArrIndex = Math.floor(Math.random() * factArr.length);
  const subArr = factArr[factArrIndex];
  const factIndex = Math.floor(Math.random() * subArr.length);
  const randomFact = subArr[factIndex];
  const speechOutput = GET_FACT_MESSAGE + randomFact + PROMPT;
  return speechOutput;
}
