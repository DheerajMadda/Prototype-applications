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

app.post('/getInfo', (req, res) => {
    var temp = 33;
    var humi = 75;
    var co = 13;
    var rain = "present";
    var queryString = req.body.queryResult.queryText;
    
    if (flag) {

        if (queryString == (requestString.connect[0] || requestString.connect[1] || requestString.connect[2])) {
                dataToSend = "You are already connected!";
                responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                return res.json(responseString);

        } else if (queryString == (requestString.disconnect[0] || requestString.disconnect[1] || requestString.disconnect[2])) {
                        flag = false;
                        dataToSend = "Disconnected successfully!";
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else if (queryString == (requestString.temperature[0] || requestString.temperature[1] || requestString.temperature[2] || requestString.temperature[3])) {
                        dataToSend = `Temperature is ${temp} degree celcius.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else if (queryString == (requestString.humidity[0] || requestString.humidity[1] || requestString.humidity[2] || requestString.humidity[3])) {
                        dataToSend = `Humidity is ${humi} percent.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);
                    
        } else if (queryString == (requestString.carbonMonoxideGas[0] || requestString.carbonMonoxideGas[1] || requestString.carbonMonoxideGas[2] || requestString.carbonMonoxideGas[3])) {
                        dataToSend = `Carbon monoxide gas is ${co} ppm.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else if (queryString == (requestString.rain[0] || requestString.rain[1] || requestString.rain[2] || requestString.rain[3])) {
                        dataToSend = `Rain is ${rain}.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);
                        
        } else if (queryString == (requestString.all[0] || requestString.all[1] || requestString.all[2] || requestString.all[3])) {
                        dataToSend = `Temperature is ${temp} degree celcius.\n Humidity is ${humi} percent.\n Carbon monoxide gas is ${co} ppm and\n rain is ${rain}.`;
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);

        } else {
            dataToSend = "Sorry, I didn't get that. Can you say that again?";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
        }

    } else {

        if (queryString == (requestString.connect[0] || requestString.connect[1] || requestString.connect[2])) {
                flag = true;
                dataToSend = "Connected successfully!";
                responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                return res.json(responseString);

        } else if (queryString == (requestString.disconnect[0] || requestString.disconnect[1] || requestString.disconnect[2])) {
                    let dataToSend = "You are already disconnected.";
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

        } else if (queryString == (requestString.connect[0] || requestString.connect[1] || requestString.connect[2] ||
                                   requestString.disconnect[0] || requestString.disconnect[1] || requestString.disconnect[2] ||
                                   requestString.temperature[0] || requestString.temperature[1] || requestString.temperature[2] || requestString.temperature[3] ||
                                   requestString.humidity[0] || requestString.humidity[1] || requestString.humidity[2] || requestString.humidity[3] ||
                                   requestString.carbonMonoxideGas[0] || requestString.carbonMonoxideGas[1] || requestString.carbonMonoxideGas[2] || requestString.carbonMonoxideGas[3] ||
                                   requestString.rain[0] || requestString.rain[1] || requestString.rain[2] || requestString.rain[3] ||
                                   requestString.all[0] || requestString.all[1] || requestString.all[2] || requestString.all[3] )) {
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