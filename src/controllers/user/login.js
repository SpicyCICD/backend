const UserModel = require('../../models/nodeDb/user.model');
const bcrypt = require('bcrypt');
const createToken = require('../../utils/createToken');

const login = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Log request body

    // Extract username, email, and password from request body
    const { username, email, password } = req.body;

    // Check if either email or username is provided
    if (!username && !email) {
      return res.status(400).json({ message: 'Please provide username or email' });
    }

    // Find user by email or username
    let user;
    if (username) {
      user = await UserModel.findOne({ where: { username } });
    } else {
      user = await UserModel.findOne({ where: { email } });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is disabled
    if (user.disable) {
      return res.status(400).json({ message: 'User is disabled' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    
    // Create token and update user session
    const userDetails = {
      uid: user.uid,
      role: user.userRole
    };
    const { token, expiry } = await createToken(userDetails);
    await UserModel.update({ sessionId: token, expiry: new Date(expiry * 1000) }, { where: { uid: user.uid } });

    // Login successful
    res.status(200).json({
      message: 'Login successful',
      data: {
        uid: user.uid,
        token,
        role: user.userRole
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

module.exports = login;
