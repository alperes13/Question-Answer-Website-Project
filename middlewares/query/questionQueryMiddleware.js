
const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, populateHelper, questionSortHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {

        /* 
        
            Starting with finding query in model. Using search helper function for filtered data.

            Second process is populating. If there is options for population, this process will be perform.

            Third process is sorting this datas.

                And pagination process. Receiving all of documents for defining a variable. And using this
            variable as argument for pagination helper function. This function returing a object. 

            After all of this process, sending to response this object.
        
        */

        let query = model.find();

        // --------------------------------------------------- Searching

        query = searchHelper("title", query, req);

        // --------------------------------------------------- Populating
        if (options && options.population) {
            query = populateHelper(query, options.population);
        };

        // --------------------------------------------------- Sorting
        query = questionSortHelper(query, req);

        // --------------------------------------------------- Pagination

        let pagination;

        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total, query, req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        };

        next();
    });
};

module.exports = questionQueryMiddleware;
