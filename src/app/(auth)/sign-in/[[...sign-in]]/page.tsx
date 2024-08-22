import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="w-full max-w-md bg-gray-700 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
