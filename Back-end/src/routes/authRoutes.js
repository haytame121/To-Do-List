const express = require('express');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    validateRegister, 
    validateLogin, 
    validateUpdateProfile 
} = require('../middleware/validation');

const router = express.Router();
const authController = new AuthController();

// Routes publiques
router.post('/register', validateRegister, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);

// Routes protégées
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, validateUpdateProfile, authController.updateProfile);
router.get('/verify', authMiddleware, authController.verifyToken);
router.post('/logout', authMiddleware, authController.logoutUser);

module.exports = router;