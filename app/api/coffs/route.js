import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("CoffeeX");
    const coffs = await db.collection("coffs").find().toArray();
    return NextResponse.json(coffs);
}