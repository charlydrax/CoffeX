import Coff from "@/models/coff.model";
import connectDB from "@/libs/mongodb";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");


export async function GET(id) {
    const coff = await db.collection("coffs").findOne({ _id: id });
    return NextResponse.json(coff);
};

const addCoff =async (coff) => {
    try{
        console.log("on est dans le addCoff");
        
        await connectDB();
        const reponse = await Coff.create(coff);
        
        return reponse;
    } catch(e){
        throw new Error(e.message);
    }
}
export async function POST(req) {
    try {
        console.log('on est dans le post');
        await connectDB();
        const body =await req.json();
        

        const coffCreated = await addCoff(body);
        console.log("Coff créé :", coffCreated);
        
        
        if(!body.coffs){
            return Response.json(
                {error: "Tous les champs sont requis."},
                {status: 400}
            );
        }

        socket.emit("newPublication", coffCreated);
        
        return Response.json(
            {message: "Coffs publié", coff: coffCreated},
            {coffCreated},
            {status: 201}
        );
        
    } catch (error) {
        return Response.json(
            {error: error.message},
            {status: 500}
        );
    };
};
