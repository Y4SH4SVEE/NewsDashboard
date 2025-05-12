"use client";

import React, { useState, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth } from "../common/contextApi";

interface LoginForm {
  email: string;
  password: string;
}

interface ErrorState {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<ErrorState>({});
  const { setUser } = useAuth();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trimStart() }));
    validateField(name as keyof LoginForm, value.trim());
  };

  const validateField = (field: keyof LoginForm, value: string) => {
    const errs: ErrorState = { ...error };

    if (field === "email") {
      if (!value) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) errs.email = "Email is invalid";
      else delete errs.email;
    }

    if (field === "password") {
      if (!value) errs.password = "Password is required";
      else if (value.length < 6)
        errs.password = "Password must be at least 6 characters";
      else delete errs.password;
    }

    setError(errs);
  };

  const handleLogin = async () => {
    if (Object.keys(error).length === 0 && form.email && form.password) {
      try {
        const res = await axios.post(
          "https://ecommerce-backend-6i0q.onrender.com/api/auth/login",
          {
            email: form.email,
            password: form.password,
          }
        );

        const user = res.data.data.user;
        setUser(user);

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome, ${user.name}!`,
        });

        router.push("/NewsDashboard/pages/dashboard");
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: axiosError.message || "Something went wrong!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Please fix the errors before continuing.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
            Login
          </h1>
          <div className="mt-8 space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none"
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none"
            />
            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 bg-indigo-100 items-center justify-center">
          <div
            className="w-3/4 h-3/4 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          />
        </div>
      </div>
    </div>
  );
}
