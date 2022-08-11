const nodemailer = require("nodemailer");

/* 

        This function for sending email to user. Using a nodemailer function here as createTransport(). This function taken a argument as object.
    Host, port, auth. 
    
    After creating a transport using sendMail() function. And logging console to message.

*/

const sendEmail = async(mailOptions) => {

    let transporter = nodemailer.createTransport({

        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASS 
        }

    });

    let info = await transporter.sendMail(mailOptions);
    console.log(`Message Sent : ${info.messageId}`);

};

module.exports = sendEmail;