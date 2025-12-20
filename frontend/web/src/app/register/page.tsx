'use client';

import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // submit register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/register", formData);

      // optional: store token
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // redirect after success
      router.push("/login");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Registration failed");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "YOUR_BACKEND_URL/api/auth/google";
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/pomegranate-oatmeal.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative z-10 m-4 flex w-[1093px] overflow-hidden rounded-3xl bg-white p-5 shadow-2xl">
        <div className="relative hidden w-1/2 md:block">
          <Image
            src="/pomegranate-oatmeal.png"
            alt="Pomegranate Oatmeal"
            fill
            priority
            className="rounded-3xl object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Welcome to Healix
          </h2>

          <button
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t" />
            <span className="mx-2 text-sm text-gray-500">Or</span>
            <div className="flex-grow border-t" />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
            />

            <input
              type="email"
              name="email"
              placeholder="johndoe@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
            />

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                At least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6aa342] py-3 text-white disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="cursor-pointer text-green-600 font-semibold"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
