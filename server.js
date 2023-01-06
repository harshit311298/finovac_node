const express = require('express')
const app = express()
const http = require('http')
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/config");
require("./dbConnections/mongodb");
const index = require('./route')
app.use(cors());
const enviroment=require('./utility/enviromentVariables')
let variableused=enviroment.local//beta
// let variableused=enviroment.staging//staging
// let variableused=enviroment.production//production
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));
app.use(morgan("dev"));
app.use("/api/v1", index);
app.get('/', function (req, res) {
    res.send('Hello World')
})
const { Server } = require('ws');


const server = http.createServer(app);
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var swaggerDefinition = {
  info: {
    title: "FINOVAC_NODE",
    version: "2.0.0",
    description: "FINOVAC_NODE API DOCS",
  },
  host: `${variableused.swaggerurl}`,
  basePath: "/",
};

var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./controllers/**/*.js"],
};

var swaggerSpec = swaggerJSDoc(options);

app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.status(404).send({responseCode:404,responseMessage:"Your url is not valid please check again."});
});


server.listen(process.env.PORT || 8080, () => {
    console.log("server is running on port :", process.env.PORT || 8080);
});

// const ws_server = new Server({ server });
// ws_server.on('connection', (ws) => {
//   console.log('New client connected!');

//   ws.on('close', () => console.log('Client has disconnected!'));
// });

// const WebSocketClient = require('websocket').client;

// var client = new WebSocketClient();

// client.on('connectFailed', function(error) {
//     console.log('Connect Error: ' + error.toString());
// });

// client.on('connect', function(connection) {
//     console.log('Connection established!');
    
//     connection.on('error', function(error) {
//         console.log("Connection error: " + error.toString());
//     });
    
//     connection.on('close', function() {
//         console.log('Connection closed!');
//     });
//     let message={
//       "header": {
//         "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
//         "ts": "2020-05-28T16:56:03-08:00",
//         "sid": "",
//         "dup": false,
//         "type": "urn:finvu:in:app:req.loginOtp.01"
//        },
//         "payload": {
//           "username": "7084989662@finvu",
//           "mobileNum": "7084989662",
//           "handleId": "c261e6d2-5595-45ae-af11-c0f158b96019"
//         } 
//     }
//     connection.on('message', function(message) {
//         console.log("Current time on server is: '" + message + "'");
//     });
// });

// client.connect(`wss://webvwdev.finvu.in/consentapi`);


