const express = require('express');
const bodyParser = require('body-parser');
const my_schemas = require('./model_data');

const app = express();


app.use(bodyParser.json());

app.use((err, req, res, next) => {
    res.send({ error: err.message });

});



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// 
app.post('/addData', function (req, res, next) {
    var data = req.body;
    my_schemas.UserData.create(data)
        .then(data => res.send(data))
        .catch(next);//.catch(err=> res.send("404"))
});

app.get('/getData', function (req, res, next) {
    my_schemas.UserData.find({}, function (err, response) {
        if (err) {res.json(err);}
        else {
            console.log(response);
            res.json({ users: response });
        }
    });

});


app.post('/removeData',function(req,res,next){
        const deleteId = req.body._id;
        my_schemas.UserData.findByIdAndRemove({_id : deleteId},function(err,res){
            if(err){
                console.log(`Error in finding ${err}`);
            }else{
                console.log(`deleted successfulld ${res}`);
            }
        })
        .then(UserData=>res.status(204).send(UserData))
        .catch(next);
});

app.post('/update',function(req,res,next){
    d=req.body;
    console.log(d);
    my_schemas.UserData.findByIdAndUpdate({_id:d._id},{name:d.name,email:d.email,msg:d.msg},function(err,res){
        if(err){
            console.log(`Error in updating ${err}`);
        }else{
            console.log(`Updated Sussessfully ${res}`);
        }
    }).then(data => res.send(data))
        .catch(next);;
});

app.listen(8080, () => {
    console.log('Running on port 8080');
});