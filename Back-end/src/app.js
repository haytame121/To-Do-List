require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import des middlewares
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware de sécurité
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['http://localhost:2000', 'http://localhost:3001']
        : ['http://localhost:2000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuration des sessions (pour compatibilité avec l'ancien système)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    }
}));

// Route de test
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API To-Do List fonctionne correctement',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);

// Redirections pour compatibilité (routes raccourcies)
app.post('/register', (req, res) => {
    res.redirect(307, '/api/auth/register');
});

app.post('/login', (req, res) => {
    res.redirect(307, '/api/auth/login');
});

app.get('/profile', (req, res) => {
    res.redirect(301, '/api/auth/profile');
});

app.put('/profile', (req, res) => {
    res.redirect(307, '/api/auth/profile');
});

// Middleware de logging pour le développement (après les routes)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion d'erreurs global
app.use(errorHandler);

// Configuration Mongoose pour éviter les warnings
mongoose.set('strictQuery', false);

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connecté avec succès');
})
.catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
    console.error('❌ Erreur non capturée:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Promesse rejetée non gérée:', err);
    process.exit(1);
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 Environnement: ${process.env.NODE_ENV}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu. Arrêt gracieux...');
    server.close(() => {
        console.log('✅ Serveur arrêté');
        mongoose.connection.close(false, () => {
            console.log('✅ Connexion MongoDB fermée');
            process.exit(0);
        });
    });
});

module.exports = app;