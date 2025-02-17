"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";

const Socket = (function_for_socket_js) => {
    
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [data, setData] = useState([]);

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
            socket.emit('request data');
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
      
        function_for_socket_js.function_for_socket_js()
        // setupSocket();

        axios.get('http://localhost:3000/api/coffs')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        };
    }, []);


  return (
    <div>
        <h2>Data :</h2>
        <ul>
          {data.map(item => (
            <li key={item._id}>{item.name}: {item.value}</li>
          ))}
        </ul>
    </div>
  )
}

export default Socket
