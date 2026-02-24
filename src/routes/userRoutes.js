const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/userController');

// Public routes — no token needed
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

// Protected routes — token required
router.get('/profile', auth, ctrl.getProfile);
router.patch('/profile', auth, ctrl.updateProfile);

module.exports = router;