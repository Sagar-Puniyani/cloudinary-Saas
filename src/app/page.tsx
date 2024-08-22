import { ArrowRight } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Landing Page</title>
        <meta name="description" content="A simple landing page with DaisyUI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row">
            <Image
              height={225}
              width={400}
              src="/dev.jpeg"
              className="max-w-sm rounded-lg shadow-2xl"
              alt="Technology Image"
            />
            <div>
              <h1 className="text-5xl text-orange-400 font-bold">
                Welcome SAAS AI Cloudinary Services!
              </h1>
              <p className="py-6 font-bold text-xl">
                👋 Discover how Cloudinary helps you build more engaging and
                performant web and app experiences while making your life easier
                along the way.
              </p>
              <Link href="/home">
                <button className="btn btn-primary">Get Started</button>
              </Link>
            </div>
          </div>
        </div>

        <section className="py-10">
          <h2 className="text-3xl  text-orange-400 font-bold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="card bg-base-100 shadow-xl">
              <Link href={"/social-share"}>
                <div className="card-body">
                  <div className="flex text-orange-400">
                    <h3 className="card-title text-orange-400">social share</h3>
                    <ArrowRight className="transition duration-300 ease-in-out transform hover:translate-x-2" />
                  </div>
                  <p>
                    Helps you transform the Image with help cloudinary AI, to share on social media.
                  </p>
                </div>
              </Link>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <Link href={"/video-upload"}>
                <div className="card-body">
                <div className="flex  text-orange-400 ">
                  <h3 className="card-title  text-orange-400">Video Share</h3>
                  <ArrowRight className="transition duration-300 ease-in-out transform hover:translate-x-2" />
                  </div>
                  <p>
                    Helps you transform the Video with help cloudinary AI, to
                    share on social media.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer p-10 bg-neutral text-neutral-content footer-center">
        <div>
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
