// src/pages/auth/Register.jsx
import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import AuthLayout from "../../components/layout/AuthLayout";

const Register = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-500">
            Sign up to get started with your wallet
          </p>
        </div>

        <RegisterForm />

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
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

export default Register;
