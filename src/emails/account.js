const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, name) => {
    sgMail
        .send({
            to: email,
            from: 'abiodunebun1204@gmail.com',
            subject: 'Thanks for joining in!',
            text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        })
        .then(() => {
            console.log('Email sent success');
        })
        .catch((error) => {
            console.log('error', error);
        });
};
const sendCancelationEmail = (email, name) => {
    sgMail
        .send({
            to: email,
            from: 'abiodunebun1204@gmail.com',
            subject: 'Sorry to see you go.',
            text: `We would love to see you back, ${name}.`,
        })
        .then(() => {
            console.log('Delete user email success');
        })
        .catch((error) => {
            console.log('error', error);
        });
};
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
};