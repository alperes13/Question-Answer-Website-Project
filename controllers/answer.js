const Question = require("../models/Question");
const Answer = require("../models/Answer");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

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

const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;
    const question_id = req.params.id;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id),1);

    await question.save();

    return res.status(200)
    .json({
        success: true,
        message: "Answer has been deleted"
    })

});

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