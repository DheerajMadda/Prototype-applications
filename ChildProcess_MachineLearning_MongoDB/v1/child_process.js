var spawn = require('child_process').spawn;
py = spawn('python',['ml.py']);
dataString = "";

var dateTimeString = "08-12-2019 11:53:01";
var match = dateTimeString.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
var timeStamp = new Date(match[3],match[2]-1,match[1],match[4],match[5],match[6]).getTime() / 1000;

py.stdin.write(JSON.stringify(timeStamp));
py.stdin.end();

py.stdout.on('data',(data)=>{
	dataString += data.toString();
})

py.stdout.on('end',()=>{
	data = dataString.split("/")
	console.log(`Predicted : Temperature = ${data[0]} | Humidity = ${data[1]}`)
})