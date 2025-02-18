import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Coffs from "@/models/coff.model";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export async function POST(req) {
  try {
    await connectDB();
    const { postId, user, img, message } = await req.json();

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
