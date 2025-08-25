import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Link
        href="/"
        className="absolute top-4 left-4 text-white hover:underline"
      >
        ← Back
      </Link>

      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please login or register to continue
          </p>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
