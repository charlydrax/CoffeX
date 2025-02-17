import { NextResponse } from "next/server";
import connect from "@/libs/mongodb";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_LOCAL);

export async function GET() {
    try{
        await connect();
        const db = client.db("CoffeeX");
        const coffs = await db.collection("coffs").find().toArray();
        return NextResponse.json(coffs);
    }catch(error){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}