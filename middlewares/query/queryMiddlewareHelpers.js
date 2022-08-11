
/* 

    They are center query layer functions.

*/

/* 

        Search helper function is finding data with what key coming from parameter. If there is a search 
    query inside of url. Receive this query key and field for defining a variable. After all of this
    process searching this variable in query.

*/

const searchHelper = (searchKey, query, req) => {

    if (req.query.search) {
        const searchObject = {};

        const regex = new RegExp(req.query.search, "i");
        searchObject[searchKey] = regex;

        return query = query.where(searchObject);
    }

    return query;
};

/* 

    This is for population. Function returing populated data by incoming arguments.

*/

const populateHelper = (query, population) => {

    return query.populate(population);

};

/* 

    This is for sorting. Its getting a key from url and returned sorted data.

*/

const questionSortHelper = (query, req) => {

    const sortKey = req.query.sortBy;

    if (sortKey === "most-answered") {

        return query = query.sort("-answerCount")
    };

    if (sortKey === "most-liked") {
        return query = query.sort("-likeCount");
    };

    return query.sort("-createdAt");

};

/* 

        This is for pagination. Receiving 2 argument from url as page and limit. Limit shoing us how many
    data will be inside of response. Page information for where we will start to show. They are defining
    2 variables as startIndex and endIndex. There is little algorithm.

*/

const paginationHelper = async (totalDocuments, query, req) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = totalDocuments;

    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit: limit
        };
    };

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        };
    };

    return {
        query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex,
        limit
    };


};

module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
};