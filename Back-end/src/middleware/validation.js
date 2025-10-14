const { body, param, query } = require('express-validator');

// Validation pour l'inscription
const validateRegister = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
    
    body('email')
        .isEmail()
        .withMessage('Veuillez entrer un email valide')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    
    body('firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Le prénom ne peut pas dépasser 50 caractères')
        .trim(),
    
    body('lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Le nom ne peut pas dépasser 50 caractères')
        .trim()
];

// Validation pour la connexion
const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Le nom d\'utilisateur ou l\'email est requis')
        .trim(),
    
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

// Validation pour la création d'une tâche
const validateCreateTodo = [
    body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Le titre doit contenir entre 1 et 100 caractères')
        .trim(),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La description ne peut pas dépasser 500 caractères')
        .trim(),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('La priorité doit être low, medium ou high'),
    
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('La date d\'échéance doit être une date valide')
        .custom((value) => {
            if (value && new Date(value) <= new Date()) {
                throw new Error('La date d\'échéance doit être dans le futur');
            }
            return true;
        }),
    
    body('category')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La catégorie ne peut pas dépasser 50 caractères')
        .trim(),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Les tags doivent être un tableau'),
    
    body('tags.*')
        .optional()
        .isLength({ max: 30 })
        .withMessage('Chaque tag ne peut pas dépasser 30 caractères')
        .trim()
];

// Validation pour la mise à jour d'une tâche
const validateUpdateTodo = [
    param('id')
        .isMongoId()
        .withMessage('ID de tâche invalide'),
    
    body('title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Le titre doit contenir entre 1 et 100 caractères')
        .trim(),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La description ne peut pas dépasser 500 caractères')
        .trim(),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('La priorité doit être low, medium ou high'),
    
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('La date d\'échéance doit être une date valide'),
    
    body('category')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La catégorie ne peut pas dépasser 50 caractères')
        .trim(),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Les tags doivent être un tableau'),
    
    body('tags.*')
        .optional()
        .isLength({ max: 30 })
        .withMessage('Chaque tag ne peut pas dépasser 30 caractères')
        .trim(),
    
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Le statut de completion doit être un booléen')
];

// Validation pour les paramètres de requête
const validateQueryParams = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La page doit être un nombre entier positif'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('La limite doit être un nombre entre 1 et 100'),
    
    query('sortBy')
        .optional()
        .isIn(['title', 'createdAt', 'updatedAt', 'dueDate', 'priority'])
        .withMessage('Le tri doit être par title, createdAt, updatedAt, dueDate ou priority'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('L\'ordre de tri doit être asc ou desc'),
    
    query('completed')
        .optional()
        .isBoolean()
        .withMessage('Le filtre completed doit être un booléen'),
    
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('La priorité doit être low, medium ou high'),
    
    query('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La recherche ne peut pas dépasser 100 caractères')
        .trim()
];

// Validation pour l'ID MongoDB
const validateMongoId = [
    param('id')
        .isMongoId()
        .withMessage('ID invalide')
];

// Validation pour la mise à jour du profil
const validateUpdateProfile = [
    body('firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Le prénom ne peut pas dépasser 50 caractères')
        .trim(),
    
    body('lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Le nom ne peut pas dépasser 50 caractères')
        .trim(),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Veuillez entrer un email valide')
        .normalizeEmail(),
    
    body('preferences.theme')
        .optional()
        .isIn(['light', 'dark'])
        .withMessage('Le thème doit être light ou dark'),
    
    body('preferences.language')
        .optional()
        .isIn(['fr', 'en'])
        .withMessage('La langue doit être fr ou en'),
    
    body('preferences.notifications.email')
        .optional()
        .isBoolean()
        .withMessage('La notification email doit être un booléen'),
    
    body('preferences.notifications.push')
        .optional()
        .isBoolean()
        .withMessage('La notification push doit être un booléen')
];

module.exports = {
    validateRegister,
    validateLogin,
    validateCreateTodo,
    validateUpdateTodo,
    validateQueryParams,
    validateMongoId,
    validateUpdateProfile
};
