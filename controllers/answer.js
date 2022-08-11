const Question = require("../models/Question");
const Answer = require("../models/Answer");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

// This layer controlling answer routers but this router using question router.


/* 

        This function for creating an answer. Receive question id from url, user id from request because its 
    using authorization access middleware, information from body. And creating an answer with this data.

*/

const addNewAnswer = asyncErrorWrapper(async (req, res, next) => {

    const question_id = req.params.id;
    const user_id = req.user.id;
    const information = req.body;

    const answer = await Answer.create({
        ...information,
        question: question_id,
        user: user_id
    });

    return res.status(200)
        .json({
            success: true,
            message: "Answer has been created.",
            data: answer
        });

});

/* 

        This is function for receive all of the answer by a question. Firstly using question id by url. And searching
    this id in question collection with populating answers. Define a variable with answers list by question. And returning
    response with this variable.

*/

const getAllAnswersByQuestion = asyncErrorWrapper(async (req, res, next) => {

    const question_id = req.params.id;

    const question = await Question.findById(question_id).populate("answers");

    const answers = question.answers;

    return res.status(200)
        .json({
            success: true,
            message: "All answers received by question",
            count: answers.length,
            data: answers
        });

});

/* 

        This function using for receive an answer. Firslt getting answer's id from url and searching it 
    inside of answers collection with populating process. And returning a response with answer data.

*/

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {


    const answer_id = req.params.answer_id;

    const answer = await Answer
    .findById(answer_id)
    .populate({
        path : "question",
        select : "title"
    })
    .populate({
        path : "user",
        select: "name profile_image"
    });

    return res.status(200)
        .json({
            success: true,
            message: "Answer received by question",
            data: answer
        });

});

/* 

        This function for editting an answer. Firstly receiving an id from url and informations. This id is 
    answer_id. Finding this answers with id in answer collection and updating with information.


*/

const editAnswer = asyncErrorWrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;
    const information = req.body;

    const answer = await Answer.findByIdAndUpdate(answer_id,{
        
        ...information,

    });
    

    return res.status(200)
        .json({
            success: true,
            message: "Answer update operation successful",
            data: answer
        });

});


/* 

        This function for deleting an answer. Receiving question id and answer id inside of url and removing 
    them inside of answer collection. But we need to delete it in question colellection too. Searching this answer
    id in question collection and deleting. After all of this process saving updated question.

*/

const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;
    const question_id = req.params.id;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id),1);
    question.answerCount = question.answers.length;

    await question.save();

    return res.status(200)
    .json({
        success: true,
        message: "Answer has been deleted"
    })

});

/* 

    This is function for like a answer. This is working same as like a question.

*/

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;

    const answer = await Answer.findById(answer_id);

    if(answer.likes.includes(req.user.id)){
        return next(new CustomError("You Already liked this answer",400));
    }

    answer.likes.push(req.user.id);

    await answer.save();

    res.status(200)
        .json({
            succes: true,
            message: "Like operation successful",
            data: answer
        });

});

const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;

    const answer = await Answer.findById(answer_id);

    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError("You can not undo like operation for this answer",400));
    }


    const index = answer.likes.indexOf(req.user.id);
    answer.likes.splice(index,1);

    await answer.save();

    res.status(200)
        .json({
            succes: true,
            message: "Undo like operation successful",
            data: answer
        });

});


module.exports = {
    addNewAnswer,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    undoLikeAnswer,
    likeAnswer
};