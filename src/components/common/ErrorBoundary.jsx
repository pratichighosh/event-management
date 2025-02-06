// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-4">Something went wrong</p>
        <div className="text-gray-500 mb-6">
          {error.message || error.statusText || 'An unexpected error occurred'}
        </div>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;