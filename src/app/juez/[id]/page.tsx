"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { FiCheckCircle } from "react-icons/fi";
import {
  FaUser,
  FaIdCard,
  FaClipboard,
  FaGavel,
  FaBalanceScale,
  FaFileAlt,
  FaArchive,
  FaSignature,
  FaFileContract,
  FaImage,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { RequestListInterface } from "../interfaces/RequestList";
import Image from "next/image";
import { FaFilePdf } from "react-icons/fa6";

const RequestUser = () => {
  const methods = useForm<{ [key: string]: RequestListInterface }>(); // Reemplaza { [key: string]: RequestListInterface } con un tipo específico si lo tienes
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    <Encabezado key="step1" />,
    <IdentificacionSolicitante key="step2" />,
    <IdentificacionRepresentado key="step3" />,
    <IdentificacionPresuntoAgraviante key="step4" />,
    <DescripcionHechos key="step5" />,
    <FundamentosJuridicos key="step6" />,
    <MedidasCautelares key="step7" />,
    <RecaudosNecesarios key="step8" />,
    <DeclaracionJurada key="step9" />,
  ];

  const stepIcons = [
    <FaUser className="size-8" key={1} />,
    <FaIdCard className="size-8" key={2} />,
    <FaClipboard className="size-8" key={3} />,
    <FaGavel className="size-8" key={4} />,
    <FaBalanceScale className="size-8" key={5} />,
    <FaFileAlt className="size-8" key={6} />,
    <FaArchive className="size-8" key={7} />,
    <FaSignature className="size-8" key={8} />,
    <FaFileContract className="size-8" key={9} />,
  ];

  useEffect(() => {
    let savedData;
    const data = localStorage.getItem("formData");

    if (data) {
      savedData = JSON.parse(data);
    }

    if (savedData) {
      // Recuperamos los datos de forma automática sin mostrar la alerta
      methods.reset(savedData);
    }
  }, [methods]);

  const handleNext = (data: Record<string, RequestListInterface>) => {
    const savedData = JSON.parse(localStorage.getItem("formData") ?? "{}");
    const updatedData = { ...savedData, ...data };

    // Antes de guardar los datos aprobados, elimina noAprove si existe
    localStorage.removeItem("noAprove");

    // Guardar los datos aprobados en aproveData en localStorage
    const newAproveData = { ...updatedData, status: "aprobado" };
    const existingAproveData = JSON.parse(
      localStorage.getItem("aproveData") ?? "[]"
    );
    existingAproveData.push(newAproveData);
    localStorage.setItem("aproveData", JSON.stringify(existingAproveData));

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {

      console.log(savedData.encabezado.expediente);
      // Mostrar SweetAlert cuando el formulario esté completo
      Swal.fire({
        title: "Solicitud Aprobada!",
        text: "Se ha aprobado la solicitud Nro.: "+ savedData.encabezado.expediente,
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        console.log("Formulario aprobado:", updatedData); // También puedes enviar los datos a un servidor si lo necesitas
      });
    }
  };

  // handleAprove guarda los datos en noAprove con el estado 'no aprobado'
  const handleAprove = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, rechazar!",
      input: "textarea",
      inputPlaceholder: "Escribe el motivo del rechazo...",
      inputValidator: (value) => {
        if (!value) {
          return "Debes escribir un motivo!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Antes de guardar los datos no aprobados, elimina aproveData si existe
        localStorage.removeItem("aproveData");

        // Guardar los datos no aprobados en noAprove en localStorage
        const savedData = JSON.parse(localStorage.getItem("formData") ?? "{}");
        const updatedData = {
          ...savedData,
          status: "no aprobado",
          motivo: result.value,
        };

        // Guardar en noAprove
        const existingNoAprove = JSON.parse(
          localStorage.getItem("noAprove") ?? "[]"
        );
        existingNoAprove.push(updatedData);
        localStorage.setItem("noAprove", JSON.stringify(existingNoAprove));

        Swal.fire("No Aprobado!", "Ha rechazado la solicitud.", "success");
      }
    });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleNext)}
        className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg"
      >
        {/* Indicadores de pasos con iconos */}
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center flex-col transition-all ${
                currentStep === index ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                onClick={() => setCurrentStep(index)} // Esto permite que se navegue directamente al paso
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                  currentStep === index
                    ? "bg-tsjcolor text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {stepIcons[index]}
              </div>
              <div className="text-xs mt-2">{index + 1}</div>
            </div>
          ))}
        </div>

        {/* Paso actual */}
        {steps[currentStep]}

        <div className="mt-6 flex justify-between items-center">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md focus:outline-none"
            >
              Anterior
            </button>
          )}

          {/* Botón para rechazar */}
          {currentStep === steps.length - 1 && (
            <button
              type="button"
              onClick={handleAprove}
              className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none mt-4"
            >
              Rechazar
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none"
          >
            {currentStep === steps.length - 1 ? "Aprobar" : "Siguiente"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

const Encabezado = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 tsjtitle">
        Encabezado del Formulario
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Nombre del tribunal competente:
        </label>
        <input
          {...register("encabezado.tribunal", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.encabezado?.tribunal ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese el nombre del tribunal"
          readOnly // Haciendo el input
        />
        {errors.encabezado?.tribunal && (
          <p className="text-red-500 text-sm mt-1">
            {errors.encabezado.tribunal.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Número de expediente:
        </label>
        <input
          {...register("encabezado.expediente")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese el número de expediente (si aplica)"
          readOnly // Haciendo el input no editable
        />
      </div>
    </div>
  );
};

const IdentificacionSolicitante = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 tsjtitle">
        Identificación del Solicitante
      </h2>

      <div className="mb-4 flex space-x-4">
        {/* Nombres */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Nombres:
          </label>
          <input
            readOnly
            {...register("solicitante.nombre", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-full px-4 py-2 border ${
              errors.solicitante?.nombre ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ingrese los nombres"
          />
          {errors.solicitante?.nombre && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.nombre.message}
            </p>
          )}
        </div>

        {/* Apellidos */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Apellidos:
          </label>
          <input
            readOnly
            {...register("solicitante.apellido", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-full px-4 py-2 border ${
              errors.solicitante?.apellido
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ingrese los apellidos"
          />
          {errors.solicitante?.apellido && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.apellido.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 flex space-x-4">
        {/* Tipo de Documento */}
        <div className="flex-1/2">
          <label className="block text-gray-700 font-medium mb-2">
            Tipo Doc.:
          </label>
          <select
            {...register("solicitante.tipoDoc", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-[70px] px-4 py-2 border ${
              errors.solicitante?.tipoDoc ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="V">V</option>
          </select>
          {errors.solicitante?.tipoDoc && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.tipoDoc.message}
            </p>
          )}
        </div>
        {/* Cédula de Identidad */}
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">
            Cédula de Identidad:
          </label>
          <input
            readOnly
            {...register("solicitante.cedula", {
              required: "Este campo es obligatorio.",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números.",
              },
            })}
            className={`w-[215px] px-4 py-2 border ${
              errors.solicitante?.cedula ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ingrese la cédula de identidad"
          />
          {errors.solicitante?.cedula && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.cedula.message}
            </p>
          )}
        </div>

        {/* Estado Civil */}
        <div className="flex-1" style={{ marginLeft: -70 }}>
          <label className="block text-gray-700 font-medium mb-2">
            Estado civil:
          </label>
          <select
            {...register("solicitante.estadoCivil", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-full px-4 py-2 border ${
              errors.solicitante?.estadoCivil
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="soltero">Soltero(a)</option>
          </select>
          {errors.solicitante?.estadoCivil && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.estadoCivil.message}
            </p>
          )}
        </div>
      </div>

      {/* Domicilio */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Domicilio:
        </label>
        <input
          readOnly
          {...register("solicitante.domicilio", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.solicitante?.domicilio ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese la dirección completa"
        />
        {errors.solicitante?.domicilio && (
          <p className="text-red-500 text-sm mt-1">
            {errors.solicitante.domicilio.message}
          </p>
        )}
      </div>

      {/* Teléfonos de contacto */}
      <div className="mb-4 flex space-x-4">
        {/* Teléfono Celular */}
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">
            Teléfono Celular:
          </label>
          <input
            readOnly
            {...register("solicitante.telefonoCelular", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-full px-4 py-2 border ${
              errors.solicitante?.telefonoCelular
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ingrese el teléfono celular"
          />
          {errors.solicitante?.telefonoCelular && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.telefonoCelular.message}
            </p>
          )}
        </div>

        {/* Teléfono Local */}
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">
            Teléfono Local:
          </label>
          <input
            readOnly
            {...register("solicitante.telefonoLocal", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-full px-4 py-2 border ${
              errors.solicitante?.telefonoLocal
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ingrese el teléfono local"
          />
          {errors.solicitante?.telefonoLocal && (
            <p className="text-red-500 text-sm mt-1">
              {errors.solicitante.telefonoLocal.message}
            </p>
          )}
        </div>
      </div>

      {/* Correo Electrónico */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Correo Electrónico:
        </label>
        <input
          readOnly
          {...register("solicitante.correo", {
            required: "Este campo es obligatorio.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Por favor, ingrese un correo electrónico válido.",
            },
          })}
          className={`w-full px-4 py-2 border ${
            errors.solicitante?.correo ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese el correo electrónico"
        />
        {errors.solicitante?.correo && (
          <p className="text-red-500 text-sm mt-1">
            {errors.solicitante.correo.message}
          </p>
        )}
      </div>

      {/* Condición Jurídica */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Condición jurídica del solicitante:
        </label>
        <select
          {...register("solicitante.condicion", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.solicitante?.condicion ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="">Seleccione...</option>
          <option value="propio">Actúa en nombre propio</option>
          <option value="representante">Actúa como representante</option>
        </select>
        {errors.solicitante?.condicion && (
          <p className="text-red-500 text-sm mt-1">
            {errors.solicitante.condicion.message}
          </p>
        )}
      </div>
    </div>
  );
};

const IdentificacionRepresentado = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 tsjtitle">
        Identificación del Representado
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nombres:</label>
        <input
          readOnly
          {...register("representado.nombre")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese los nombres del representado"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Apellidos:
        </label>
        <input
          readOnly
          {...register("representado.apellido")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese los apellidos del representado"
        />
      </div>

      <div className="mb-4 flex gap-3">
        <div className="flex-1/2">
          <label className="block text-gray-700 font-medium mb-2">
            Tipo Doc.:
          </label>
          <select
            {...register("representado.tipoDoc", {
              required: "Este campo es obligatorio.",
            })}
            className={`w-[70px] px-4 py-2 border ${
              errors.representado?.tipoDoc ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="V">V</option>
            <option value="E">E</option>
          </select>
          {errors.representado?.tipoDoc && (
            <p className="text-red-500 text-sm mt-1">
              {errors.representado.tipoDoc.message}
            </p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">
            Cédula de Identidad:
          </label>
          <input
            {...register("representado.cedula", {
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números.",
              },
            })}
            className={`w-full px-4 py-2 border ${
              errors.representado?.cedula ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ingrese la cédula de identidad del representado"
          />
          {errors.representado?.cedula && (
            <p className="text-red-500 text-sm mt-1">
              {errors.representado.cedula.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Relación Jurídica:
        </label>
        <input
          readOnly
          {...register("representado.relacion")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese la relación jurídica (e.g., tutor, apoderado)"
        />
      </div>
    </div>
  );
};

const IdentificacionPresuntoAgraviante = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Identificación del Presunto Agraviante
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Nombre o Razón Social:
        </label>
        <input
          readOnly
          {...register("agraviante.nombre", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.agraviante?.nombre ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese el nombre o razón social del presunto agraviante"
        />
        {errors.agraviante?.nombre && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agraviante.nombre.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Cargo o Representación:
        </label>
        <input
          readOnly
          {...register("agraviante.cargo")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese el cargo o representación (si aplica)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Domicilio:
        </label>
        <input
          readOnly
          {...register("agraviante.domicilio", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.agraviante?.domicilio ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese el domicilio del presunto agraviante"
        />
        {errors.agraviante?.domicilio && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agraviante.domicilio.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Teléfono</label>
        <input
          readOnly
          {...register("agraviante.telefono")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese el teléfono (si se conoce)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Correo Electrónico{" "}
        </label>
        <input
          readOnly
          {...register("agraviante.correo", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Por favor, ingrese un correo electrónico válido.",
            },
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese el correo electrónico (si se conoce)"
        />
        {errors.agraviante?.correo && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agraviante.correo.message}
          </p>
        )}
      </div>
    </div>
  );
};

const DescripcionHechos = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Descripción de los Hechos
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Narrativa de los Hechos:
        </label>
        <textarea
          {...register("hechos.narrativa", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.hechos?.narrativa ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Describa los hechos de forma clara y cronológica"
        ></textarea>
        {errors.hechos?.narrativa && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hechos.narrativa.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Lugar de los hechos:
        </label>
        <input
          {...register("hechos.lugar", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.hechos?.lugar ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Indique el lugar de los hechos"
        />
        {errors.hechos?.lugar && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hechos.lugar.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Fecha
        </label>
        <input
          type="date"
          {...register("hechos.fecha", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.hechos?.fecha ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.hechos?.fecha && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hechos.fecha.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Circunstancias:
        </label>
        <textarea
          {...register("hechos.circunstancias", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.hechos?.circunstancias ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Indique las circunstancias de los hechos"
        ></textarea>
        {errors.hechos?.circunstancias && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hechos.circunstancias.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Derechos Constitucionales Vulnerados:
        </label>
        <textarea
          {...register("hechos.derechos", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.hechos?.derechos ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Especifique los derechos constitucionales vulnerados"
        ></textarea>
        {errors.hechos?.derechos && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hechos.derechos.message}
          </p>
        )}
      </div>
    </div>
  );
};

const FundamentosJuridicos = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Fundamentos Jurídicos
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Normas Constitucionales Aplicables:
        </label>
        <textarea
          {...register("juridicos.normas", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.juridicos?.normas ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Escriba las normas constitucionales aplicables"
        ></textarea>
        {errors.juridicos?.normas && (
          <p className="text-red-500 text-sm mt-1">
            {errors.juridicos.normas.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Jurisprudencia (opcional):
        </label>
        <textarea
          {...register("juridicos.jurisprudencia")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cite la jurisprudencia relevante (opcional)"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Solicitudes Concretas al Tribunal:
        </label>
        <textarea
          {...register("juridicos.solicitudes", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.juridicos?.solicitudes ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Escriba las solicitudes concretas al tribunal"
        ></textarea>
        {errors.juridicos?.solicitudes && (
          <p className="text-red-500 text-sm mt-1">
            {errors.juridicos.solicitudes.message}
          </p>
        )}
      </div>
    </div>
  );
};

const MedidasCautelares = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Medidas Cautelares
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Especificar Medidas Urgentes:
        </label>
        <textarea
          {...register("cautelares.medidas", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.cautelares?.medidas ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Escriba las medidas cautelares urgentes que solicita"
        ></textarea>
        {errors.cautelares?.medidas && (
          <p className="text-red-500 text-sm mt-1">
            {errors.cautelares.medidas.message}
          </p>
        )}
      </div>
    </div>
  );
};

const RecaudosNecesarios = () => {
  const [cedulaFiles, setCedulaFiles] = useState([]);

  // Cargar archivos previamente guardados en localStorage
  useEffect(() => {
    const savedCedulaFiles = localStorage.getItem("cedulaFiles");
    const parsedCedulaFiles = savedCedulaFiles ? JSON.parse(savedCedulaFiles) : [];
  
    setCedulaFiles(parsedCedulaFiles);
  }, []);
  

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recaudos</h2>

      {/* Copia de la Cédula de Identidad */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Copia de la Cédula de Identidad:
        </label>

        <div className="flex items-center justify-center">
          <Image src={"/id_card.webp"} width={500} height={500} alt="Id" />
        </div>

        {/* Mostrar los archivos de la Cédula de Identidad subidos */}
        {cedulaFiles.length > 0 && (
          <ul className="mt-2">
            {cedulaFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center text-green-600 text-sm mt-1"
              >
                <FiCheckCircle className="mr-2" /> {file}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Documentos Probatorios */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Documentos Probatorios:
        </label>
        <div className="flex items-center justify-center gap-6">
          <FaFilePdf size={80} />
          <FaImage size={80} />
          <FaImage size={80} />
          <FaFilePdf size={80} />
        </div>
      </div>
    </div>
  );
};

const DeclaracionJurada = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Declaración Jurada
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Nombre del Abogado:
        </label>
        <input
          readOnly
          {...register("declaracion.abogado", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.declaracion?.abogado ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese el nombre del abogado"
        />
        {errors.declaracion?.abogado && (
          <p className="text-red-500 text-sm mt-1">
            {errors.declaracion.abogado.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Número de INPREABOGADO:
        </label>
        <input
          readOnly
          {...register("declaracion.inpreabogado", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.declaracion?.inpreabogado
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese el número de INPREABOGADO"
        />
        {errors.declaracion?.inpreabogado && (
          <p className="text-red-500 text-sm mt-1">
            {errors.declaracion.inpreabogado.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Fecha y Lugar de Presentación:
        </label>
        <input
          readOnly
          type="date"
          {...register("declaracion.fecha", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.declaracion?.fecha ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.declaracion?.fecha && (
          <p className="text-red-500 text-sm mt-1">
            {errors.declaracion.fecha.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestUser;
