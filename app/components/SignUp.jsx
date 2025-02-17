'use client'
import React, { useState } from 'react'
import style from '../sign/page.module.css'
// import { Link } from 'react-router-dom'
import axios from 'axios'
// import Header from '../components/Header';
export default function SignUp ({ setSigningUp, setSigningIn }) {
    const [user, setUser] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'avatar') {
            const file = e.target.files[0];
            console.log("📂 Fichier sélectionné :", file);
        };
        setUser((PrevUser) =>({ ...PrevUser,[name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Création de l\'utilisateur', user);
            const response = await axios.post('../api/auth/signup', user, { headers: { 'Content-Type': 'application/json' } });
            console.log('Utilisateur créé', response);
        } catch (e) {
            console.log(e.message);
        }
    };

    const switchToSignIn = () => {
        setSigningUp(false);
        setSigningIn(true);
    };

    return (
        <div className={style.containerSignIn}>
            <div className={style.loginBox}>
            <h2 className={style.title}>Inscription</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className={style.inputBox}>
                        <label htmlFor="prenom">Pseudo :</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            placeholder="Entrez votre pseudo"
                            name="nickname"
                            className={style.registerInput}
                            required
                        />
                    </div>
                    <div className={style.inputBox}>
                    <label htmlFor="avatar" className="register-label">Avatar :</label>
                    <input
                        type="file"
                        onChange={handleChange}
                        className={style.registerInput}
                        name="avatar"
                    />
                    </div>
                    <div className={style.inputBox}>
                    <label htmlFor="email" className="register-label">Email :</label>
                    <input
                        type="email"
                        onChange={handleChange}
                        placeholder="Entrez votre email"
                        name="email"
                        className={style.registerInput}
                        required
                    />
                    </div>
                    <div className={style.inputBox}>
                        <label htmlFor="password" className="register-label">Mot de passe :</label>
                        <input
                            type="password"
                            onChange={handleChange}
                            placeholder="Votre mot de passe"
                            name="password"
                            className={style.registerInput}
                            required
                        />
                    </div>
                    <div className={style.btnContainer}>
                        <button type="submit"  className={style.btn}>Rejoindre le café</button>
                    </div>
                </form>
                <button onClick={switchToSignIn}>Déjà inscrit ? Connectez-vous</button>
            </div>
        </div>
    )
};