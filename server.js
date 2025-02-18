const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "development";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let publications = []; // Stocke temporairement les publications (remplace ça par une DB si nécessaire)

  io.on("connection", (socket) => {
    console.log("✅ Un utilisateur s'est connecté :", socket.id);

    socket.emit("initPublications", publications);

    //Partie sur les publications
    socket.on("newPublication", (newPublication) => {
    console.log("📢 Nouvelle publication reçue :", newPublication);

      publications.push(newPublication);


      io.emit("newPublication", newPublication);
    });

    //Partie sur les commentaires
    socket.on("newComment", async ({ coffId, comment }) => {
      console.log("📢 Nouveau commentaire reçu :", comment);
      
      io.emit("newComment", { coffId, comment });
    
    });

    socket.on("disconnect", () => {
      console.log("❌ Un utilisateur s'est déconnecté :", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Serveur prêt sur http://${hostname}:${port}`);
    });
});
