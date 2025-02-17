import { NextResponse } from "next/server";
import connect from "@/libs/mongodb";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        // On récupère les informations de l'utilisateur
        const { nickname, email, password, avatar } = await req.json();
        console.log("👤 Utilisateur :", nickname, email, password, avatar); // Test de récupération de l'utilisateur

        // On se connecte à la base de données
        connect();

        // On vérifie si l'utilisateur existe déjà
        const user = await User.findOne({ email });
        console.log("🔍 Utilisateur trouvé :", user); // Test pour savoir si l'utilisateur existe ou non
        // Si l'utilisateur existe déjà, on renvoie une erreur
        if (user) {
            console.error("❌ Cet utilisateur existe déjà.");
            return NextResponse.error(new Error("❌ Cet utilisateur existe déjà."));
        };

        // On crypte le mot de passe
        const hashedPwd = await bcrypt.hash(password, 10);

        // On crée un nouvel utilisateur
        const newUser = new User({
            nickname,
            email,
            password: hashedPwd,
            avatar,
        });
        console.log("🔧 Utilisateur : ", newUser) // On vérifie la création de notre user
        // On sauvegarde l'utilisateur dans la base de données
        try {
            await newUser.save();
            console.log("✅ Utilisateur enregistré :", newUser);
            return Response.json({ user: newUser, status: 201 });
        } catch(error) {
            console.error("❌ Erreur lors de la sauvegarde de l'utilisateur :", error);
        }
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        return Response.error(new Error("❌ Erreur serveur"));
    };
};