const UserModel = require('../../models/nodeDb/user.model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { verify } = require('hcaptcha');

const registerUser = async (req, res, next) => {
  try {
    const { email, username, password, role, reCaptchaToken } = req.body;

    // Check if email and username are unique
    const existingEmail = await UserModel.findOne({ where: { email } });
    const existingUsername = await UserModel.findOne({ where: { username } });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Verify the reCaptcha token
    const recapSecret = process.env.RECAPTCHA_SECRET; // Should come from environment variables
    const recapResponse = await verify(recapSecret, reCaptchaToken);
    if (!recapResponse.success) {
      return res.status(403).json({ message: 'reCAPTCHA validation failed' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique verification token
    const verificationToken = uuid.v4();
    const uid = uuid.v4();

    // Create user
    const user = await UserModel.create({
      uid,
      email,
      username,
      password: hashedPassword,
      userRoleId: role || 43, // Assuming 43 is the default role ID
      verificationToken,
    });

    // Generate JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Account Verification',
      html: `<p>Welcome to Our Application! Please verify your email by clicking on the following link:</p><p><a href="http://localhost:3000/verifyMail/${verificationToken}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with token
    res.json({ token, message: 'User registered successfully. Verification email sent.' });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = registerUser;
