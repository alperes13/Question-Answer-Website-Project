
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers");
const expressAsyncHandler = require("express-async-handler");


/* 

    Sometimes we need to set restrict for some routers. E.g. Unauthorization or token expired users should not acsess 
for that routers. We can get help from middlewares. If there is a condition for tokens, request cant acsess to routers.


    Firstly there is should be a function and that should to return a next() because of this is middleware. And this strategy
should to follow: 

    -First steps, we need to control that token. if there is a problem, we can return error with CustomError class
of we created earlier.

    -Second step, if there is not a problem, we can use .verify(x,y,z(z2,z3)) function. Name for x, secret key for y.
z is a callback function, its get 2 arguments. z2 for errors, z3 for decoded token.

---

    In tis situation, if this function do not giving any error, its can continue with next() and middleware can be correct.
But if this error has a true value, we should send this error to "express" with next("error") function.

*/

const getAccessToRoute = (req, res, next) => {

    // Getting some variables in config.env

    const { JWT_SECRET_KEY } = process.env;



    // This function controlling is there a tokens or not. ---> /helpers/authorization/tokenHelpers.js

    if (!isTokenIncluded(req)) {
        return next(new CustomError("You are not authorized to access this router", 401));
    }




    // If there is not any error, we can get token with this funtion. ---> /helpers/authorization/tokenHelpers.js

    const accessToken = getAccessTokenFromHeader(req);



    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {

        if (err) {
            return next(new CustomError("You are not authorized to access", 401));
        }


        req.user = {
            id : decoded.id,
            name : decoded.name
        }

        
        next();
    });



};

    /* 
    
        This function query to id for role. 
    
    */

const getAdminAccess = asyncErrorWrapper(async (req,res,next) => {

    const {id} = req.user;

    const user = await User.findById(id);

    if (user.role !== "admin"){
        return next(new CustomError("Only admins can access this route",403));
    }

    next();

});

/* 

    This function query to id for question owner. Because only owner can edit or delete his question.

*/

const getQuestionOwnerAccess = asyncErrorWrapper(async (req,res,next) => {

    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if(question.user != userId){
        return next(new CustomError("Only owner can handle this operation",403));
    }

    next();

});

/* 

    This function query to id for answer owner. Because only owner can edit or delete his answer.

*/

const getAnswerOwnerAccess = asyncErrorWrapper(async (req,res,next) => {

    const userId = req.user.id;
    const answer_id = req.params.answer_id;

    const answer = await Answer.findById(answer_id);

    if(answer.user != userId){
        return next(new CustomError("Only owner can handle this operation",403));
    }

    next();

});

// Exports this middlewares for using in routers...

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
};