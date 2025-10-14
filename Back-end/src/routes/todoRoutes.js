const express = require('express');
const TodoController = require('../controllers/todoController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    validateCreateTodo, 
    validateUpdateTodo, 
    validateQueryParams, 
    validateMongoId 
} = require('../middleware/validation');

const router = express.Router();
const todoController = new TodoController();

// Routes protégées pour les todos
router.post('/', authMiddleware, validateCreateTodo, todoController.createTodo);
router.get('/', authMiddleware, validateQueryParams, todoController.getTodos);
router.get('/stats', authMiddleware, todoController.getTodoStats);
router.get('/overdue', authMiddleware, todoController.getOverdueTodos);
router.get('/:id', authMiddleware, validateMongoId, todoController.getTodoById);
router.put('/:id', authMiddleware, validateUpdateTodo, todoController.updateTodo);
router.patch('/:id/toggle', authMiddleware, validateMongoId, todoController.toggleTodoComplete);
router.delete('/:id', authMiddleware, validateMongoId, todoController.deleteTodo);
router.delete('/completed/all', authMiddleware, todoController.deleteCompletedTodos);

module.exports = router;