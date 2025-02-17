import mongoose from "mongoose";

// On importe un plugin qui va nous aider à gérer les valeurs unique dans notre BDD
import uniqueValidator from "mongoose-unique-validator";

// Définition du Schéma : Comment nos users doivent être structurés
const userSchema = new mongoose.Schema({
    // Le pseudo de l'utilisateur
    nickname: {
        type: String,
        required: true,
    },
    // L'email de l'utilisateur
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Le mot de passe de l'utilisateur
    password: {
        type: String,
        required: true,
    },
    // L'avatar de l'utilisateur
    avatar: {
        type: String,
    }
}, {
    // MongoDB va ajouter automatiquement la date de création et de modification
    timestamps: true,
});

userSchema.plugin(uniqueValidator);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;