const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { use } = require("../routers");

// This control layer includes admin operations, but this functions using a middleware for admin authorization.


// blockUser() function for blocking a user

const blockUser = asyncErrorWrapper(async (req, res, next) => {


/* 

    Getting user id from request and searcgin it in database. If that user isn't blocked then block and save.

    After all of process function returning a response.

*/

    const {id} = req.params;

    const user = await User.findById(id);

    user.blocked = !user.blocked;

    await user.save();

    return res.status(200)
    .json({
        sucess: true,
        message : "Block/Unblock Successfull"
    });

});

// this function delete a user from database

const deleteUser = asyncErrorWrapper(async (req, res, next) => {

    const {id} = req.params;

    const user = await User.findById(id);

    await user.remove();

    return res.status(200)
    .json({
        success: true,
        message: "Delete Operation Successful"
    });

});


module.exports = {
    blockUser,
    deleteUser
}