const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const mongoosePaginate = require("mongoose-paginate-v2");
const userTypEnums=require('../enums/userTypes')
const statusEnum=require('../enums/status')
const userSchema = new schema({
    countryCode: {
      type: String,
      default: "+91",
    },
    mobileNumber: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    companyName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    emailOtp: {
      type: String,
    },
    mobileOtp:{
      type: String,
    },
    emailOtpExpireTime: {
      type: Number,
      default: Date.now(),
    },
    mobOtpExpireTime: {
      type: Number,
      default: Date.now(),
    },
    status: {
      type: String,
      default: statusEnum.data.ACTIVE,
    },
    userType: {
      type: String,
      default: userTypEnums.data.USER,
    },
    profilePic: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("user", userSchema);

mongoose
  .model("user", userSchema)
  .findOne({ userType: { $in: [userTypEnums.data.ADMIN] } }, (err, result) => {
    if (err) {
     console.log("Default Admin error :", err);
    } else if (result) {
     console.log("Default Admin exists.");
    } else {
      let object = {
        userType: userTypEnums.data.ADMIN,
        status: statusEnum.data.ACTIVE,
        firstName: "Finovac",
        lastName: "Admin",
        countryCode: "+91",
        mobileNumber: "7084989662",
        isPaid: true,
        isReset: true,
        companyName: "Complyany",
        address: "Saharanpur",
        email: "finovac@mailinator.com",
        password: bcrypt.hashSync("Finovac@123"),
      };
      mongoose.model("user", userSchema).create(object, (err1, result1) => {
        if (err1) {
         console.log("Default admin creation error :", err1);
        } else {
         console.log("Default admin created", result1);
        }
      });
    }
  });
