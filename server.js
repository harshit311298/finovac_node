const express = require('express')
const app = express()
const http = require('http')
const config = require("./config/config");
require("./dbConnections/mongodb");

require('./route')
app.get('/', function (req, res) {
    res.send('Hello World')
})
app.use((req, res, next) => {
  res.status(404).send({responseCode:404,responseMessage:"Your url is not valid please check again."});
});
const server = http.createServer(app);

server.listen(process.env.PORT || 8080, () => {
    console.log("server is running on port :", process.env.PORT || 8080);
});
