var express = require("express");
var http = require("http");

const app = express();
const server = http.createServer(app);

const sio = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

sio.on("connection", (socket) => {
    console.log("Connected!");
    setInterval(()=>{
        socket.emit('key',{'temp':50,'humi':70})
        console.log("sent")
    },1000)
});

server.listen(3000);