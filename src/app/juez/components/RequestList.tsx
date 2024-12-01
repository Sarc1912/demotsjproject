"use client";

import React, { useEffect, useState } from "react";
import { RequestListInterface } from "../interfaces/RequestList";
import Link from "next/link";

const RequestList = () => {
  const [requestList, setRequestList] = useState({} as RequestListInterface)
  
  useEffect(() => {
    if(typeof window !== 'undefined') {
      const data = localStorage.getItem("formData");
      if (data) {
        const requestList: RequestListInterface = JSON.parse(data);
        console.log(requestList);
        setRequestList(requestList);
      }
  }}, []);
  
  return (
    <div className="flex flex-col mt-8 ">
      <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  Representado
                </th>
                <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  Tribunal
                </th>
                <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  Estado de la solicitud
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody className="bg-white">
                <tr>
                    <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="ml-4">
                                <div className="text-sm font-medium leading-5 text-gray-900">{requestList.solicitante?.nombre ?? "nombre"} {requestList.solicitante?.apellido ?? "apellido"}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                        <div className="text-sm leading-5 text-gray-900">{requestList.representado?.nombre ?? "representado"} {requestList.representado?.apellido ?? "representado"}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                        <div className="text-sm leading-5 text-gray-900">{requestList.encabezado?.tribunal ?? "encabezado"}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                            No iniciado
                        </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                        <Link href="juez/1" className="text-indigo-600 hover:text-indigo-900">Ver Solicitud</Link>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestList;
