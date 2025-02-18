"use client"; // Indique que ce composant est côté client
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // URL du serveur WebSocket

export default function Home() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    // Écoute les nouvelles publications du serveur
    socket.on("newPublication", (newPublication) => {
      setPublications((prev) => [...prev, newPublication]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNewPublication = async () => {
    const newPublication = { content: "Nouvelle publication" };

    // Affiche la publication immédiatement (optimistic update)
    setPublications((prev) => [...prev, newPublication]);

    // Envoie la publication au serveur via l'API
    try {
      const response = await fetch("/api/coffs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPublication),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la publication");
      }
    } catch (error) {
      console.error(error);
      // Retire la publication en cas d'erreur
      setPublications((prev) => prev.filter((pub) => pub !== newPublication));
    }
  };

  return (
    <div>
      <button onClick={handleNewPublication}>Publier</button>
      <ul>
        {publications.map((pub, index) => (
          <li key={index}>{pub.content}</li>
        ))}
      </ul>
    </div>
  );
}