const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendSalesAlert = async (subject, text, receiverEmail) => {
    try {
        await transporter.sendMail({
            from: `"Sales Dashboard" <${process.env.EMAIL_USER}>`,
            to: receiverEmail,
            subject,
            text
        });
        console.log(`📬 Email sent to ${receiverEmail}`);
    } catch (err) {
        console.error('❌ Email failed:', err);
    }
};

module.exports = { sendSalesAlert };
