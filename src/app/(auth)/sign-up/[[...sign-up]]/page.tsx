import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="w-full max-w-md bg-gray-700 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: 'shadow-lg p-4 rounded-lg',
              headerTitle: 'text-xl font-semibold text-gray-700',
              formButtonPrimary: 'btn btn-primary w-full',
            },
            variables: {
              colorPrimary: '#4F46E5', // Customize primary color
            },
          }}
        />
      </div>
    </div>
  );
}
