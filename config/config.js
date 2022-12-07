// const config = require("./config.json");//development
const config = require("./staging.json");//staging
// const config = require("./production.json");//production
global.gConfig = config;
require('dotenv').config()
//console.log(process.env.NODE_ENV)0
