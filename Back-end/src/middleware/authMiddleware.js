const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Vérifier le token dans les headers Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : null;

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Token d\'accès requis' 
            });
        }

        // Vérifier le token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Vérifier que l'utilisateur existe toujours
        const user = await User.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ 
                success: false,
                message: 'Utilisateur non trouvé ou inactif' 
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token invalide' 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expiré' 
            });
        }
        
        console.error('Erreur auth middleware:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Erreur serveur lors de l\'authentification' 
        });
    }
};

// Middleware optionnel pour les routes publiques
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : null;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('password');
            if (user && user.isActive) {
                req.user = user;
                req.userId = user._id;
            }
        }
        next();
    } catch (error) {
        // En cas d'erreur, continuer sans authentification
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };