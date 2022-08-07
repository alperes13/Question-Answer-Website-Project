
/* 

    We can define server.js as our backend main page. There is some modules from our package and npm.

*/


const express = require("express");

const dotenv = require("dotenv");

const routers = require("./routers/index");

const connectDatabase = require("./helpers/database/connectDatabase");

const customErrorHandler = require("./middlewares/errors/customErrorHandler");

const path = require("path");


// ----- This codes for dotenv global variables. -------

dotenv.config({ 

    path: "./config/env/config.env" 

});

const PORT = process.env.PORT;


// ------- Connecting database -------

connectDatabase();

// Setting a variables for using express constructor.

const app = express();

// thats for console.log() messages.

app.use(express.json());

/* 

    Routers layer is a middleware in actual. We define here it as "if there is request for /api use routers."
We using that build for more modular, readable, useful code.

*/

app.use("/api", routers);

// This middleware for handling errors. ---> middlewares/errors/customErrorHandler.js

app.use(customErrorHandler);

/* 

    In the ExpressJs, if we want to get static files, we need to use a package in the ExpressJs. Firstly we can start
with setting a variable from require("path").

*/

app.use(express.static(path.join(__dirname,"public")));

// This is for running our server.

app.listen(PORT, () => {

    console.log(`Server Started, PORT : ${PORT} : ${process.env.NODE_ENV}`);
    
});