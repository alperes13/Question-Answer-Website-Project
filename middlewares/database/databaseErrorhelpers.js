const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

/* 

    This middleware function for query to user for registered or not.

*/

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(new CustomError("There is no such user with that id", 400));
    };

    next();


});

/* 

    This function query to question for is it there or not.

*/

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {

    const question_id = req.params.id || req.params.question_id;

    const question = await Question.findById(question_id);

    if (!question) {
        return next(new CustomError("There is no such question with that id", 400));
    };

    next();


});

/* 

    This function query to answer for database.

*/

const checkAnswerExist = asyncErrorWrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;
    const question_id = req.params.id;

    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    });

    if (!answer) {
        return next(new CustomError("There is no such answer with that id", 400));
    };

    next();


});

module.exports = {
    checkUserExist,
    checkQuestionExist,
    checkAnswerExist
};