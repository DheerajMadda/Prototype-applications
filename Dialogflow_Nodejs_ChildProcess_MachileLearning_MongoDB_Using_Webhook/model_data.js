const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var db = mongoose.connect('mongodb://127.0.0.1/dheeraj',function(err){
    if(err)
        console.log(err); 
    else {
        console.log("------------Database connected------------"); 
    }
});

const Schema = mongoose.Schema;

const liveDataSchema = new Schema({
    id  : Number,
    json : Object,
    date: String,
    timestamp : Number
})


const liveData = mongoose.model('liveData',liveDataSchema);

var my_schemas = {
	liveData : liveData
	}

module.exports = my_schemas ;