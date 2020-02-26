const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://127.0.0.1/crud',function(err){
    if(err)
        console.log(err); 
    else{
        console.log("------------Database connected------------"); 
    }
});
const Schema = mongoose.Schema;
const Data = new Schema({
    name : String,
    email : String,
    msg : String,
});


const UserData = mongoose.model('model_data',Data);

var my_schemas = {
	UserData : UserData,
	}

module.exports = my_schemas ;
