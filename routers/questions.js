const express = require("express");
const {askNewQuestion, getAllQuestions, getSingleQuestion} = require("../controllers/question");
const {checkQuestionExist} = require("../middlewares/database/databaseErrorhelpers");
const {getAccessToRoute} = require("../middlewares/authorization/auth");

const router = express.Router();

router.post("/ask",getAccessToRoute,askNewQuestion);
router.get("/:id",checkQuestionExist,getSingleQuestion)
router.get("/",getAllQuestions);


module.exports = router;