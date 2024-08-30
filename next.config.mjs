/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com', 'img.clerk.com']
    },
    api : {
        bodyParser:{
            sizeLimit: '100mb'
        }
    }
};


export default nextConfig;
