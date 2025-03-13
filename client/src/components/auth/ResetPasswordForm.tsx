// src/components/auth/ForgotPassword.jsx
import { useState } from "react";
// import { toast } from "../../components/ui/sonner";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { AlertCircle } from "lucide-react";
// import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { useSearchParams } from "react-router-dom";
const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  //   const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);
    try {
      //   await login({ email, password });
      if (!token) {
        throw new Error("Invalid token");
      }
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      await authService.resetPassword({ newPassword, token });
      toast.success("successfull, Changed password");
      // navigate("/");
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setFormError((error as Error).message || "Invalid token or password");
      toast.error("Password Reset Failed", {
        description: (error as Error).message || "Invalid token or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center p-3 text-sm border rounded bg-red-50 text-red-600 border-red-200">
              <AlertCircle className="w-4 h-4 mr-2" />
              {formError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant={"outline"}
          >
            {isLoading ? "updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
