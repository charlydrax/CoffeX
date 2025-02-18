"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    socket.on("newPublication", (newPublication) => {
      setPublications((prev) => [...prev, newPublication]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNewPublication = async () => {
    const newPublication = { content: "Nouvelle publication" };

    setPublications((prev) => [...prev, newPublication]);

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
      //Enleve le coff si y'a une erreur
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