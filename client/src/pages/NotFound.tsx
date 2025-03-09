// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-6">
        <div className="text-blue-600 font-bold text-7xl">404</div>
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <div>
          <Link to="/">
            <Button variant={"outline"}>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
