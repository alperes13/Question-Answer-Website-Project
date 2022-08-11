const asyncErrorWrapper = require("express-async-handler");
const { populateHelper, paginationHelper } = require("./queryMiddlewareHelpers");

/* 

    This layer for query.

*/

const answerQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {

        /* 
            Main function working with 2 paramaters. One is for model, and one is for options.
        
            Starting with pagination process. Receiving question id from url and serching inside of models collection.
        But receiving only "answerCount". There is pagination helper function. Its in center query middleware of
        sibling file. Defining 2 variables by returned data of pagination helper function. Searching data with
        that variables in collection.

            Second process is populating, sending necessary keys to populate function. And receiving populated data.

            After all of the process sending this filtered data with response.
        
        */

        // ------------------------- Pagination --------------------------

        const question_id = req.params.id;

        const arrayName = "answers";

        const total = (await model.findById(question_id))["answerCount"];

        const paginationResult = await paginationHelper(total, undefined, req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryObject = {};

        queryObject[arrayName] = { $slice: [startIndex, limit] };

        let query = model.find({ _id: question_id }, queryObject);

        // ------------------------ Populating ----------------------------

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