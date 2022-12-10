const { string } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const supportSchema = new schema(
    {
        countryName: {
            type: String
        },
        name: {
            type: String
        },
        email: { 
            type: String
        },
        mobileNumber: {
            type: String
        },
        countryCode:{
            type:String
        },
        subject: {
            type: String
        },
        description: {
            type: String
        },
        attachment:{
            type:String
        },
        urgency: {
            type: String,
            enum: ["HIGH", "MEDIUM", "LOW"]
        },
        supportStatus:{
            type:String,
            enum:["ACCEPTED","REJECTED","PENDING"],
            default: "PENDING",
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);
supportSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("support", supportSchema);