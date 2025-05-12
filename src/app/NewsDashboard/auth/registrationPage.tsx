"use client";

import React, { useState, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth, User } from "../common/contextApi";

interface RegistrationForm {
  name: string;
  email: string;
  password: string;
}

interface ErrorState {
  name?: string;
  email?: string;
  password?: string;
}

export default function Registration() {
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<ErrorState>({});
  const { setUser } = useAuth();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof RegistrationForm, value);
  };

  const validateField = (field: keyof RegistrationForm, value: string) => {
    const errs: ErrorState = { ...error };

    if (field === "name") {
      if (!value.trim()) errs.name = "Name is required";
      else delete errs.name;
    }

    if (field === "email") {
      if (!value.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) errs.email = "Email is invalid";
      else delete errs.email;
    }

    if (field === "password") {
      if (!value.trim()) errs.password = "Password is required";
      else if (value.length < 6)
        errs.password = "Password must be at least 6 characters";
      else delete errs.password;
    }

    setError(errs);
  };

  const handleRegistration = async () => {
    if (
      Object.keys(error).length === 0 &&
      form.name &&
      form.email &&
      form.password
    ) {
      try {
        const res = await axios.post<{ data: { user: User } }>(
          "https://ecommerce-backend-6i0q.onrender.com/api/auth/register",
          {
            name: form.name,
            email: form.email,
            password: form.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const user = res.data.data.user;
        setUser(user);

        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: `Welcome, ${user.name}!`,
        });
        router.push("/login");
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: axiosError.message || "Something went wrong!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Please fix the errors before registering.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
            Registration
          </h1>

          <div className="mt-8 space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {error.name && (
                <p className="text-red-500 text-sm mt-1">{error.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none"
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            <button
              onClick={handleRegistration}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Register
            </button>

            <p className="text-xs text-gray-600 text-center">
              I agree to templatana’s{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              &{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
            </p>
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
