const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const model = require('./model_data');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//NOTE : all global "undefined" parameters are used later----------------------------------

//------Global Flags---------------
var flag = false;
var child_flag = true;
var bot_flag = false;

//--------expected user queries - bot name and bot info---------------------------------
var bot_name = "Cassandra";
var bot_info = "tell me about yourself";

//------requestString1, requestString2, requestString3 are the expected user queries-------------------
var requestString1 = {
    "connect" : ["connect to my project", "connect to my project server", "connect to my project database"],
    "disconnect" : ["disconnect to my project", "disconnect to my project server", "disconnect to my project database"]
}

var requestString2 = {
    "temperature" : ["what's the status of temperature", "what is the status of temperature", "give me the status of temperature", "get me the status of temperature"],
    "humidity" : ["what's the status of humidity", "what is the status of humidity", "give me the status of humidity", "get me the status of humidity"],
    "carbonMonoxide" : ["what's the status of carbon monoxide", "what is the status of carbon monoxide", "give me the status of carbon monoxide", "get me the status of carbon monoxide"],
    "rain" : ["what's the status of rain", "what is the status of rain", "give me the status of rain", "get me the status of rain"],
    "all" : ["what's the status", "what is the status", "give me the status", "get me the status"]
}

var requestString3 = {
    "predictTemperature" : ["what will be the temperature after * hour", "what will be the temperature after * hours"],
    "predictHumidity" : ["what will be the humidity after * hour", "what will be the humidity after * hours"]
}

//------Global qArray , an array of user query ("undefined" by default)----------------
var qArray = undefined;

//-------responseString is the response for the user queries ("undefined" by default)----------------------
var dataToSend = undefined;
var responseString = {
    "payload": {"google": {"richResponse": {"items":[{"simpleResponse": {"textToSpeech": dataToSend}}]}}}
}

//--------function hasValueDeep checks if the user query exists in the requestStrings------------
//if exists returns true else returns false
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


//--------function returnTimeStamp() returns timestamp------------------
var hourInSeconds = {
    "1":3600,"2":7200,"3":10800,"4":14400,"5":18000,"6":21600,"7":25200,"8":28800,"9":32400,"10":36000,"11":39600,"12":43200
}

function returnTimeStamp() {
    if(qArray[6] == "1") {
        return (Date.now() / 1000 | 0) + hourInSeconds[1];
    } else if (qArray[6] == "2") {
        return (Date.now() / 1000 | 0) + hourInSeconds[2];
    } else if (qArray[6] == "3") {
        return (Date.now() / 1000 | 0) + hourInSeconds[3];
    } else if (qArray[6] == "4") {
        return (Date.now() / 1000 | 0) + hourInSeconds[4];
    } else if (qArray[6] == "5") {
        return (Date.now() / 1000 | 0) + hourInSeconds[5];
    } else if (qArray[6] == "6") {
        return (Date.now() / 1000 | 0) + hourInSeconds[6];
    } else if (qArray[6] == "7") {
        return (Date.now() / 1000 | 0) + hourInSeconds[7];
    } else if (qArray[6] == "8") {
        return (Date.now() / 1000 | 0) + hourInSeconds[8];
    } else if (qArray[6] == "9") {
        return (Date.now() / 1000 | 0) + hourInSeconds[9];
    } else if (qArray[6] == "10") {
        return (Date.now() / 1000 | 0) + hourInSeconds[10];
    } else if (qArray[6] == "11") {
        return (Date.now() / 1000 | 0) + hourInSeconds[11];
    } else if (qArray[6] == "12") {
        return (Date.now() / 1000 | 0) + hourInSeconds[12];
    } else if (parseInt(qArray[6]) > 12 && parseInt(qArray[6]) != NaN) {
        return undefined;
    } else return false;
}


//---------function childProcess() to get the predicted value------------
var result = undefined;
var copyPredicted = undefined;

function childProcess(tStamp) {
    const py = spawn('python',['ml.py']);
    let dataString="";
    
    if (qArray[4] == "temperature") {
        var toSend = "temperature" + " " + tStamp;
    }
    else if (qArray[4] == "humidity") {
        var toSend = "humidity" + " " + tStamp;
    }

    py.stdin.write(JSON.stringify(toSend));
    py.stdin.end();

    py.stdout.on('data',(data)=>{
        dataString += data.toString();
    })

    py.stdout.on('end',()=>{
        result = dataString.trim();
        return result;
    })

}


var t1 = undefined;
var t2 = undefined;
var Tdiff = undefined;
var Qchild_parameter = undefined;
var into_milliSeconds = undefined;
var hrMin = undefined;

var temp = undefined;
var humi = undefined;
var co = undefined;
var rain = undefined;

//------/getInfo => listening for the webhook call for requestString1,requestString2,requestString3,bot_name,bot_info------
app.post('/getInfo', (req, res) => {
    model.liveData.findOne({},(err,resp)=>{
        if(err) console.log("Something went wrong");
        if(resp){
            temp = resp.json.temp;
            humi = resp.json.hum;
            co = resp.json.gas;
            rain = resp.json.rain;
        }
    });

    var queryString = req.body.queryResult.queryText;
    qArray = queryString.split(' ');
    console.log(queryString)
    if (qArray[4] == "temperature") {
        if (qArray[7] == "hour") {
            var qReplaced = requestString3.predictTemperature[0].replace("*",qArray[6]);
        } else if (qArray[7] == "hours") {
            var qReplaced = requestString3.predictTemperature[1].replace("*",qArray[6]);
        } else {
            var qReplaced = "404 not found";
        }

    } else if (qArray[4] == "humidity") {
        if (qArray[7] == "hour") {
            var qReplaced = requestString3.predictHumidity[0].replace("*",qArray[6]);
        } else if (qArray[7] == "hours") {
            var qReplaced = requestString3.predictHumidity[1].replace("*",qArray[6]);
        } else {
            var qReplaced = "404 not found";
        }

    } else {
        var qReplaced = "404 not found";
    }



//--------------------FLAG = true------------------------------------------------
    if (flag) {

        if (hasValueDeep(requestString1.connect,queryString)) {
            dataToSend = "You are already connected!";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (hasValueDeep(requestString1.disconnect,queryString)) {
            flag = false;
            dataToSend = "Disconnected successfully!";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (hasValueDeep(requestString2.temperature,queryString)) {
            dataToSend = `Temperature is ${temp} degree celcius.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (hasValueDeep(requestString2.humidity,queryString)) {
            dataToSend = `Humidity is ${humi} percent.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
                    
        } else if (hasValueDeep(requestString2.carbonMonoxide,queryString)) {
            dataToSend = `Carbon monoxide is ${co} ppm.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (hasValueDeep(requestString2.rain,queryString)) {
            dataToSend = `Rain is ${rain}.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
                        
        } else if (hasValueDeep(requestString2.all,queryString)) {
            dataToSend = `Temperature is ${temp} degree celcius.\n Humidity is ${humi} percent.\n Carbon monoxide is ${co} ppm and\n rain is ${rain}.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (qReplaced.localeCompare(queryString) == 0) {
//--------------------CHILD FLAG = true------------------------------------------------
            if (child_flag) {

                if (qArray[4] == "temperature") Qchild_parameter = "temperature";
                else if (qArray[4] == "humidity") Qchild_parameter = "humidity";

                let timeStamp = returnTimeStamp();
                
                if (timeStamp == undefined) {
                    dataToSend = `Sorry, can predict atmost 12 hours ahead of current time.`;
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

                } else if (timeStamp == false) {
                    dataToSend = "Sorry, I didn't get that. Can you say that again?";
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

                } else {       

                    async function callback() {
                        let promise = new Promise((resolve, reject) => {
                            result = childProcess(timeStamp);
                            setTimeout(() => {
                                resolve(result)}, 60000);
                        });
                        let predicted = await promise; 

                        copyPredicted = predicted;
                    }

                    callback();
                    
                    t1 = (Date.now() / 1000 | 0) + 60;
                    t2 = Date.now() / 1000 | 0;

                    let timeout = setInterval(() => {
                        Tdiff = t1 - 1;
                        t1 = Tdiff;
                        if (Tdiff == t2) clearInterval(timeout);
                    }, 1000);

                    into_milliSeconds = timeStamp * 1000;
                    hrMin = moment(into_milliSeconds).format("h:mm a");

                    
                    child_flag = false;
                    bot_flag = true;

                    dataToSend = "Your prediction request is in process and will take some time.\nI will get back to you after a minute.\nJust don't forget to call my name.";
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

                }
//--------------------CHILD FLAG = false------------------------------------------------
            } else {

                if (Tdiff - t2 > 0) { 
                    dataToSend = "Sorry, your previous prediction request is still in process.";
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

                } else {
                    dataToSend = "I have processed your previous prediction request. Just call my name or I can't process your next prediction request.";
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);
                }
            }

        } else if (queryString == bot_name) {
//--------------------BOT FLAG = true-----------------------------------------------
            if (bot_flag) {

                if (Tdiff - t2 > 0) {
                    dataToSend = `Keep patience, ${Tdiff - t2} seconds remaining \nfor completion of your prediction request.`;
                    responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                    return res.json(responseString);

                } else {
                    child_flag = true;
                    bot_flag = false;

                    if (copyPredicted != "None") {

                        if (Qchild_parameter == "temperature") {
                            dataToSend = `I am back with a response to your prediction request.\nAt ${hrMin}, temperature will be ${parseInt(copyPredicted).toFixed(2)} degree celcius.`;
                            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                            return res.json(responseString);

                        } else if (Qchild_parameter == "humidity") {
                            dataToSend = `I am back with a response to your prediction request.\nAt ${hrMin}, humidity will be ${parseInt(copyPredicted).toFixed(2)} percent.`;
                            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                            return res.json(responseString);

                        } 
                
                    } else {
                        dataToSend = "Sorry, cannot fulfill your prediction request.\n There was some error from server.";
                        responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                        return res.json(responseString);
                    }

                }
//--------------------BOT FLAG = false------------------------------------------------            
            } else {
                dataToSend = "I don't have any pending prediction requests.";
                responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
                return res.json(responseString);
            }
        
        } else if (queryString == bot_info) {
            dataToSend = "I'm a chat bot. My job is to keep you updated with your environment monitoring project. " +
                         "I'm smart enough in assisting you with machine learning based predictive analysis for predicting temperature and humidity.";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else {
            dataToSend = "Sorry, I didn't get that. Can you say that again?";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
        }
                
//-------------FLAG == false-----------------------------------
    } else {

        if (hasValueDeep(requestString1.connect,queryString)) {
            flag = true;
            dataToSend = "Connected successfully!";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (hasValueDeep(requestString1.disconnect,queryString)) {
            let dataToSend = "You are already disconnected.";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (hasValueDeep(requestString2,queryString)) {
            dataToSend = `You are not connected to your project.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (qReplaced.localeCompare(queryString) == 0) {
            dataToSend = `You are not connected to your project.`;
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (queryString == bot_name) {
            dataToSend = "Hi! I am here to assist you in predictive analysis but you need to be connected to your project.";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else if (queryString == bot_info) {
            dataToSend = "I'm a chat bot. My job is to keep you updated with your environment monitoring project. " +
                         "I'm smart enough in assisting you with machine learning based predictive analysis for predicting temperature and humidity.";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);

        } else {
            dataToSend = "Sorry, I didn't get that. Can you say that again?";
            responseString.payload.google.richResponse.items[0].simpleResponse.textToSpeech = dataToSend;
            return res.json(responseString);
        }

    }

});



app.listen((process.env.PORT || 8080), () => {
    console.log("Server is up and running...");
});