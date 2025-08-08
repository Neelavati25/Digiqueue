"use client"

import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Clock, Mail, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Verify admin status in Firestore
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        await auth.signOut(); // Immediately log out if not an admin
        throw new Error("Admin privileges not found");
      }

      // 3. Only now redirect to dashboard
      toast({
        title: "Admin Access Granted",
        description: "Redirecting to admin dashboard...",
      });
      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Access Denied",
        description: error.message.includes("admin")
          ? "This account doesn't have admin privileges"
          : "Invalid credentials or unauthorized access",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-background to-purple-100/50 p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-primary to-purple-600">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold gradient-text">DigiQueue</span>
              </div>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground">Secure login to manage queues and system operations</p>
        </div>

        <Card className="border-2 shadow-xl border-purple-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>Admin Login</span>
            </CardTitle>
            <CardDescription>Access the administrative dashboard and management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@digiqueue.com"
                    className="pl-10 h-11"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="admin-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 h-11"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Verifying credentials..." : "Authenticate"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 text-sm">Security Notice</h4>
                  <p className="text-xs text-purple-700 mt-1">
                    Each login attempt is recorded. Unauthorized access attempts will be reported.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
