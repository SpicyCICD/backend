const UserModel = require("../../models/nodeDb/user.model");
const bcrypt = require('bcrypt');
const { Op } = require("sequelize"); // Import Sequelize operators if you're using Sequelize

const resetPassword = async (req, res) => {
    try {
        const { resetToken, password } = req.body;

        // Find user by resetPasswordToken and ensure the token hasn't expired
        const user = await UserModel.findOne({
            where: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }, // Check if the token hasn't expired
            },
        });

        if (!user) {
            return res.status(400).send("Password reset token is invalid or has expired.");
        }

        // Hash the new password with a salt round of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear resetPasswordToken and resetPasswordExpires fields
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        res.send("Password has been successfully reset.");
    } catch (error) {
        console.error("Error Reseting Password:", error);
        res.status(500).json({ message: 'Reset Password Error' });
    }
};

module.exports = resetPassword;
