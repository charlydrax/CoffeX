"use client";
import SignUp from '../components/SignUp'; // Composant d'inscription
import SignIn from '../components/SignIn'; // Composant de connexion
import style from './page.module.css';
import { DiCoffeescript } from "react-icons/di";
import React, { useState } from 'react';

export default function SignPage() {
  const [signingUp, setSigningUp] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  return (
    <div className={style.container}>
      <div className={style.containerIcon}>
        <DiCoffeescript size={500} />
      </div>
      <div className={style.containerForm}>
        <div>
          <h1 className={style.titreForm}>Un petit CoffeeX ?</h1>
          <h2 className={style.sousTitreForm}>What else ?</h2>
        </div>
        {signingUp && <SignUp setSigningIn={setSigningIn} setSigningUp={setSigningUp} />}
        {signingIn && <SignIn setSigningIn={setSigningIn} setSigningUp={setSigningUp} />}
      </div>
    </div>
  )
}
