const express = require('express');
const AdminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const adminController = new AdminController();

router.get('/stats', authMiddleware, adminOnly, adminController.getStats);
router.get('/users', authMiddleware, adminOnly, adminController.getUsers);
router.patch('/users/:id', authMiddleware, adminOnly, adminController.updateUser);

module.exports = router;
