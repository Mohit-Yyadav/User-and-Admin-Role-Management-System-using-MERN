const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASS 
    }
});

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER ,
            to: email,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

module.exports = { sendOTPEmail };