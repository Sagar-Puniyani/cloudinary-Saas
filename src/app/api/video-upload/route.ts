import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// UPLOAD result of cloudinary 
interface CloudinaryUploadResults {
    public_id: string,
    bytes: number,
    duration?: number
    [key: string]: any
}

export async function POST(request: NextRequest) {

    try {
        // check for env loaded properly
        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 })
        }

        // check wheather user is logged in or not
        const userId = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }


        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;


        if (!file) {
            return NextResponse.json({ error: "File not found " }, { status: 405 })
        }

        console.log("originalSize : ", originalSize);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResults>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "next-cloudiary-saas-video-bucket",
                        transformation: [
                            {quality: "auto" , fetch_format: "mp4"}
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result as CloudinaryUploadResults)
                    }
                )

                uploadStream.end(buffer)
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicID: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            }
        })

        return NextResponse.json({ public_id: result.public_id }, { status: 200 })

    } catch (error) {
        console.log("Upload Video failed", error)
        return NextResponse.json({ error: "Upload Video failed" }, { status: 500 })
    }
    finally{
        prisma.$disconnect();
    }
}