import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResults {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

// The handler for POST requests
export async function POST(request: NextRequest) {
  try {
    // Check for necessary environment variables
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }

    // Check if user is authenticated
    const userId = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle file form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ error: "File not found " }, { status: 405 });
    }

    console.log("originalSize : ", originalSize);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResults>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "next-cloudinary-saas-video-bucket",
            eager: [{ quality: "auto", format: "mp4" }], // Eager transformation for async processing
            eager_async: true, // Process video asynchronously
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResults);
          }
        );

        uploadStream.end(buffer); // Stream the video buffer
      }
    );

    // Store video metadata in the database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicID: result.public_id,
        originalSize: originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });

    return NextResponse.json({ public_id: result.public_id }, { status: 200 });
  } catch (error) {
    console.log("Upload Video failed", error);
    return NextResponse.json({ error: "Upload Video failed" }, { status: 500 });
  } finally {
    prisma.$disconnect();
  }
}
