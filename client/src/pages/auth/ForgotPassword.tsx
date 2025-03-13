// src/pages/auth/ForgotPassword.jsx
import { Link } from "react-router-dom";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Forgot Your Password</h1>
          <p className="text-gray-500">Enter Your Email To Reset It </p>
        </div>

        <ForgotPasswordForm />

        <p className="text-sm text-gray-600">
          Remebered Your Password?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
