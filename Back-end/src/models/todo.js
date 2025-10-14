const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true,
        maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value > new Date();
            },
            message: 'La date d\'échéance doit être dans le futur'
        }
    },
    category: {
        type: String,
        trim: true,
        maxlength: [50, 'La catégorie ne peut pas dépasser 50 caractères']
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Chaque tag ne peut pas dépasser 30 caractères']
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour améliorer les performances
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });
todoSchema.index({ userId: 1, priority: 1 });

// Virtual pour vérifier si la tâche est en retard
todoSchema.virtual('isOverdue').get(function() {
    return this.dueDate && this.dueDate < new Date() && !this.completed;
});

// Méthode pour marquer une tâche comme terminée
todoSchema.methods.markAsCompleted = function() {
    this.completed = true;
    return this.save();
};

// Méthode statique pour obtenir les tâches par priorité
todoSchema.statics.getByPriority = function(userId, priority) {
    return this.find({ userId, priority });
};

// Méthode statique pour obtenir les tâches en retard
todoSchema.statics.getOverdue = function(userId) {
    return this.find({ 
        userId, 
        dueDate: { $lt: new Date() }, 
        completed: false 
    });
};

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;