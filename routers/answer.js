const express = require("express");
const { getAccessToRoute, getAnswerOwnerAccess } = require("../middlewares/authorization/auth");
const { addNewAnswer, getAllAnswersByQuestion, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, undoLikeAnswer } = require("../controllers/answer");
const { checkAnswerExist } = require("../middlewares/database/databaseErrorhelpers");

const router = express.Router({ mergeParams: true });

router.get("/", getAllAnswersByQuestion);
router.get("/:answer_id", checkAnswerExist, getSingleAnswer);
router.get("/:answer_id/like", [checkAnswerExist,getAccessToRoute], likeAnswer);
router.get("/:answer_id/undo_like", [checkAnswerExist,getAccessToRoute], undoLikeAnswer);
router.post("/", getAccessToRoute, addNewAnswer);
router.put("/:answer_id/edit", [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer)
router.delete("/:answer_id/delete", [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer)

module.exports = router;