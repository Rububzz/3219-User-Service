const usersvc = require('../services/userService');

const register = async (req, res, next) => {
    try {
        const user = await usersvc.registerUser(req.body);
        res.status(201).json({ user})
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
}

const login = async (req, res, next) => {
    try {
        const result = await usersvc.loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
}

const getProfile = async (req, res) => {
  try {
    const user = await usersvc.getUserById(req.user.userId);
    res.json({ user });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await usersvc.updateUser(req.user.userId, req.body);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };