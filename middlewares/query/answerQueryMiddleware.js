const asyncErrorWrapper = require("express-async-handler");
const { populateHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const answerQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {

        // pagnation

        const question_id = req.params.id;

        const arrayName = "answers";

        const total = (await model.findById(question_id))["answerCount"];

        const paginationResult = await paginationHelper(total, undefined, req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryObject = {};

        queryObject[arrayName] = { $slice: [startIndex, limit] };

        let query = model.find({ _id: question_id }, queryObject);


        // populating

        query = populateHelper(query, options.population);

        const queryResults = await query;
        
        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults
        };

        next();
    });
};



module.exports = answerQueryMiddleware;