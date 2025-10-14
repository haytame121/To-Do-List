# API To-Do List - Documentation

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (version 4.4 ou supérieure)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp config.env .env
# Éditer le fichier .env avec vos valeurs

# Démarrer MongoDB
# (Assurez-vous que MongoDB est en cours d'exécution)

# Démarrer le serveur
npm run dev
```

## 📋 Endpoints de l'API

### Base URL
```
http://localhost:5000/api
```

### Authentification

#### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "motdepasse123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "_id": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Connexion d'un utilisateur

**Body:**
```json
{
  "username": "john_doe",
  "password": "motdepasse123"
}
```

#### GET /auth/profile
Obtenir le profil de l'utilisateur connecté

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /auth/profile
Mettre à jour le profil de l'utilisateur

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "preferences": {
    "theme": "dark",
    "language": "fr"
  }
}
```

### Tâches (Todos)

#### POST /todos
Créer une nouvelle tâche

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Faire les courses",
  "description": "Acheter du lait et du pain",
  "priority": "high",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "category": "Personnel",
  "tags": ["urgent", "maison"]
}
```

#### GET /todos
Obtenir toutes les tâches avec filtres

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `completed`: boolean (filtrer par statut)
- `priority`: string (low, medium, high)
- `category`: string
- `search`: string (recherche dans titre et description)
- `sortBy`: string (title, createdAt, updatedAt, dueDate, priority)
- `sortOrder`: string (asc, desc)
- `page`: number (pagination)
- `limit`: number (nombre d'éléments par page)

**Exemple:**
```
GET /todos?completed=false&priority=high&page=1&limit=10&sortBy=dueDate&sortOrder=asc
```

#### GET /todos/:id
Obtenir une tâche par ID

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /todos/:id
Mettre à jour une tâche

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Faire les courses (modifié)",
  "completed": true,
  "priority": "medium"
}
```

#### PATCH /todos/:id/toggle
Basculer le statut de completion d'une tâche

**Headers:**
```
Authorization: Bearer <token>
```

#### DELETE /todos/:id
Supprimer une tâche

**Headers:**
```
Authorization: Bearer <token>
```

#### DELETE /todos/completed/all
Supprimer toutes les tâches terminées

**Headers:**
```
Authorization: Bearer <token>
```

#### GET /todos/stats
Obtenir les statistiques des tâches

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTodos": 25,
    "completedTodos": 15,
    "pendingTodos": 10,
    "overdueTodos": 3,
    "completionRate": 60,
    "todosByPriority": [
      { "_id": "high", "count": 5 },
      { "_id": "medium", "count": 15 },
      { "_id": "low", "count": 5 }
    ],
    "todosByCategory": [
      { "_id": "Travail", "count": 10 },
      { "_id": "Personnel", "count": 15 }
    ]
  }
}
```

#### GET /todos/overdue
Obtenir les tâches en retard

**Headers:**
```
Authorization: Bearer <token>
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

## 📊 Codes de réponse

- `200` - Succès
- `201` - Créé avec succès
- `400` - Données invalides
- `401` - Non autorisé
- `403` - Interdit
- `404` - Non trouvé
- `500` - Erreur serveur

## 🛠️ Structure des réponses

### Succès
```json
{
  "success": true,
  "message": "Message de succès",
  "data": { ... }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [ ... ] // Détails des erreurs de validation
}
```

## 🧪 Test de l'API

### Health Check
```
GET /api/health
```

### Exemple avec curl

```bash
# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "password123"
  }'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "password123"
  }'

# Créer une tâche
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Ma première tâche",
    "description": "Description de la tâche",
    "priority": "medium"
  }'
```

## 🔧 Configuration

### Variables d'environnement

```env
# Database
MONGODB_URI=mongodb://localhost:27017/todo-app

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret
SESSION_SECRET=your_super_secret_session_key_here

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

## 📝 Notes importantes

1. **Sécurité**: Changez les secrets JWT et de session en production
2. **Validation**: Toutes les données sont validées côté serveur
3. **Pagination**: Utilisez les paramètres `page` et `limit` pour les grandes listes
4. **Filtres**: Combinez plusieurs filtres pour des requêtes précises
5. **Tokens**: Les tokens JWT expirent après 7 jours
