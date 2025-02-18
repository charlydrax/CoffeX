"use client";
// import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000";
const { io } = require("socket.io-client");

export const socket = io(); 


let socket_2;
export const getSocket = () => {
    if (!socket_2) {
        socket_2 = io(SOCKET_URL);
    }
    return socket_2;
};