
const asyncErrorWrapper = require("express-async-handler");
const {searchHelper, populateHelper, questionSortHelper, paginationHelper} = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function(model,options){

    return asyncErrorWrapper(async function(req,res,next){

        // search
        let query = model.find();
        query = searchHelper("title",query,req);

        // populate
        if (options && options.population) {
            query = populateHelper(query,options.population);
        };

        // sort
        query = questionSortHelper(query,req);


        // pagination
        
        let pagination;
        const paginationResult = await paginationHelper(model,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        };

        next();
    });
};

module.exports = questionQueryMiddleware;
