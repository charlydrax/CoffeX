'use client';
import styles from "../../page.module.css";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getSocket } from "../../socket";

const Coff = () => {
    const [publications, setPublications] = useState([]);
    const { auth } = useContext(AuthContext);
    const [coffs, setCoffs] = useState({
        user: auth.nickname || "",
        coffs: "",
        img: "",
    });

    // 🔹 Charger les publications existantes AU MONTAGE
    useEffect(() => {
        axios.get("http://localhost:3000/api/coffs")
            .then((response) => {
                console.log("Publications chargées :", response.data.coffs);
                setPublications(response.data.coffs);
            })
            .catch((error) => console.error("Erreur chargement publications :", error));
    }, []);

    // 🔹 Écouter les nouvelles publications en WebSocket
    useEffect(() => {
        const socket = getSocket();

        socket.on("newPublication", (newPublication) => {
            console.log("Nouvelle publication reçue :", newPublication);
            setPublications((prev) => [...prev, newPublication]);
        });

        return () => {
            socket.off("newPublication"); // Nettoyer l'écouteur
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "img" && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setCoffs((prev) => ({ ...prev, img: base64String }));
            };

            reader.readAsDataURL(file);
        } else {
            setCoffs((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/coff", coffs);

            if (response.status === 200) {
                console.log("Coff publié :", response.data);
                const socket = getSocket();
                socket.emit("newPublication", response.data);
                
                setCoffs({ user: auth.nickname || "", coffs: "", img: "" });
            }
        } catch (error) {
            console.error("Erreur publication :", error.message);
        }
    };

    return (
        <div className={styles.containerCoffs}>
            <img src={auth.avatar} alt="" className={styles.imgCoffs} />
            <form onSubmit={handleSubmit} className={styles.formCoffs}>
                <textarea name="coffs" id="textOfCoff" placeholder="Petite pause café ?!" width="400px" height="200px" onChange={handleChange} value={coffs.coffs}></textarea>
                <div className={styles.divButton}>
                    <div className={styles.fileDiv}>
                        <div className={styles.inputDiv}>
                            <input className={styles.input} name="img" type="file" onChange={handleChange} />
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className={styles.iconImg}>
                                <polyline points="16 16 12 12 8 16"></polyline>
                                <line y2="21" x2="12" y1="12" x1="12"></line>
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                <polyline points="16 16 12 12 8 16"></polyline>
                            </svg>
                        </div>
                    </div>
                    <button id="sendCoff">Poster</button>
                </div>
            </form>
        </div>
    );
};

export default Coff;
