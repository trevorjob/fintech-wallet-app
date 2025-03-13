// src/pages/auth/ResetPassword.jsx
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

const ResetPassword = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Change Your password</h1>
          <p className="text-gray-500">Enter New Password To Reset It </p>
        </div>

        <ResetPasswordForm />

        {/* <p className="text-sm text-gray-600">
          Remebered Your Password?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p> */}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
