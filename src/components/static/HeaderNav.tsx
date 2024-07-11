'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";

const HeaderNav = ({children}: {children: React.ReactNode}) => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
   const [openPanel, setOpenPanel] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Contratos", href: "/contratos" },
    { id: 2, text: "Empresas", href: "/contratos" },
    { id: 3, text: "Instaladores", href: "/contratos" },
    { id: 4, text: "Subir", href: "/contratos" },
  ];

  return (
    <div className="bg-blue-950 flex justify-between items-center h-24 max-w-[1440px] mx-auto px-4 text-white">
      {/* Logo */}
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">SISAGOST</h1>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <Link href={item.href}>
            <li
              key={item.id}
              className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
            >
              {item.text}{" "}
            </li>
          </Link>
        ))}
        <li>
          <button
            onClick={() => setOpenPanel(true)}
            className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          >
            Ajustes
          </button>
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? (
          <AiOutlineMenu size={20} className="hover: cursor-pointer" />
        ) : (
          <AiOutlineMenu size={20} className="hover: cursor-pointer" />
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden right-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-blue-950 ease-in-out duration-500 z-50"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
        {/* Mobile Logo */}

        {/* Mobile Navigation Items */}
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600"
          >
            {item.text}
          </li>
        ))}
        <li
          onClick={() => setOpenPanel(true)}
          className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600"
        >
          Ajustes
        </li>
        <li>
          <div onClick={handleNav} className="flex md:hidden pl-1 pt-3">
            {nav ? (
              <AiOutlineClose size={30} className="hover: cursor-pointer" />
            ) : (
              <AiOutlineClose size={30} className="hover: cursor-pointer" />
            )}
          </div>
        </li>
        <SlidingPanel type={"right"} isOpen={openPanel} size={30}>
          <div className="flex">
            <div>{children}</div>
            <div className="self-end">
              <button onClick={() => setOpenPanel(false)}>cerrar</button>
            </div>
          </div>
        </SlidingPanel>
      </ul>
    </div>
  );
};


export default HeaderNav