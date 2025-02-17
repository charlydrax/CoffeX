import React, { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

export default function Header({ setComponent, isModalOpen }) {

    return (
        <ul className='list-header'>
            <li>
                <button onClick={() => setComponent("home")}>Accueil</button>
            </li>
            <li>
                <button onClick={() => setComponent("explore")}>Explorer</button>
            </li>
            <li>
                <button onClick={() => setComponent("message")}>Messagerie</button>
            </li>
            <li>
                <button onClick={() => isModalOpen(true)}>Poster un Coffs</button>
            </li>
            <li>
                <button onClick={() => setComponent("profile")}>
                    <FastProfile />
                </button>
            </li>
        </ul>
    );
};

const FastProfile = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className='profile'>
            <img src={auth.avatar} alt="avatar" className='profileImg' />
            <h1 className='profileTitre'>{auth.nickname}</h1>
        </div>
    );
};