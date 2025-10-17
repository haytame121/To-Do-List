# 📝 To-Do List API

Une API REST complète pour une application de gestion de tâches avec authentification JWT, validation des données et fonctionnalités avancées.

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Authentification JWT
- Gestion des profils utilisateur
- Validation des données

### 📋 Gestion des tâches
- Création, modification et suppression de tâches
- Système de priorités (faible, moyenne, élevée)
- Dates d'échéance
- Catégorisation et tags
- Statut de completion
- Recherche et filtrage
- Pagination
- Statistiques détaillées

### 🛡️ Sécurité
- Middleware de sécurité (Helmet)
- CORS configuré
- Validation des données avec express-validator
- Gestion d'erreurs robuste
- Protection contre les injections

## 🚀 Installation et démarrage

### Prérequis
- Node.js(React,ExpressJS)(latest)
- MongoDB (v4.4+)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd todo-app

# Installer les dépendances
npm install

# Configurer l'environnement
cp config.env .env
# Éditer .env avec vos valeurs

# Démarrer MongoDB
# (Assurez-vous que MongoDB est en cours d'exécution)

# Démarrer en mode développement
npm run dev

# Ou démarrer en mode production
npm start
```

## 📚 Documentation API

Consultez [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) pour la documentation complète de l'API.

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour du profil

#### Tâches
- `GET /api/todos` - Liste des tâches (avec filtres)
- `POST /api/todos` - Créer une tâche
- `GET /api/todos/:id` - Détails d'une tâche
- `PUT /api/todos/:id` - Modifier une tâche
- `PATCH /api/todos/:id/toggle` - Basculer le statut
- `DELETE /api/todos/:id` - Supprimer une tâche
- `GET /api/todos/stats` - Statistiques
- `GET /api/todos/overdue` - Tâches en retard

## 🏗️ Architecture

```
src/
├── controllers/     # Logique métier
├── middleware/      # Middlewares (auth, validation, erreurs)
├── models/         # Modèles Mongoose
├── routes/         # Définition des routes
├── utils/          # Utilitaires
└── app.js          # Point d'entrée de l'application
```

## 🔧 Configuration

### Variables d'environnement
```env
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=5000
NODE_ENV=development
```

## 🧪 Tests

```bash
# Test de santé de l'API
curl http://localhost:5000/api/health

# Exemple d'inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## 📊 Fonctionnalités avancées

### Filtrage et tri
- Filtrage par statut, priorité, catégorie
- Recherche textuelle
- Tri par différents critères
- Pagination

### Statistiques
- Nombre total de tâches
- Taux de completion
- Tâches en retard
- Répartition par priorité et catégorie

### Validation
- Validation côté serveur
- Messages d'erreur en français
- Protection contre les données malformées

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcrypt** - Hachage des mots de passe
- **express-validator** - Validation des données
- **Helmet** - Sécurité
- **CORS** - Gestion des origines croisées

## 📝 Scripts disponibles

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement avec nodemon
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
