
/* 

    We can use document for how to save jwt into cookies: https://expressjs.com/en/4x/api.html#res.cookie

    We need to create a function for cookies sending, and this function should to return .json() and .status(). 
Because we always use this function on controllers/auth. And this is will be global response function for registering.

    We'll using token generate method from incoming argument. After this process we will return .cookie(x,y,z) response.
name of token for x, created token for y, options for z.

    There is we used some variables from config.env. There is defined some options as httpOnly, secure, expired; we can find
more in documents.

    After all of this steps we can return .json() response.

*/



const sendJwtToClient = (user, response) => {

    const token = user.generateJwtFromUser();


    const { JWT_COOKIE, NODE_ENV } = process.env;


    return response


        .status(200)



        .cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
            secure: NODE_ENV === "development" ? false : true
        })



        .json({
            success: true,
            access_token: token,
            data: {
                name: user.name,
                email: user.email
            }
        });






};



const isTokenIncluded = (req) => {

    // If there is a token and starting with "Bearer:" true value will be return. Otherwise its will return error.

    return (req.headers.authorization && req.headers.authorization.startsWith("Bearer:"));
}








const getAccessTokenFromHeader = (req) => {

    const authorization = req.headers.authorization;
    const access_token = authorization.split(":")[1];
    return access_token;
}








module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
}