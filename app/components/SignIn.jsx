/* Composant de connexion */
"use client";
import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import style from '../sign/page.module.css'
import { redirect } from 'next/navigation';

export default function SignIn({ setSigningIn, setSigningUp }) {
  const [user, setUser] = useState({})
  const { login } = useContext(AuthContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(PrevUser => ({ ...PrevUser, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login(user)
    if (login) {
      console.log('Connexion réussie')
      console.log(user);
      redirect('/');
    }
  }

  const switchToSignUp = () => {
    setSigningIn(false);
    setSigningUp(true);
  };

  return (
    <div className={style.containerSignIn}>
      <div className={style.loginBox}>
        <h2>Connexion</h2>
        <p className={style.subtitle}>Connectez-vous pour savourer l'expérience</p>
        <form action="" onSubmit={handleSubmit}>
              <div className={style.inputBox}>
                <label>Email</label>
                <input 
                  type="email"
                  name="email"
                  placeholder="Entrez votre email" 
                  onChange={handleChange} 
                  className={style.registerInput}
                  required 
                />
              </div>
              <div className={style.inputBox}>
                <label>Mot de passe</label>
                <input 
                  type="password" 
                  name='password'
                  placeholder="Entrez votre mot de passe" 
                  onChange={handleChange} 
                  className={style.registerInput}
                  required 
                />
              </div>
              <div className={style.btnContainer}>
                <button className={style.btn}>Se connecter</button>
              </div>
        </form>
        <button onClick={switchToSignUp}>Pas encore de compte ? Inscrivez-vous</button>
      </div>
    </div>
  )
}