const UserModel = require("../../models/nodeDb/user.model");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists for the given email
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Generate a reset token and its expiry
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Update the user model with the reset token and its expiry
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // Create a reset password link
    // Adjust the URL to your frontend route for resetting passwords
    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetUrl}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.send('Password reset link has been sent to your email.');

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Error in sending password reset email.");
  }
};

module.exports = forgotPassword;
