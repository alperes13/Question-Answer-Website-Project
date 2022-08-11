
Using dotenv package for global variables in this project. 

We can receive variables as "process.env.<variableName>".

----------------------------------------------------------------------------------------------------------------------------
Lines and files.

This project consist of 5 layer, 

1- Url are going directly routers layer. Interested routers manage the request to controller layer.
E.g. if we want to create an answer, router sending this request to controller.

2- If there is a request as creating a question, data will going directly to models layer by controllers.

3- Helpers layer: There is for helper function and the external packs defined in this layer. Nodemailer for example.

4- There is middleware functions of own created. This is the layer too. Some routers must be working with only who have to
access.


----------------------------------------------------------------------------------------------------------------------------
Error Handling

Error handling is one of the important side of the project. If there is not error handling in project, response and request
could not to find target. This situation start to difficult for website.

We can find necessary document about error handling in express website.

There is 2 type error handling in express. First usage for cacthing sychronous code. If there is any error with olur
sychronous code, express can handle this.

But process is different for asynchoronous code.

If there is any problem with asynchoronous code, we must to send them with next() function. And express will be cacht them
with this way.

----------------------------------------------------------------------------------------------------------------------------

Npm packs i have to used:

expressjs - The server for handling and routing HTTP requests
jsonwebtoken - For generating JWTs used by authentication
mongoose - For modeling and mapping MongoDB data to JavaScript
slugify - For encoding titles into a URL-friendly format
bcryptjs - Hashing Password
dotenv - Zero-Dependency module that loads environment variables
multer - Node.js middleware for uploading files
nodemailer - Send e-mails from Node.js

