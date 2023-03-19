const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const mongoosePaginate = require("mongoose-paginate-v2");
const userTypEnums=require('../enums/userTypes')
const statusEnum=require('../enums/status')

const options = {
    collection: "static-content",
    timestamps: true
};

const schemaDefination = new schema(
    {
        email: { type: String },
        name: { type: String },
        phoneNo:{type:String},
        query: { type: String },
        status: { type: String, default: statusEnum.data.ACTIVE}
    },
    options
);

module.exports = mongoose.model("static-content", schemaDefination);