const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const askNewQuestion = asyncErrorWrapper(async(req,res,next) => {

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

const getAllQuestions = asyncErrorWrapper(async(req,res,next) => {

    const questions = await Question.find();

    res.status(200)
    .json({
        success: true,
        data: questions,
        message: "All questions has been received"
    })

});

const getSingleQuestion = asyncErrorWrapper(async(req,res,next) => {

    const {id} = req.params;

    const question = await Question.findById(id);
    
    console.log(question);
    
    res.status(200)
    .json({
        succes: true,
        data: question,
        message: "A question has been received"
    })

});


module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion
};