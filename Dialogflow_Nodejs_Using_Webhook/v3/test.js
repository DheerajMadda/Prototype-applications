const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var flag = false;
var requestString = {
    "connect" : ["connect to my project", "connect to my project server", "connect to my project database"],
    "disconnect" : ["disconnect to my project", "disconnect to my project server", "disconnect to my project database"],
    "temperature" : ["what's the status of temperature", "what is the status of temperature", "give me the status of temperature", "get me the status of temperature"],
    "humidity" : ["what's the status of humidity", "what is the status of humidity", "give me the status of humidity", "get me the status of humidity"],
    "carbonMonoxideGas" : ["what's the status of carbon monoxide gas", "what is the status of carbon monoxide gas", "give me the status of carbon monoxide gas", "get me the status of carbon monoxide gas"],
    "rain" : ["what's the status of rain", "what is the status of rain", "give me the status of rain", "get me the status of rain"],
    "all" : ["what's the status", "what is the status", "give me the status", "get me the status"]
}

var dataToSend = undefined;
var responseString = {
    "payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}
}

function hasValueDeep(json, findValue) {
    const values = Object.values(json);
    let hasValue = values.includes(findValue);
    values.forEach(function(value) {
        if (typeof(value) === "object") {
            hasValue = hasValue || hasValueDeep(value, findValue);
        }
    })
    return hasValue;
}

app.post('/getInfo', (req, res) => {
    var temp = 33;
    var humi = 75;
    var co = 13;
    var rain = "present";
    var queryString = req.body.queryResult.queryText;
    console.log(queryString)
    
    if (flag) {

        if (hasValueDeep(requestString.connect,queryString)) {
                dataToSend = "You are already connected!";
                responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                return res.json(responseString);

        } else if (hasValueDeep(requestString.disconnect,queryString)) {
                        flag = false;
                        dataToSend = "Disconnected successfully!";
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else if (hasValueDeep(requestString.temperature,queryString)) {
                        dataToSend = `Temperature is ${temp} degree celcius.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else if (hasValueDeep(requestString.humidity,queryString)) {
                        dataToSend = `Humidity is ${humi} percent.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);
                    
        } else if (hasValueDeep(requestString.carbonMonoxideGas,queryString)) {
                        dataToSend = `Carbon monoxide gas is ${co} ppm.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else if (hasValueDeep(requestString.rain,queryString)) {
                        dataToSend = `Rain is ${rain}.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);
                        
        } else if (hasValueDeep(requestString.all,queryString)) {
                        dataToSend = `Temperature is ${temp} degree celcius.\n Humidity is ${humi} percent.\n Carbon monoxide gas is ${co} ppm and\n rain is ${rain}.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else {
            dataToSend = "Sorry, I didn't get that. Can you say that again?";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
        }

    } else {

        if (hasValueDeep(requestString.connect,queryString)) {
                flag = true;
                dataToSend = "Connected successfully!";
                responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                return res.json(responseString);

        } else if (hasValueDeep(requestString.disconnect,queryString)) {
                    let dataToSend = "You are already disconnected.";
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

        } else if (hasValueDeep(requestString,queryString)) {
                    dataToSend = `You are not connected to your project.`;
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

        } else {
            dataToSend = "Sorry, I didn't get that. Can you say that again?";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
        }
    }

});


app.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});