'use client';

import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", formData);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (err: any) {
      if (err?.response) {
        setError(err.response.data?.message || "Login failed");
      } else if (err?.request) {
        setError("Server not responding. Please try again later.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50">
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pomegranate-oatmeal.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 mx-4 flex w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Left image */}
        <div className="relative hidden w-1/2 overflow-hidden lg:block">
          <Image
            src="/pomegranate-oatmeal.png"
            alt="Login illustration"
            fill
            priority
            className="object-cover rounded-2xl "
          />
        </div>

        {/* Right form */}
        <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16">
          
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Welcome back to Healix
            </h1>
            <p className="text-gray-600">Login to continue</p>
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700
                        hover:border-gray-400 hover:bg-gray-50"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="mb-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                          "
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                           "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 font-semibold text-white
                         shadow-md "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-semibold text-green-600 hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}