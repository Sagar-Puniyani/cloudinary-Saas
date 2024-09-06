// src/app/api/video-upload/uploadVideoStream.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

interface CloudinaryUploadResults {
  public_id: string,
  bytes: number,
  duration?: number
  [key: string]: any
}


const uploadVideoStream = async (readableStream: Readable) => {
  try {
    const uploadOptions = {
      resource_type: 'video',
      upload_preset: 'next-cloudiary-saas-video-bucket',
      chunk_size: 20 * 1024 * 1024, // 20MB chunk size
      transformation: [
          { quality: "auto", fetch_format: "mp4" }
      ],
      eager_async: true,
      timeout: 300000, // 5 minutes timeout
      eager: [
          { width: 360, height: 240, crop: "fill" },
          { width: 720, height: 480, crop: "fill" },
          { width: 1080, height: 720, crop: "fill" }
      ]
  };

    const result = cloudinary.uploader.upload_stream(
      readableStream,
      (error, result) => {
        if (error) {
          console.error('Error uploading video:', error);
          throw error;
        }
        return result as CloudinaryUploadResults;
      }
    );

    // Pipe the readable stream to Cloudinary's upload stream
    readableStream.pipe(result);
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export default uploadVideoStream;