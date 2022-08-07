const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

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
        })

});

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

    const questions = await Question.find();

    res.status(200)
        .json({
            success: true,
            data: questions,
            message: "All questions has been received"
        })

});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const question = await Question.findById(id);

    console.log(question);

    res.status(200)
        .json({
            succes: true,
            data: question,
            message: "A question has been received"
        })

});

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

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    await Question.findByIdAndDelete(id);

    res.status(200)
        .json({
            succes: true,
            message: "A question has been deleted"
        });

});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const question = await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("You Already liked this question",400));
    }

    question.likes.push(req.user.id);

    await question.save();

    res.status(200)
        .json({
            succes: true,
            message: "Like operation successful",
            data: question
        });

});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const question = await Question.findById(id);

    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("You can not undo like operation for this Question",400));
    };


    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index,1);

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