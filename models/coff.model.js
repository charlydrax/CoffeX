const mongoose = require("mongoose");
// On importe un plugin qui va nous aider à gérer les valeurs unique dans notre BDD

const CommentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    img: {
        type: String, // URL de l'avatar de l'utilisateur
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Définition du Schéma : Comment nos users doivent être structurés
const coffSchema = new mongoose.Schema({
    // Le pseudo de l'utilisateur
    user: {
        type: String,
        required: false,
    },
    // Le post de l'utilisateur
    coffs: {
        type: String,
        required: true,
    },
    // La photo du post
    img: {
        type: String,
        required: false,
    },
    comments: [CommentSchema], // Liste des commentaires
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    // MongoDB va ajouter automatiquement la date de création et de modification
    timestamps: true,
});


const Coffs = mongoose.models.Coffs || mongoose.model("Coffs", coffSchema);

// export default Coffs;
module.exports = Coffs;