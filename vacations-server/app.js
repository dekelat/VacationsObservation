// import modules
const express = require("express");
const cors = require('cors');
const port = process.env.PORT || 3001;
const loginFilter = require("./middleware/login-filter");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const errorHandler = require("./errors/error-handler");

const server = express();

server.use(express.static('public'));

// Enable other domains to connect to my server
server.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3003', 
    'http://localhost:3004']}));

// Extracts the JSON from the body and creates request.body object containing it:
server.use(express.json());

// init middlewares
server.use(loginFilter());
server.use("/users", usersController);
server.use("/vacations", vacationsController);
server.use(errorHandler);

server.listen(port, () => console.log('Server started on port ' + port));