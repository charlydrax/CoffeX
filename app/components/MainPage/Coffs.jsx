"use client";
import { socket_js, setupSocket } from "../../src/js/socket";
import Socket from "../Socket";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import styles from "../../page.module.css";
import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

export default function Home() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/coffs")
        .then((response) => {
            console.log("Publications chargées :", response.data.coffs);
            setPublications(response.data.coffs);
        })
        .catch((error) => console.error("Erreur chargement publications :", error));
  }, []);

  useEffect(() => {
    console.log('cailloux');
    
    // Écoute les nouvelles publications du serveur
    socket.on("newPublication", (newPublication) => {
      setPublications((prev) => [...prev, newPublication.coff]);
      console.log(publications);
      
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

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
      {publications && publications.map((item) => (
        <div className={styles.cardCoffs} key={item._id}>
          <div>
            <h5 className={styles.cardUser}>{item.user}</h5>
            {/* {item.img ?? `<img src=${item.img} className=${styles.imgCardCoffs} alt=${item.user}/>`} */}
            <img src="https://images.rtl.fr/~c/1200v800/rtl/www/1550988-la-guerre-du-ratio-est-declaree.png" className={styles.imgCardCoffs} alt={item.user}/>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.cardText}>{item.coffs}</p>
            <div>
              {/* <button onClick={handleClick}>Liker </button> */}
              <button>Liker</button>
              <p> like</p>
              {/* <p>{like} like</p> */}
            </div>
          </div>
        </div>
      ))}   
    </div>
  );
}