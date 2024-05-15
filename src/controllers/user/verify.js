const UserModel = require('../../models/nodeDb/user.model');

const verify = async (req, res, next) => {
    const { verificationToken } = req.params;
    console.log('verification file')
    try {
      // Find user by verificationToken
      const user = await UserModel.findOne({ where: { verificationToken } });

      if (!user) {
        return res.status(404).json({ message: 'User not found or invalid token' });
      }

      await user.update({
        isEmailVerified: true // Ensure this aligns with your schema; some databases may expect true/false instead of 1/0
      });

      // Optionally, redirect the user or send a successful response
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = verify;
