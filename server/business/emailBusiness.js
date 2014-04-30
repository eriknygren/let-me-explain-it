var nodeMailer = require("nodemailer");
var config = require("../config");

var transport = nodeMailer.createTransport("SMTP", {
    service: "Gmail",
    auth:
    {
        user: config.GMAIL_USERNAME,
        pass: config.GMAIL_PASSWORD
    }
});

exports.sendForgotPasswordEmail = function(recipient, newPassword, callback)
{
    var bodyText = "Hello, your new password is: " + newPassword +
        ". Please log in with this password once and go to your user settings page and change it to something more memorable."

    var mailOptions = {
        from: "noreply - Let Me Explain It",
        to: recipient,
        subject: "Your new Let Me Explain It password",
        text: bodyText,
        html: "<p>"+ bodyText + "</p>"
    }

    transport.sendMail(mailOptions, function(error, response)
    {
        if(error)
        {
            console.log(error);
            return callback(error);
        }

        console.log("Message sent: " + response.message);
        return callback(null);

    });
}