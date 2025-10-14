const { validationResult } = require('express-validator');
const Todo = require('../models/todo');

class TodoController {
    // Créer une nouvelle tâche
    async createTodo(req, res) {
        try {
            // Vérifier les erreurs de validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: errors.array()
                });
            }

            const { title, description, priority, dueDate, category, tags } = req.body;
            
            const todo = new Todo({
                title,
                description,
                priority: priority || 'medium',
                dueDate: dueDate ? new Date(dueDate) : undefined,
                category,
                tags: tags || [],
                userId: req.userId
            });

            await todo.save();

            res.status(201).json({
                success: true,
                message: 'Tâche créée avec succès',
                data: todo
            });
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la création de la tâche',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Obtenir toutes les tâches avec filtres et tri
    async getTodos(req, res) {
        try {
            const { 
                completed, 
                priority, 
                category, 
                sortBy = 'createdAt', 
                sortOrder = 'desc',
                page = 1,
                limit = 10,
                search
            } = req.query;

            // Construire le filtre
            const filter = { userId: req.userId };
            
            if (completed !== undefined) {
                filter.completed = completed === 'true';
            }
            
            if (priority) {
                filter.priority = priority;
            }
            
            if (category) {
                filter.category = category;
            }
            
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Construire l'option de tri
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const todos = await Todo.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Todo.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: {
                    todos,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération des tâches'
            });
        }
    }

    // Obtenir une tâche par ID
    async getTodoById(req, res) {
        try {
            const { id } = req.params;
            
            const todo = await Todo.findOne({ _id: id, userId: req.userId });
            
            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tâche non trouvée'
                });
            }

            res.status(200).json({
                success: true,
                data: todo
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la tâche:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération de la tâche'
            });
        }
    }

    // Mettre à jour une tâche
    async updateTodo(req, res) {
        try {
            // Vérifier les erreurs de validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const updates = req.body;

            // Convertir la date d'échéance si fournie
            if (updates.dueDate) {
                updates.dueDate = new Date(updates.dueDate);
            }

            const todo = await Todo.findOneAndUpdate(
                { _id: id, userId: req.userId },
                updates,
                { new: true, runValidators: true }
            );

            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tâche non trouvée'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Tâche mise à jour avec succès',
                data: todo
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la mise à jour de la tâche',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Marquer une tâche comme terminée
    async toggleTodoComplete(req, res) {
        try {
            const { id } = req.params;
            
            const todo = await Todo.findOne({ _id: id, userId: req.userId });
            
            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tâche non trouvée'
                });
            }

            todo.completed = !todo.completed;
            await todo.save();

            res.status(200).json({
                success: true,
                message: `Tâche ${todo.completed ? 'marquée comme terminée' : 'marquée comme non terminée'}`,
                data: todo
            });
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors du changement de statut'
            });
        }
    }

    // Supprimer une tâche
    async deleteTodo(req, res) {
        try {
            const { id } = req.params;
            
            const todo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });
            
            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tâche non trouvée'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Tâche supprimée avec succès'
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la suppression de la tâche'
            });
        }
    }

    // Supprimer toutes les tâches terminées
    async deleteCompletedTodos(req, res) {
        try {
            const result = await Todo.deleteMany({ 
                userId: req.userId, 
                completed: true 
            });

            res.status(200).json({
                success: true,
                message: `${result.deletedCount} tâche(s) terminée(s) supprimée(s)`,
                data: { deletedCount: result.deletedCount }
            });
        } catch (error) {
            console.error('Erreur lors de la suppression des tâches terminées:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la suppression des tâches terminées'
            });
        }
    }

    // Obtenir les statistiques des tâches
    async getTodoStats(req, res) {
        try {
            const userId = req.userId;
            
            const [
                totalTodos,
                completedTodos,
                overdueTodos,
                todosByPriority,
                todosByCategory
            ] = await Promise.all([
                Todo.countDocuments({ userId }),
                Todo.countDocuments({ userId, completed: true }),
                Todo.countDocuments({ 
                    userId, 
                    dueDate: { $lt: new Date() }, 
                    completed: false 
                }),
                Todo.aggregate([
                    { $match: { userId } },
                    { $group: { _id: '$priority', count: { $sum: 1 } } }
                ]),
                Todo.aggregate([
                    { $match: { userId, category: { $exists: true, $ne: null } } },
                    { $group: { _id: '$category', count: { $sum: 1 } } }
                ])
            ]);

            const pendingTodos = totalTodos - completedTodos;
            const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

            res.status(200).json({
                success: true,
                data: {
                    totalTodos,
                    completedTodos,
                    pendingTodos,
                    overdueTodos,
                    completionRate,
                    todosByPriority,
                    todosByCategory
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération des statistiques'
            });
        }
    }

    // Obtenir les tâches en retard
    async getOverdueTodos(req, res) {
        try {
            const overdueTodos = await Todo.getOverdue(req.userId);
            
            res.status(200).json({
                success: true,
                data: overdueTodos
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches en retard:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération des tâches en retard'
            });
        }
    }
}

module.exports = TodoController;