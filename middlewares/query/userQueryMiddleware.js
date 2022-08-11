const asyncErrorWrapper = require("express-async-handler");
const {searchHelper, paginationHelper} = require("./queryMiddlewareHelpers");

const userQueryMiddleware = function(model,options){

    /* 
    
        This function returing filtered data for response. 
    
    */

    return asyncErrorWrapper(async function(req,res,next){


    /* 

            Firstly we starting with finding query in model collection. Using search helper function and
        defining incoming data to variable.

            Second process is pagination this data. Firstly defining a total variable with count documents and
        defining one more variable for paginated data. Using this total variable as a argument for pagination helper
        function.

            After all of this process sending data to response.

    */

        let query = model.find();

        // --------------------------------------------------- Searching

        query = searchHelper("name",query,req);

        // --------------------------------------------------- Pagination

        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query.find();

        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination : pagination,
            data: queryResults
        };
        
        next();
    });
};



module.exports = userQueryMiddleware;