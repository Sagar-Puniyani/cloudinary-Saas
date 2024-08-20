import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function GET (request : NextRequest, response : NextResponse){
    try {
        const videos = await prisma.video.findMany({
            orderBy: {createdAt: "desc"}
        })

        return NextResponse.json(videos);
    } catch (error: any ) {
        return NextResponse.json({error: "Error Fetching Videos"},
            {status : 500}
        )
    }
    finally{
        await prisma.$disconnect();
    }
}