const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

/* 

    This functions working with user router.

*/

/* 

        This function searching user id in User collections and returning user data in response. Id 
    coming from url.

*/

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const user = await User.findById(id);

    return res
        .status(200)
        .json({
            success: true,
            data: user
        });

});


/* 

        This function receive all of the users. But its returning different response its coming from user query middleware.
    middlewares/query/userQueryMiddleware

*/

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {

    return res.status(200)
    .json(res.queryResults);

});



module.exports = {
    getSingleUser,
    getAllUsers
};