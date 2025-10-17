const User = require('../models/user');
const Todo = require('../models/todo');

class AdminController {
    async getStats(req, res) {
        try {
            const [usersCount, activeUsers, todosCount, completedTodos] = await Promise.all([
                User.countDocuments({}),
                User.countDocuments({ isActive: true }),
                Todo.countDocuments({}),
                Todo.countDocuments({ completed: true })
            ]);

            res.status(200).json({
                success: true,
                data: {
                    usersCount,
                    activeUsers,
                    todosCount,
                    completedTodos,
                    completionRate: todosCount > 0 ? Math.round((completedTodos / todosCount) * 100) : 0
                }
            });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(100);
            res.status(200).json({ success: true, data: users });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { role, isActive } = req.body;
            const updates = {};
            if (role) updates.role = role;
            if (typeof isActive === 'boolean') updates.isActive = isActive;

            const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
            if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
            res.status(200).json({ success: true, data: user });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
}

module.exports = AdminController;
