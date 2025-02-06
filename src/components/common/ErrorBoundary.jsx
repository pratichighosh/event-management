// src/components/common/ErrorBoundary.jsx
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-4">
          {error.status === 404 
            ? "The page you're looking for doesn't exist."
            : "An unexpected error occurred."}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {error.message || error.statusText}
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;