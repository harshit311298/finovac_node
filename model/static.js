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
        type: { type: String },
        title: { type: String },
        description: { type: String },
        link:{type:String},
        status: { type: String, default: statusEnum.data.ACTIVE}
    },
    options
);

module.exports = mongoose.model("static-content", schemaDefination);

mongoose.model("static-content", schemaDefination).find({}, async(err, result) => {

    if (err) {
        console.log("Static error :", err);
    }
    else if (result.length!=0) {
        console.log("Default Static creation");
    } else {
        let obj1= {
            type: "AboutUs",
            title: "ABOUT US",
            description: "Explicit Rarity \n To give general guidance on the hierarchy for the digital collectible art piece, the creators provide a set of explicit characteristics with differing degrees of rarity, e.g. men are much more common than robots. Unlike other collectibles, there is a second layer of scarcity imposed on top of the explicit traits via the implicit traits and the market for names. \n Implicit Rarity \n Crypto Crafts* are not a simple collectible, though, they are art. And art is not systematic. It is enigmatic. As the foremost blend of intelligently designed collectible items and artistic creation, many Hashmask traits or attributes are not explicitly accounted for. It encourages the consumer or rather the collective consumer to project his or her interpretation of value into the artwork. On top of that, the NCTs pass on the decision power over the rarest of all traits, a unique name, to the consumer, thus, eradicating the invisible line separating the creator and the consumer of the artwork \n Example of Implicit Rarity \n On the highest level, there are 14 different types of masks. 12.5% of all characters wear an animal mask and only 5.9% wear a pixel mask. At first sight, pixel masks may seem more exclusive, but upon further inspection, you realize that there are only 13 Hashmasks that feature a unicorn mask, which is much more exclusive than the rarest of all pixel masks. Other examples of implicit traits with varying degrees of rarity are backgrounds, shirts, hairstyle and colors, and many more."
        };
        let obj2 = {
            type: "Terms And Conditions",
            title: "Terms & Conditions",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus."
        };
        let obj3 = {
            type: "PrivacyPolicies",
            title: "Privacy Policy",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus."
        };
        let obj4 = {
            type: "twitter",
            title: "twitter",
            link: "https://twitter.com/"
        };
        let obj5 = {
            type: "telegram",
            title: "telegram",
            link: "https://telegram.org/"
        };
        let obj6 = {
            type: "youTube",
            title: "youTube",
            link: "https://www.youTube.com/"
        };
        let obj7 = {
            type: "instagram",
            title: "instagram",
            link: "https://www.instagram.com/"
        }
        mongoose.model("static-content", schemaDefination).create(obj1, obj2, obj3,obj4,obj5,obj6,obj7,async(err1, result1) => {
            if (err1) {
                console.log("Default Static creation error :", err1)
            } else {
                console.log("Default Static content created", result1);
            }
        });
    }
})

