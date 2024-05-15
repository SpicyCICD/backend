const UserModel = require('../../models/nodeDb/user.model');

const logout = async (req, res, next) => {
    try {
        // Extract user ID from request
        const userId = req.body.userId; // Assuming you send the userId in the request body

        // Update the user's session ID and expiry to invalidate the current session
        await UserModel.update({ sessionId: null, expiry: null }, { where: { id: userId } });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = logout;
