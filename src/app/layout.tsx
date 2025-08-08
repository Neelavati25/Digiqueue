import React from "react";
import "./index.css";
import { Toaster } from "../components/ui/toaster";
import { AuthProvider } from "../components/auth-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-inter">
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </div>
  );
}
