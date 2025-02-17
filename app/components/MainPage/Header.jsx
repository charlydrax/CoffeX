import React, { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import styles from "../../page.module.css";
import { FaHouse } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { DiCoffeescript } from "react-icons/di";

export default function Header({ setComponent, isModalOpen }) {

    return (
        <>
            <ul className={styles.listHeader}>
                <DiCoffeescript size={100} />
                <li>
                    <FaHouse className={styles.logoHome}/>
                    <button onClick={() => setComponent("home")}>Accueil</button>
                </li>
                <li>
                    <FaSearch className={styles.logoSearch}/>
                    <button onClick={() => setComponent("explore")}>Explorer</button>
                </li>
                <li>
                    <FaEnvelope className={styles.logoMessage}/>
                    <button onClick={() => setComponent("message")}>Messagerie</button>
                </li>
                <li>
                    <FaPaperPlane className={styles.logoPlane}/>
                    <button onClick={() => isModalOpen(true)}>Poster un Coffs</button>
                </li>
            </ul>
            <a onClick={() => setComponent("profile")} className={styles.profileLink}>
                <FastProfile />
            </a>
        </>
    );
};

const FastProfile = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className={styles.profile}>
            <img src={auth.avatar} alt="avatar" className='profileImg' />
            <h1 className='profileTitre'>{auth.nickname}</h1>
        </div>
    );
};