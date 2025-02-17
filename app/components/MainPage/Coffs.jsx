"use client";
import { socket_js, setupSocket } from "../../src/js/socket";
import Socket from "../Socket";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import styles from "../../page.module.css";
import { useEffect, useState, useContext } from "react";
export default function Home() {
  const [coffs, setCoffs] = useState([]);
  const [error, setError] = useState([]);
  const [like, setLike] = useState(0);
  const { auth } = useContext(AuthContext);
  useEffect(() => {
      
      const fetchCoffs = async () => {
          try{
            const response = await axios.get('../api/coffs');
            
            const data = await response.data;
            
            setCoffs(data);
          } catch (error) {
              setError(error.message);
          }
      };

      fetchCoffs();

  }, []);
  const handleClick = () => {
    if(auth){
      setLike(like + 1);
    }
  };
  return (
    <div>
      <Socket
        function_for_socket_js={setupSocket}
        />
      <ul id="messages"></ul>
      {coffs.map((item) => (
        <div className={styles.cardCoffs} key={item._id}>
          <div>
            <h5 className={styles.cardUser}>{item.user}</h5>
            <img src="https://www.nextplz.fr/wp-content/uploads/nextplz/2018/05/16738757401063860.jpg" class={styles.imgCardCoffs} alt={item.user}/>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.cardText}>{item.coffs}</p>
            <div>
              <button onClick={handleClick}>Liker </button>
              <p>{like} like</p>
            </div>
          </div>
        </div>
      ))}   
    </div>
  );
}