const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const { validateUserInput, comparePassword } = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");
/* 

    There is we creating a function for saving users to database for who access to register api. There is need to use
schemaName.create(). And main function handling a package. Its "express-async-handler". 

    Express async handler is catching asynchoronus error for our project. 

    After database steps, in a function... We generate a token and sending to client. Thats function working with
"user" and response arguments. ---> helpers/authorization/tokenHelpers.js

*/

const register = asyncErrorWrapper(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendJwtToClient(user, res);


});

/* 

    This function for login process. There is taken 2 data from request body. Email and password. And this function
going condition for inputs. If there is not any error, continue to find that email into the database. If database password
equals to request body password, process continue to sendJwtToClient() function. ---> helpers/authorization/tokenHelpers.js

*/

const login = asyncErrorWrapper(async (req, res, next) => {


    const { email, password } = req.body;

    if (!validateUserInput(email, password)) {

        return next(new CustomError("Please check your inputs", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 400));
    }


    sendJwtToClient(user, res);


});

/* 

    This function for logout process, sending a cookie but changing expires times with now.

*/


const logout = asyncErrorWrapper(async (req, res, next) => {

    const { NODE_ENV } = process.env;

    return res

        .status(200)

        .cookie({
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            message: "Logout Successfull"
        })

});

/* 

    This function will be run in /profile request. And its returing datas. 

*/
const getUser = (req, res, next) => {

    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}

/* 

    This function for update any users in database. Its take a image from request body. And we gibing one more object
for here. This object have 2 fields. "new" and "runValidators".

*/

const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    });

    res.status(200)
        .json({
            success: true,
            message: "Image Upload Successfull",
            data: user

        });

});

/* 

    This function for reset password.

*/


const forgotPassword = asyncErrorWrapper(async (req, res, next) => {

    // Taking email by body, and finding User in database. If there is not a user as like this returning a error.

    const resetEmail = req.body.email;

    const user = await User.findOne({ email: resetEmail });

    if (!user) {
        return next(new CustomError("There is no user with that email.", 400));
    }

    // There is method by User model for random string and expire time. Check it for information. After using this method, we saving user because
    // user model will be changed.

    const resetPasswordToken = user.generateResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p> This <a href = "${resetPasswordUrl}" target = "_blank" > link </a> will expire in 1 hour </p>
    `;

    /* 
    
        Using sendMail() function. Its coming inside of helpers/libraries/sendMail().

        If there is any error, saving user reset password fields as undefined.
    
    */

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Alper Es Project, Reset Your Password",
            html: emailTemplate
        });
        return res
            .status(200)
            .json({
                success: true,
                message: "Please check your email."
            })
    } catch {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Sent", 500));
    };



});



/* 

    Receiving reset password token by url and password from body. Searching user from database with token.
If there is any user as like this changing user password and saving. Otherwise optimize User token fields as undefined.

*/

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const { resetPasswordToken } = req.query;

    const { password } = req.body;

    if (!resetPasswordToken) {
        return next(new CustomError("Please provide a valid token", 400));
    };

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomError("Invalid Token or Session Expired", 404));
    };

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res
        .status(200)
        .json({
            success: true,
            message: "Password changed."
        })

});

/* 

        This function for update user data. Receiving information from body. Searching user in database with user.id, changing with
    new information.

*/

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body;


    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true
    });

    return res.status(200)
        .json({
            success: true,
            message: "Profile updated",
            data: user
        })

});


module.exports = {
    register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails

};