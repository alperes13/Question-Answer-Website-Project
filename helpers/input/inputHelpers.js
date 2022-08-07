
const bcrypt = require("bcryptjs");

/* 

    This function for input filled condition. This function taken 2 parameters. Email and password.
If there is email and password input filled, its will return true value.

*/


const validateUserInput = (email, password) => {

    return email && password;

};

/* 

    This function return true value if password equals to hashed password.

*/

const comparePassword = (password, hashedPassword) => {

    return bcrypt.compareSync(password, hashedPassword);

};




module.exports = {
    validateUserInput,
    comparePassword
};