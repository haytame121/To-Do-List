const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

class AuthController {
    // Inscription d'un nouvel utilisateur
    async registerUser(req, res) {
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

            const { username, email, password, firstName, lastName } = req.body;

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.username === username 
                        ? 'Ce nom d\'utilisateur est déjà utilisé'
                        : 'Cette adresse email est déjà utilisée'
                });
            }

            // Créer le nouvel utilisateur
            const newUser = new User({
                username,
                email,
                password,
                firstName,
                lastName
            });

            await newUser.save();

            // Générer le token
            const token = jwt.sign(
                { userId: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Mettre à jour la dernière connexion
            await newUser.updateLastLogin();

            res.status(201).json({
                success: true,
                message: 'Inscription réussie',
                data: {
                    user: newUser,
                    token
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de l\'inscription',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Connexion d'un utilisateur
    async loginUser(req, res) {
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

            const { username, password } = req.body;

            // Trouver l'utilisateur par username ou email
            const user = await User.findOne({
                $or: [{ username }, { email: username }]
            });

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    success: false,
                    message: 'Nom d\'utilisateur ou mot de passe incorrect'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            // Générer le token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Mettre à jour la dernière connexion
            await user.updateLastLogin();

            res.status(200).json({
                success: true,
                message: 'Connexion réussie',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la connexion',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Obtenir le profil de l'utilisateur connecté
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.userId).select('-password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Obtenir les statistiques de l'utilisateur
            const stats = await user.getStats();

            res.status(200).json({
                success: true,
                data: {
                    user,
                    stats
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération du profil'
            });
        }
    }

    // Mettre à jour le profil de l'utilisateur
    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: errors.array()
                });
            }

            const { firstName, lastName, email, preferences } = req.body;
            const updateData = {};

            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (email !== undefined) updateData.email = email;
            if (preferences !== undefined) updateData.preferences = preferences;

            const user = await User.findByIdAndUpdate(
                req.userId,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: { user }
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la mise à jour du profil'
            });
        }
    }

    // Déconnexion (côté client principalement)
    logoutUser(req, res) {
        res.status(200).json({
            success: true,
            message: 'Déconnexion réussie'
        });
    }

    // Vérifier si le token est valide
    async verifyToken(req, res) {
        try {
            const user = await User.findById(req.userId).select('-password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Token valide',
                data: { user }
            });
        } catch (error) {
            console.error('Erreur lors de la vérification du token:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la vérification du token'
            });
        }
    }
}

module.exports = AuthController;