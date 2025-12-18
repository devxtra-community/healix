import React from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
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

          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                UserName
              </label>
              <input
                type="text"
                placeholder="johndoe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                At least 12 characters
              </p>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-[#6aa342] py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#5a8c38]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
