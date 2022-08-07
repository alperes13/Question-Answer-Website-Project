
const CustomError = require("../../helpers/error/CustomError");

/* 

    There is a middleware function for catching error. This function have 4 parameters. Error, Request, Repsonse, Next.
Firstly this function will be run, if there some problems in access to request. Its can be network, token, database, .etc
all errors. This error coming with our CustomError class standards. We handling usual errors here and returning a response
about that situation.


*/


const customErrorHandler = (err, req, res, next) => {

    let customError = err;

    console.log(err);
    if (customError.name === "CastError") {
        customError = new CustomError("Please provide a valid id");
    }
    if (customError.name === "SyntaxError") {
        customError = new CustomError("Unexpected Syntax", 400);
    }

    if (customError.name === "ValidationError") {
        customError = new CustomError(err.message, 400);
    }

    if (err.code === 11000) {
        customError = new CustomError("Duplicate Key Found : This mail already taken.", 400);
    }


    res
        .status(customError.status || 500)
        .json({
            success: false,
            message: customError.message
        });

};

module.exports = customErrorHandler;