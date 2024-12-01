"use client";

import React, { useEffect, useState } from "react";
import { RequestListInterface } from "../juez/interfaces/RequestList";
import Link from "next/link";

interface DataInterface extends RequestListInterface {
  status: string;
  motivo?: string;
}

const Page = () => {
  const [data, setData] = useState<DataInterface[]>([]);

  useEffect(() => {
    // Traer los datos desde localStorage al cargar la página
    const aprove = localStorage.getItem("aproveData");
    const noAprove = localStorage.getItem("noAprove");

    let combinedData: DataInterface[] = [];

    if (aprove !== null) {
      const approveData = JSON.parse(aprove);
      combinedData = [...combinedData, ...approveData];
    }

    if (noAprove !== null) {
      const noAproveData = JSON.parse(noAprove);
      combinedData = [...combinedData, ...noAproveData];
    }

    setData(combinedData);
  }, []);

  console.log(data);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-8 mt-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Mis Solicitudes
      </h1>

      {/* Crear solicitud */}
      <div className="mb-6 text-right">
        <Link
          href={"/"}
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          Crear Solicitud
        </Link>
      </div>

      {/* Tabla de solicitudes */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-4 text-left font-medium border-b">
                Expediente
              </th>
              <th className="px-6 py-4 text-left font-medium border-b">
                Abogado
              </th>
              <th className="px-6 py-4 text-left font-medium border-b">
                Estatus
              </th>
              <th className="px-6 py-4 text-left font-medium border-b">
                Motivo (si aplica)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 text-gray-800">
                    {item.encabezado.expediente}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.declaracion.abogado}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-full ${
                        item.status === "aprobado"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.status === "no aprobado" && item.motivo
                      ? item.motivo
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No hay solicitudes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
