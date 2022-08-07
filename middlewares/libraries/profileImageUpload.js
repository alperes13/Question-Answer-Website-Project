
const multer = require("multer");

const path = require("path");


const CustomError = require("../../helpers/error/CustomError");

/*  

    "multer" package on npm will help us for uploading image in users data. But we need to use 2 function here.
First one is storage, Second one is fileFilter.



    Storage function should to start with .diskStorage(). Its taken 2 fields: destination, filename. This fields
able to using with a function, and this function taken 3 parameters. Request, File and Callback Function.

    The disk storage engine gives us full control on storing files to disk. We define a main path for a variables.
After this steps we using callback function... This function getting 2 synchoronous parameters, first parameter for
error, and second one is path of where we storaging images.

    Filename field is determine our file names. Firstly we define a variable. This variable is taken string after "/"
what string incoming. So its only doing this for which argument coming for file parameter.

    After this step, its uploading string for requst body (note: its working with user id).  



    fileFilter function is, filtering which file type user given, and we will define it.



    And after all of this steps we can use multer() function. multer() function will take this 2 function (storage, filefilter)
for arguments. But its must to be in object ({storage, filefilter}).

*/


const storage = multer.diskStorage({




    destination: function (req, file, cb) {

        const rootDir = path.dirname(require.main.filename);

        cb(null, path.join(rootDir, "/public/uploads"));

    },





    filename: function (req, file, cb) {

        const extension = file.mimetype.split("/")[1];

        req.savedProfileImage = "image_" + req.user.id + "." + extension;

        cb(null, req.savedProfileImage);

    }



});


const fileFilter = (req, file, cb) => {

    let allowedMimeType = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

    if (!allowedMimeType.includes(file.mimetype)) {

        return cb(new CustomError("Please provide a valid image file", 400), false);

    }

    return cb(null, true);

};



const profileImageUpload = multer({ storage, fileFilter });

module.exports = profileImageUpload;

