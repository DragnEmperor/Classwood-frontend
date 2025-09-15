import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p>Page not found.</p>
      <Link
        to="/"
        className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-800"
      >
        Go home
      </Link>
    </div>
  );
}
