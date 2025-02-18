import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Coffs from "@/models/coff.model";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export async function POST(req) {
  try {
    await connectDB();
    const { postId, user, img, message } = await req.json();

    
    // if (!postId || !user || !message) {
    //   return NextResponse.json(
    //     { error: "Tous les champs sont requis." },
    //     { status: 400 }
    //   );
    // }

    // Ajoute le commentaire à la publication
    const updatedPost = await Coffs.findByIdAndUpdate(
      postId,
      { $push: { comments: { user, img, message } } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Publication non trouvée." },
        { status: 404 }
      );
    }

    // Envoie une notification via WebSocket
    const newComment = { postId, user, img, message };
    socket.emit("newComment", newComment);

    return NextResponse.json(
      { message: "Commentaire ajouté", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'ajout du commentaire" },
      { status: 500 }
    );
  }
}


// import dbConnect from "../../lib/dbConnect";
// import Coffs from "../../models/Coffs";  // Assurez-vous que vous avez le modèle Coffs correctement importé

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { coffId, comment } = req.body;

//       await dbConnect(); // Connectez-vous à la base de données

//       // Ajout du commentaire à la publication
//       const updatedCoff = await Coffs.findByIdAndUpdate(
//         coffId,
//         { $push: { comments: comment } },
//         { new: true, runValidators: true }
//       );

//       if (!updatedCoff) {
//         return res.status(404).json({ message: "Publication introuvable" });
//       }

//       // Réponse avec les données du commentaire ajouté
//       res.status(200).json(updatedCoff.comments[updatedCoff.comments.length - 1]);
//     } catch (error) {
//       console.error("Erreur lors de l'ajout du commentaire", error);
//       res.status(500).json({ message: "Erreur serveur" });
//     }
//   } else {
//     res.status(405).json({ message: "Méthode non autorisée" });
//   }
// }
