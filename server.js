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
// let variableused=enviroment.local//beta
let variableused=enviroment.staging//staging
// let variableused=enviroment.production//production
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));
app.use(morgan("dev"));
app.use("/api/v1", index);
app.get('/', function (req, res) {
    res.send('Hello World')
})

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
