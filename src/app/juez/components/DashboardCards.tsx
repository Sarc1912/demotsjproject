import React from "react";
import { FaCheck } from "react-icons/fa"; // Importamos los iconos de react-icons
import clsx from "clsx"; // Importamos clsx
import { FaX } from "react-icons/fa6";
import { CgSandClock } from "react-icons/cg";

// Definimos la interfaz para los objetos del array
interface CardData {
  title: string;
  color: string;
  icon: React.ReactNode;
  value: string;
  description: string;
}

const DashboardCards = () => {
  // Mapa de colores para las tarjetas
  const colorMap: Record<string, string> = {
    "green": "bg-green-600",
    "red": "bg-red-600",
    'yellow': "bg-yellow-600",
  };

  // Array de objetos que contiene la información para cada tarjeta
  const cardsData: CardData[] = [
    {
      title: "0",
      color: "green", // Color a utilizar
      icon: <FaCheck className="w-8 h-8 text-white" />,
      value: "0",
      description: "Solicitudes aceptadas",
    },
    {
      title: "0",
      color: "red", // Color a utilizar
      icon: <FaX className="w-8 h-8 text-white" />,
      value: "0",
      description: "Solicitudes rechazadas",
    },
    {
      title: "1",
      color: "yellow", // Otro color
      icon: <CgSandClock className="w-8 h-8 text-white" />,
      value: "0",
      description: "Solicitudes en evaluación",
    },
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap -mx-6">
        {/* Mapeamos el array cardsData para generar las tarjetas dinámicamente */}
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-6 sm:mt-0"
          >
            <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
              <div
                className={clsx(
                  "p-3 bg-opacity-75 rounded-full",
                  colorMap[card.color] // Usamos el mapa de colores para asignar la clase bg dinámica
                )}
              >
                {card.icon} {/* Insertamos el ícono */}
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">
                  {card.value} {/* Mostramos el valor */}
                </h4>
                <div className="text-gray-500">{card.description}</div> {/* Descripción */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
