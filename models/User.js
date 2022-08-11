/* 

    We using mongoose for creating a user. Detailed documents findable in mongoose website: https://mongoosejs.com/docs/guide.html

    Firstly, we must to create a schema before mongoose models. If we creating anything with using schema, its will be update
    on our mongoDb database. So we can start with create a schema.


    What is the JWT? (Json Web Token)

    If we give a example, we need to think on a client application and a web server. We developing web server side and client is
    Postman. Postman will meet with a router when there is a request for new question or like a answer, etc. And in this situation
    we should to do authorization control. This control like "is this user logged in?" There is a process for this authorization
    situation. This process is JWT. There is a diffrent procces for authorization but we will use JWT in this project.
    We normally define JWT into headers in front-end application. And after when there is a request execute, headers going to
    API. In the API, if token has expired, there is not execute to decoding process. And its return "401 Unauthorization" error.
    However if there is not any error, process will run into encoding, and finally return "200 OK" status. So we will use JWT for
    building secure routers. Usually we filling JWTs into cookies. Not only in browser... We can store it in Postman's cookies.
    We can reach it on global environment variables in Postman. We always can change token, when user change. And after all of
    this steps we can get authorization because of sent token inside of headers.
*/



const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question = require("./Question");


const Schema = mongoose.Schema;

const UserSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please provide a your name"]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide your e-mail"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minlength: [6, "Please provide a password with min lenght 6"],
        required: [true, "Please provide a password"],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
});


/* 

    This function for reset password. We need a expire time and random string for validation. Sending expire time and random string to User model.

*/

UserSchema.methods.generateResetPasswordTokenFromUser = function () {

    const {RESET_PASSWORD_EXPIRE} = process.env;

    const randomHexString = crypto.randomBytes(15).toString("hex");

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex");

    this.resetPasswordToken = resetPasswordToken;

    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;

};


/* 

        If who want to use JWT, they need to begin with adding a method for model. This method include the jwt generating codes.
    There is must be a "payload" for creating a generator. Payload's feature is getting fields of what model we used. From otherwide, we
    need a secret key and expire object. They are need to be defined in config.env because they are global variables.

*/

UserSchema.methods.generateJwtFromUser = function () {

    // Getting necessary variables...

    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;


    const payload = {

        id: this._id,

        name: this.name

    };

    // Before creating a token, there is .sign(x,y,z) function should be defined. This function running synchronous
    // and arguments must be in order. "payload" for x, "secret key" for y, "Options" for z. We need to be careful for 
    // while defining a field name in option because its have a rules.

    const token = jwt.sign(payload, JWT_SECRET_KEY, {

        expiresIn: JWT_EXPIRE

    });


    // After our tokens is ready, we can return it.

    return token;

};

/* 

We using pre hooks for, before saving schema. We can think it like a middleware.
There is must to use callback function for our interlayer process. First parameters "save", its mean
we using this layer for saving. 

this.isModified(x) function, if "x" has been changed its return true, otherwise false.  

We defining this hooks for hash a password. This is regular usage, if there is a error we sending with next() function, otherwise
this.password (UserSchema.password) will equals to hash.

there is document for usage: https://www.npmjs.com/package/bcrypt
*/

UserSchema.pre("save", function (next) {

    // if password has been not changed...

    if (!this.isModified("password")) {

        next();

    }

    // otherwise continue

    bcrypt.genSalt(10, (err, salt) => {


        if (err) next(err);


        bcrypt.hash(this.password, salt, (err, hash) => {


            if (err) next(err);


            this.password = hash;

            next();


        });
    });
});

/* 

    This hook working for while a user has been delete, question should to be delete with them. 

*/

UserSchema.post("remove",async function(){

    await Question.deleteMany({
        user: this._id
    });

});



/* 

We must to export this for using .create(),...,etc. function. 

*/

module.exports = mongoose.model("User", UserSchema);

