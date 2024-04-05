const WebSocket = require('ws');
const express = require('express');

var app = express();

const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const server = app.listen(port, '0.0.0.0', function () {
  console.log(`server is listening on port ${port}`);
});

const wss = new WebSocket.Server({ server: server });

wss.on('connection', function (wsclient) {
  console.log("client connected");
  wsclient.on('message', function (data) {
    console.log("message recieved:", data);
    wss.clients.forEach(function (client) {
      if (client.readyState == WebSocket.OPEN && client != wsclient) {
	client.send(data, { binary: false });
      }
    });
  });
});


