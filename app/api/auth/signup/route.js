import { NextResponse } from "next/server";
import connect from "@/libs/mongodb";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Pour obtenir __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le dossier d'upload
const uploadFolder = path.join(process.cwd(), 'public', 'images');

// Créer le dossier si inexistant
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  console.log('Dossier "images" créé');
}

// Configuration du storage de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.nickname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialiser Multer
const upload = multer({ storage });

apiRoute.use(upload.single('img'));

apiRoute.post(async (req, res) => {
  try {
    // Récupération du fichier uploadé
    const image = req.file;
    
    // Création de l'objet contenant les chemins d'images
    const pathImgExtracted = file ? { img: `/uploads/${file.filename}` } : {};
    
    // Ici, vous pouvez par exemple enregistrer l'article dans votre BDD en combinant
    // req.body (les autres champs du formulaire) et pathImgExtracted (les images)
    // Pour l'exemple, on renvoie simplement ces données en réponse.

    const { nickname, email, password } = req.body;

    await connect();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      );
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    let newUser = new User({
      nickname,
      email,
      password: hashedPwd,
      avatar: pathImgExtracted.img,
    });
    newUser = await newUser.save();
    
    res.status(201).json({ message: "L'article a été créé", picture: pathImgExtracted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Désactiver le bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
  
// export async function POST(req) {
//   try {
//     const reqStream = await requestToStream(req);

//     // Vérifier si le dossier `public/images` existe, sinon le créer
//     const uploadDir = path.join(process.cwd(), "public", "images");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Parser le formulaire avec formidable
//     const { fields, files } = await parseForm(reqStream);

//     console.log("📂 Fichier reçu :", files);
//     console.log("📜 Champs reçus :", fields);

//     // Récupérer les champs du formulaire
//     const { nickname, email, password } = fields;
//     if (!nickname || !email || !password) {
//       return NextResponse.json(
//         { error: "Tous les champs sont requis." },
//         { status: 400 }
//       );
//     }

//     await connect();

//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Cet email est déjà utilisé." },
//         { status: 409 }
//       );
//     }

//     const hashedPwd = await bcrypt.hash(password, 10);

//     // Créer l'utilisateur (avatar vide pour l'instant)
//     let newUser = new User({
//       nickname,
//       email,
//       password: hashedPwd,
//       avatar: "",
//     });
//     newUser = await newUser.save();

//     let avatarPath = "";
//     if (files.avatar) {
//       const file = files.avatar;
//       console.log("📌 Fichier temporaire :", file.filepath);
      
//       // Vérifier si le fichier existe avant de le renommer
//       if (fs.existsSync(file.filepath)) {
//         const ext = path.extname(file.originalFilename || file.newFilename);
//         const newFileName = `${newUser._id}${ext}`;
//         const newFilePath = path.join(uploadDir, newFileName);

//         console.log("✍️ Renommage du fichier...");
//         fs.renameSync(file.filepath, newFilePath);
//         console.log("✅ Fichier renommé en :", newFilePath);

//         avatarPath = `/images/${newFileName}`;
//         newUser.avatar = avatarPath;
//         await newUser.save();
//       } else {
//         console.error("❌ Le fichier temporaire n'existe pas !");
//       }
//     } else {
//       console.warn("⚠️ Aucun fichier reçu pour l'avatar.");
//     }

//     return NextResponse.json({ user: newUser, status: 201 }, { status: 201 });
//   } catch (error) {
//     console.error("❌ Erreur serveur :", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
