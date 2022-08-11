const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

/* 

    This control layer for question routers.

*/


/* 

        This function creating a new question. Receiving informaions by body and user id by request. We can find user id in request because
    this router using a middleware for authorization access. And this middleware sending user id to request. 

*/

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {

    const information = req.body;
    const question = await Question.create({

        ...information,
        user: req.user.id
    });

    res.status(200)
        .json({
            success: true,
            data: question,
            message: "Question initialize has successful"
        });

});

/* 

    This function for receiving all the questions. But its returning different response, u can find it inside of middlewares/query/questionQueryMiddleware

*/

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

    return res
    .status(200)
    .json(res.queryResults);

});

/* 

    This function for receiving only a question. But its returning different response, u can find it inside of middlewares/query/answerQueryMiddleware

*/

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {

    res.status(200)
        .json(res.queryResults);

});

/* 

    This function for edit a question. Getting a question id from url, and information from body. Searching
    this id in Question collection and update data with information which id is there. 

*/

const editQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;
    const { title, content } = req.body;

    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();

    res.status(200)
        .json({
            succes: true,
            data: question,
            message: "A question has been edited"
        });

});


/* 

    Deleting a question. Getting id in url, and delete it in collection.

*/

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    await Question.findByIdAndDelete(id);

    res.status(200)
        .json({
            succes: true,
            message: "A question has been deleted"
        });

});

/* 

        This is for like a question. Getting id in url and serching it in collection. If user already like that question, 
    returning a error. Otherwise if is not, pushing user id to which model we have and updating like count. After all of this
    process saving the question.

*/

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)) {
        return next(new CustomError("You Already liked this question", 400));
    }

    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;

    await question.save();

    res.status(200)
        .json({
            succes: true,
            message: "Like operation successful",
            data: question
        });

});


/* 

        This is for undo like a question. If question like list isn't include user id, then throwing a error. 
    Otherwise getting user id index inside of likes and deleting. Finally, updating like count and saving question.


*/

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError("You can not undo like operation for this Question", 400));
    };


    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index, 1);
    question.likeCount = question.likes.length;

    await question.save();

    res.status(200)
        .json({
            succes: true,
            message: "Undo like operation successful",
            data: question
        });

});

module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};