"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaCog } from "react-icons/fa";
import { usePathname } from "next/navigation";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = pathname.startsWith("/juez") ? (
    <>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
          Perfil
        </a>
        <a href="/juez" className="block px-4 py-2 hover:bg-gray-100">
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
          Solicitudes pendientes
        </a>
      </li>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
          Cerrar sesión
        </a>
      </li>
    </>
  ) : (
    <>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
          Perfil
        </a>
      </li>
      <li>
        <a href="/solicitudes" className="block px-4 py-2 hover:bg-gray-100">
          Mis Solicitudes
        </a>
      </li>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
          Cerrar sesión
        </a>
      </li>
    </>
  );

  return (
    <div className="relative">
      {/* Botón de menú */}
      <button
        onClick={toggleMenu}
        className="p-3 bg-white rounded-full text-tsjcolor hover:bg-gray-200 transition"
      >
        <FaCog size={24} />
      </button>

      {/* Menú desplegable */}
      <motion.div
        className="absolute top-12 right-0 w-48 bg-white text-tsjcolor shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={toggleMenu}
            className="p-0 pr-2 text-gray-600 hover:text-tsjcolor"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <ul className="py-2">{menuItems}</ul>
      </motion.div>
    </div>
  );
};

export default DropdownMenu;
