// src/pages/auth/Login.jsx
import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import AuthLayout from "../../components/layout/AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Sign in to access your wallet</p>
        </div>

        <LoginForm />

        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
