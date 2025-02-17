const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer,{
    cors:{
      origin:'*',
      methods:['GET','POST']
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});


//code à afficher et à adapter avec la bdd
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/your_database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const YourModel = mongoose.model('YourModel', new mongoose.Schema({
//   // Define your schema here
//   name: String,
//   value: Number,
// }));

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on('request data', async () => {
//     try {
//       const data = await YourModel.find();
//       socket.emit('data response', data);
//     } catch (error) {
//       socket.emit('data error', { error: 'Internal Server Error' });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// httpServer.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });