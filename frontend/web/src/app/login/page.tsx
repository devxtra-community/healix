'use client';

import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import api from "@/src/lib/axios";

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
    // Clear error immediately when user starts typing again
    if (error) setError(""); 
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
      console.error("Full Error Object:", err);
      
      // CAPTURE THE BACKEND MESSAGE HERE
      const msg = err?.response?.data?.message;

      // Display it
      setError(msg || "Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:4001/api/v1/auth/google";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50">
      
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/pomegranate-oatmeal.png"
          alt="Background"
          fill
          priority
          className="object-cover blur-[3px] opacity-100"
        />
      </div>

      <div className="relative z-10 mx-4 flex w-full max-w-6xl min-h-[650px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        <div className="relative hidden w-1/2 m-6 overflow-hidden lg:block rounded-2xl">
          <Image
          src="/images/pomegranate-oatmeal.png"
            alt="Login illustration"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16">
          
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Welcome back to Healix
            </h1>
            <p className="text-gray-600">Login to continue</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>
          
          <div className="mb-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Error Message Display Area */}
          <div className="min-h-[24px] mb-4">
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 animate-pulse">
                {error}
              </div>
            )}
          </div>

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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 font-semibold text-white shadow-md hover:from-green-700 hover:to-green-800 disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

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