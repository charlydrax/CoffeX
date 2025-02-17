"use client";
import { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { redirect } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Etat pour suivre l'authentification
    const [isLoading, setIsLoading] = useState(false);
    // Etat pour stocker les infos de l'user connecté
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : null;
    });

    axios.defaults.withCredentials = true;

    const login = async (dataForm) => {
        setIsLoading(true);
        try {
            const { data, status } = await axios.post("api/auth/signin", dataForm);
            if(status === 200){
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth(data);
                setIsLoading(false);
                redirect("/");
            }
        }catch(e){
            console.log(e.message);
            setIsLoading(false);
        };
    };

    return (
        <AuthContext.Provider value={{ isLoading, auth, login }}>
            {children}
        </AuthContext.Provider>
    );
}