import  connect  from "@/libs/mongodb";
import Coffs from "@/models/coff.model";



export async function GET() {
    try {
        await connect()
        
        const coff = await Coffs.find({})

        return Response.json({coffs: coff , status: 200}, {status:200})
    } catch (error) {
        return Response.json({message:"Impossible de recuperer les coffs !", error:error.message, status: 404 }, {status:404})
    }
}