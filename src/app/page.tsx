"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Input,
  ShowHideButtom,
  NetunoLogo,
  SingInButtom,
} from "../components/ui/index";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white shadow-lg rounded-xl p-8 pb-3 mt-8">
        <h2 className="text-2xl font-bold font-arial  mb-4 text-center text-black">
          Inicia Sesión
        </h2>
        <div className="flex justify-center items-center bg-white rounded-lg p-2 mt-4">
          <NetunoLogo />
        </div>
        <form>
          <div className="mb-4">
            <Input
              placeholder="Correo Electrónico"
              type="email"
              id="email"
              required
              name="email"
            />
          </div>
          <div className="mb-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="contraseña"
                name="contraseña"
                placeholder="Contraseña"
                required
              />
              <ShowHideButtom />
            </div>
          </div>
          <div className="text-sm">
            <Link
              href="#"
              className="text-blue-600 hover:underline font-arial text-sm"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div>
            <SingInButtom type="submit">Log In </SingInButtom>
            <p className="mt-4 text-center text-gray-600 font-arial text-xs">
              Don't have an account?{" "}
              <Link
                href="#"
                className="font-bold text-blue-600 hover:underline font-arial text-xs"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
