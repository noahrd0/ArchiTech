const User = require('../models/userModel');

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users', { users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};