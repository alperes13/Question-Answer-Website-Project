const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({


    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlenght: [10, "Please provide a title as least 10 characters"],
        unique: true
    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10, "Please provide a content at least 10 characters"]
    },

    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    likeCount : {
        type: Number,
        default : 0
    },
    likes: [{
        type : mongoose.Schema.ObjectId,
        ref: "User"
    }],
    answerCount: {
        type: Number,
        default : 0
    },
    answers: [{
        type: mongoose.Schema.ObjectId,
        ref: "Answer"
    }]

});

/* 

    This 2 function working for saving question with slug.

*/
QuestionSchema.pre("save", function(next){
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();


});

QuestionSchema.methods.makeSlug = function(){

    return slugify(this.title,{
        replacement: '-',
        remove: /[*+~.,()'"!:@]/g,
        lower: true
    });


};

module.exports = mongoose.model("Question", QuestionSchema);