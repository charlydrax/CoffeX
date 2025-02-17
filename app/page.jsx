"use client"
import { useState, useContext } from "react";
import styles from "./page.module.css";
import { AuthContext } from "./context/AuthContext";

/* Import des Composants */
import Coffs from "./components/MainPage/Coffs";
import Coff from "./components/MainPage/Coff";
import Header from "./components/MainPage/Header";
import Explore from "./components/MainPage/Explore";
import Message from "./components/MainPage/Message";
import Profile from "./components/MainPage/Profile";
import { redirect } from "next/navigation";

const HomeComponent = () => {
  return (
    <>
      <Coffs />
      <Coff />
    </>
  );
};

export default function Home() {
  const { auth } = useContext(AuthContext);
  const [component, setComponent] = useState("home");
  const [modal, isModalOpen] = useState(false);

  console.log(auth);

  if(!auth){
    redirect("/sign");
  }

  return (
    <div className={styles.container}>
      <div className={styles.container_content}>
        <aside className={styles.aside_left}><Header setComponent={setComponent} isModalOpen={isModalOpen} /></aside>
        <main className={styles.main}>
          {component === "home" && <HomeComponent />}
          {component === "explore" && <Explore />}
          {component === "message" && <Message />}
          {component === "profile" && <Profile />}
        </main>
        <aside className={styles.aside_right}></aside>
      </div>
    </div>
  );
};
