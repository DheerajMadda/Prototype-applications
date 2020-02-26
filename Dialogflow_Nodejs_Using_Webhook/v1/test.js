const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var flag = false

app.post('/getInfo', (req, res) => {
    var temp = 33
    var humi = 75
    var co = 13
    var rain = "present"
    var queryString = req.body.queryResult.queryText
    var queryKey =  req.body.queryResult.parameters.key
    console.log(queryString)
    console.log(queryKey)
    console.log("---------")

    if (flag == true) {
        if (queryString == "connect to my project database" && queryKey == undefined || 
            queryString == "connect to my project server" && queryKey == undefined ||
            queryString == "connect to my project" && queryKey == undefined) {
                let dataToSend = "You are already connected.!"
                return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "disconnect to my project database" && queryKey == undefined || 
                    queryString == "disconnect to my project server" && queryKey == undefined ||
                    queryString == "disconnect to my project" && queryKey == undefined) {
                        flag = false
                        let dataToSend = "Disconnected successfully!"
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "what's the status of temperature" && queryKey == undefined ||
                    queryString == "what is the status of temperature" && queryKey == undefined ||
                    queryString == "give me the status of temperature" && queryKey == undefined ||
                    queryString == "get me the status of temperature" && queryKey == undefined) {
                        let dataToSend = `Temperature is ${temp} degree celcius.`
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "what's the status of humidity" && queryKey == undefined ||
                    queryString == "what is the status of humidity" && queryKey == undefined ||
                    queryString == "give me the status of humidity" && queryKey == undefined ||
                    queryString == "get me the status of humidity" && queryKey == undefined) {
                        let dataToSend = `Humidity is ${humi} percent.`
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "what's the status of carbon monoxide gas" && queryKey == undefined ||
                    queryString == "what is the status of carbon monoxide gas" && queryKey == undefined ||
                    queryString == "give me the status of carbon monoxide gas" && queryKey == undefined ||
                    queryString == "get me the status of carbon monoxide gas" && queryKey == undefined) {
                        let dataToSend = `Carbon monoxide gas is ${co} ppm.`
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "what's the status of rain" && queryKey == undefined ||
                    queryString == "what is the status of rain" && queryKey == undefined ||
                    queryString == "give me the status of rain" && queryKey == undefined ||
                    queryString == "get me the status of rain" && queryKey == undefined) {
                        let dataToSend = `Rain is ${rain}.`
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "what's the status" && queryKey == undefined ||
                    queryString == "what is the status" && queryKey == undefined ||
                    queryString == "give me the status" && queryKey == undefined ||
                    queryString == "get me the status" && queryKey == undefined) {
                        let dataToSend = `Temperature is ${temp} degree celcius.\n Humidity is ${humi} percent.\n Carbon monoxide gas is ${co} ppm and\n rain is ${rain}.`
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": "Sorry, I didn't get that. Can you say that again?"}}]}}}})
    } else {
        if (queryString == "connect to my project database" && queryKey == undefined || 
            queryString == "connect to my project server" && queryKey == undefined ||
            queryString == "connect to my project" && queryKey == undefined) {
                flag = true
                let dataToSend = "Connected successfully!"
                return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "disconnect to my project database" && queryKey == undefined || 
                   queryString == "disconnect to my project server" && queryKey == undefined ||
                   queryString == "disconnect to my project" && queryKey == undefined) {
                    let dataToSend = "You are already disconnected."
                    return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        } else if (queryString == "what's the status of temperature" && queryKey == undefined ||
                   queryString == "what is the status of temperature" && queryKey == undefined ||
                   queryString == "give me the status of temperature" && queryKey == undefined ||
                   queryString == "get me the status of temperature" && queryKey == undefined ||
                   queryString == "what's the status of humidity" && queryKey == undefined ||
                   queryString == "what is the status of humidity" && queryKey == undefined ||
                   queryString == "give me the status of humidity" && queryKey == undefined ||
                   queryString == "get me the status of humidity" && queryKey == undefined ||
                   queryString == "what's the status of carbon monoxide gas" && queryKey == undefined ||
                   queryString == "what is the status of carbon monoxide gas" && queryKey == undefined ||
                   queryString == "give me the status of carbon monoxide gas" && queryKey == undefined ||
                   queryString == "get me the status of carbon monoxide gas" && queryKey == undefined ||
                   queryString == "what's the status of rain" && queryKey == undefined ||
                   queryString == "what is the status of rain" && queryKey == undefined ||
                   queryString == "give me the status of rain" && queryKey == undefined ||
                   queryString == "get me the status of rain" && queryKey == undefined ||
                   queryString == "what's the status" && queryKey == undefined ||
                   queryString == "what is the status" && queryKey == undefined ||
                   queryString == "give me the status" && queryKey == undefined ||
                   queryString == "get me the status" && queryKey == undefined) {
                        let dataToSend = `You need to be connected to your project first.`
                        return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}})
        }
        else return res.json({"payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": "Sorry, I didn't get that. Can you say that again?"}}]}}}})
    }

});


app.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});