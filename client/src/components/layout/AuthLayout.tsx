// src/components/layout/AuthLayout.jsx
import { ReactNode } from "react";
const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand & illustration */}
      <div className="bg-blue-600 text-white md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">FinWallet</h1>
        </div>

        <div className="py-12 flex items-center justify-center flex-grow">
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold">
              Manage your money with confidence
            </h2>
            <p className="text-blue-100">
              Fund your wallet, transfer to friends, and withdraw anytime. Your
              financial companion for daily transactions.
            </p>

            {/* Features list */}
            <ul className="space-y-3">
              {[
                "Secure wallet",
                "Instant transfers",
                "Low fees",
                "Transaction history",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <div className="mr-3 bg-blue-500 rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-sm text-blue-200">
          © 2025 FinWallet. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="bg-white md:w-1/2 p-8 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
