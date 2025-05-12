"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 1️⃣ Define a User type (adjust fields to match your API)
export interface User {
  id: string;
  name: string;
  email: string;
}

// 2️⃣ Define the shape of your auth context
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// 3️⃣ Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4️⃣ Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5️⃣ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
