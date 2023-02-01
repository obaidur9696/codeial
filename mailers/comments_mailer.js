const nodeMailer = require('../config/nodemailer');

// This is a function that send a mail.
//This is another way to exporting a method.
exports.newComment = (comment) => {
    // console.log('Inside newComment mailer', comment);
    let htmlString = nodeMailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs')

    nodeMailer.transporter.sendMail({
        from: 'obaidur9696@gmail.com',
        to: comment.user.email,
        subject: "new comment published!",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail.', err)
            return;
        }
        console.log('message sent ', info)
        return;
    })
}