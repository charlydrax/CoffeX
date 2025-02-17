import { NextResponse } from "next/server";
import connect from "@/libs/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const body = await req.json();
        // console.log("👤 Utilisateur :", email, password); // Vérification du body

        connect();

        // Vérification de l'existence de l'utilisateur
        const user = await User.findOne({email: body.email});
        console.log("🔍 Utilisateur trouvé :", user); // Test pour savoir si l'utilisateur existe ou non
        if(!user) { // Si l'utilisateur n'existe pas
            return NextResponse.error(new Error("Cet utilisateur n'existe pas"), 404); // On renvoie une erreur 404
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(body.password, user.password);
        if(!isMatch) { // Si le mot de passe est incorrect
            return NextResponse.error(new Error("Mot de passe incorrect"), 401); // On renvoie une erreur 401
        }

        
        // On génère maintenant le token JWT
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });
        
        const { password, ...other } = user._doc;

        cookies().set({
            name: 'access_token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 86400,
        });
        
        return new Response(JSON.stringify(other), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    };
};