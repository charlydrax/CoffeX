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
  const { auth } = useContext(AuthContext);
  const [publications, setPublications] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comment, setComment] = useState({
          user: auth.nickname || "",
          img: "",
          message: "",
      });
  useEffect(() => {
    
    axios.get("http://localhost:3000/api/coffs")
        .then((response) => {
            setPublications(response.data.coffs);
        })
        .catch((error) => console.error("Erreur chargement publications :", error));
  }, []);

  useEffect(() => {
    
    // Écoute les nouvelles publications du serveur
    socket.on("newPublication", (newPublication) => {
      setPublications((prev) => [...prev, newPublication.coff]);
      console.log(publications);
      
    });
    socket.on("newComment", ({ postId, comment }) => {
      setPublications((prev) => prev.map(pub => 
        pub._id === postId ? { ...pub, comments: [...pub.comments, comment] } : pub
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // const handleNewPublication = async () => {
  //   const newPublication = { content: "Nouvelle publication" };

  //   // Affiche la publication immédiatement (optimistic update)
  //   setPublications((prev) => [...prev, newPublication]);

  //   // Envoie la publication au serveur via l'API
  //   try {
  //     const response = await fetch("/api/coffs", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(newPublication),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Erreur lors de l'envoi de la publication");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // Retire la publication en cas d'erreur
  //     setPublications((prev) => prev.filter((pub) => pub !== newPublication));
  //   }
  // };
  // -------------------------------handle---pour---les---comments-------------------------------------------------
//   const handleAddComment = (coffId) => {
//     const comment = {
//       user: "User", // Remplacer par le nom de l'utilisateur connecté
//       message: newComment,
//     };

//     socket.emit("newComment", { coffId, comment });
//     setNewComment(""); // Reset le champ de texte après l'envoi
//   };

//   const handleSubmitComment = async (e) => {
//     e.preventDefault();

//     try {
//         const response = await axios.post("http://localhost:3000/api/comment", coffs);

//         if (response.status === 200) {
//             console.log("Coff publié :", response.data);
//             const socket = getSocket();
//             socket.emit("newPublication", response.data);
            
//             setComment({ user: auth.nickname || "", img: "", message: "" });
//         }
//     } catch (error) {
//         console.error("Erreur publication :", error.message);
//     }
// };

const handleAddComment = async (postId) => {
  // const comment = {
    const user = auth.nickname || ""
    const img = auth.avatar || ""
    const message = newComment
  // };
  setPublications((prev) =>
    prev.map((pub) =>
      pub._id === postId
        ? { ...pub, comments: [...pub.comments, { user, img, message }] } // Ajoute le commentaire localement
        : pub
    )
  );
  try {
    
    const response = await axios.post("http://localhost:3000/api/comment", { postId, user, img, message });

    if (response.status === 201) {
      // Si l'ajout a réussi, émettre l'événement WebSocket pour les autres clients
      socket.emit("newComment", { postId, comment: response.data });
      
      setNewComment("");
    } else {
      console.error("Erreur lors de l'ajout du commentaire");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
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
              <p> 0 like</p>
              {/* <p>{like} like</p> */}
              <h6>Commentaires :</h6>
              {item.comments && item.comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <p><strong>{comment.user}</strong>: {comment.message}</p>
                </div>
              ))}
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire"
              />
              <button onClick={() => handleAddComment(item._id)}>Ajouter</button>
            </div>
          </div>
        </div>
      ))}   
    </div>
  );
}