const cache = require("../controllers/cache-controller");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const expressServer = express();
const httpServer = http.createServer(expressServer);
const socketServer = socketIO(httpServer, 
    { cors: { origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3004']} });

// expressServer.use(express.static(__dirname)); // Serve index.html

let userIdToSocketsMap = new Map();

// Server got the client connection, and add its Socket to a Socket collection:
socketServer.on("connection", socket => {
    console.log("Connection request");
    let handshakeData = socket.request;
    let token = handshakeData._query['token'].substring("Bearer ".length);

    let id = cache.get(token).id;
    console.log("User id: " + id);

    userIdToSocketsMap.set(id, socket);
    console.log("One client has been connected... Total clients: " + 
        userIdToSocketsMap.size);

    socket.on("disconnect", () => {
        console.log("Connection request");
        let handshakeData = socket.request;
        let token = handshakeData._query['token'].substring("Bearer ".length);
        
        if (!cache.get(token)) {
            return;
        }

        let id = cache.get(token).id;

        // A vaild userId means the user clicked "logout"
        userIdToSocketsMap.delete(id);
        console.log(id + " client has been disconnected. Total clients: " + 
                              userIdToSocketsMap.size);
    });
});

async function asyncBroadcast(event, senderId) {
    for (let [userId, socket] of userIdToSocketsMap) {
        if (userId != senderId) {
            socket.emit(event.type, event.parameters);
        }
    }
}

httpServer.listen(3002, () => console.log("SocketServer Listening..."));

module.exports = {
    asyncBroadcast
}