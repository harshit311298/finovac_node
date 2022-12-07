const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const userTypEnums = require('../enums/userTypes')
const statusEnum = require('../enums/status')
const sliderSchema = new schema({
    title:{
        type: String,
        default:""
    },
    description:{
        type: String,
        default:""
    },
    slideNumber:{
        type: Number,
        default:1
    },
    status: {
        type: String,
        default: statusEnum.data.ACTIVE,
    }
})
sliderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("slider", sliderSchema);


