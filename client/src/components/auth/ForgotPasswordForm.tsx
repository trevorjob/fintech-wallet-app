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
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  //   const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);
    try {
      //   await login({ email, password });
      await authService.forgotPassword({ email });
      toast.success("successfull, Check your mail");
      // navigate("/");
      // window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setFormError((error as Error).message || "Invalid email or password");
      toast.error("Login failed", {
        description: (error as Error).message || "Invalid email or password",
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant={"outline"}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
