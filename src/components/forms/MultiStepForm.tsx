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
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  RequestListInterface,
  Solicitante,
} from "@/app/juez/interfaces/RequestList";

const MultiStepForm = () => {
  const methods = useForm<{ [key: string]: RequestListInterface }>(); // Reemplaza { [key: string]: any } con un tipo específico si lo tienes
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
    const data = localStorage.getItem("formData");
    let savedData;

    if (data && data !== "") {
      savedData = JSON.parse(data);
    }

    if (savedData) {
      // Mostrar SweetAlert cuando la página se recarga
      Swal.fire({
        title: "¿Quieres recuperar los datos?",
        text: "Parece que tienes datos guardados. ¿Quieres continuar desde donde lo dejaste o empezar de nuevo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Recuperar datos",
        cancelButtonText: "Empezar desde el principio",
      }).then((result) => {
        if (result.isConfirmed) {
          // Si elige recuperar datos, inicializamos el formulario con los datos guardados
          methods.reset(savedData);
        } else {
          // Si elige empezar de nuevo, limpiamos los datos en localStorage
          localStorage.removeItem("formData");
          localStorage.removeItem("cedulaFiles"); //
          localStorage.removeItem("documentosFiles"); //
        }
      });
    }
  }, [methods]);

  const handleNext = (data: Record<string, RequestListInterface>) => {
    // Combina los datos actuales con los previos guardados en localStorage
    const savedData = JSON.parse(localStorage.getItem("formData") ?? "{}");
    const updatedData = { ...savedData, ...data };
    localStorage.setItem("formData", JSON.stringify(updatedData));

    const condicion: string =
      (data.solicitante as unknown as Solicitante)?.condicion || "";

    if (currentStep < steps.length - 1) {
      if (condicion == "propio" && currentStep == 1) {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Mostrar SweetAlert cuando el formulario esté completo
      Swal.fire({
        title: "Solicitud Enviada!",
        text: "Se enviará a su correo la respuesta del juez.",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        console.log("Formulario completo:", updatedData); // También puedes enviar los datos a un servidor si lo necesitas
      });
    }
  };

  const handleBack = (data: Record<string, RequestListInterface>) => {
    const condicion: string =
      (data.solicitante as unknown as Solicitante)?.condicion || "";

    if (currentStep > 0) {
      if (condicion === "propio" && currentStep === 3) {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
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
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all ${
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
              onClick={() => handleBack(methods.getValues())} // Obtén los valores actuales del formulario
              className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md focus:outline-none"
            >
              Anterior
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none"
          >
            {currentStep === steps.length - 1 ? "Enviar" : "Siguiente"}
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
            <option value="E">E</option>
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
            <option value="">Seleccione...</option>
            <option value="soltero">Soltero(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viudo">Viudo(a)</option>
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
    getValues,
    formState: { errors },
  } = useFormContext<RequestListInterface>();

  const data = getValues();
  const { condicion } = data.solicitante || {}; // Asegúrate de que 'solicitante' existe

  console.log("Condición:", condicion);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 tsjtitle">
        Identificación del Representado
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nombres:</label>
        <input
          {...register("representado.nombre", {
            required: condicion === "representante" ? "Este campo es obligatorio." : false,
          })}
          className={`w-full px-4 py-2 border ${
            errors.representado?.nombre ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese los nombres del representado"
        />
        {errors.representado?.nombre && (
          <p className="text-red-500 text-sm mt-1">
            {errors.representado.nombre.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Apellidos:</label>
        <input
          {...register("representado.apellido", {
            required: condicion === "representante" ? "Este campo es obligatorio." : false,
          })}
          className={`w-full px-4 py-2 border ${
            errors.representado?.apellido ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese los apellidos del representado"
        />
        {errors.representado?.apellido && (
          <p className="text-red-500 text-sm mt-1">
            {errors.representado.apellido.message}
          </p>
        )}
      </div>

      <div className="mb-4 flex gap-3">
        <div className="flex-1/2">
          <label className="block text-gray-700 font-medium mb-2">Tipo Doc.:</label>
          <select
            {...register("representado.tipoDoc", {
              required: condicion === "representante" ? "Este campo es obligatorio." : false,
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
              required: condicion === "representante" ? "Este campo es obligatorio." : false,
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
          {...register("representado.relacion", {
            required: condicion === "representante" ? "Este campo es obligatorio." : false,
          })}
          className={`w-full px-4 py-2 border ${
            errors.representado?.relacion ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ingrese la relación jurídica (e.g., tutor, apoderado)"
        />
        {errors.representado?.relacion && (
          <p className="text-red-500 text-sm mt-1">
            {errors.representado.relacion.message}
          </p>
        )}
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
        <label className="block text-gray-700 font-medium mb-2">Fecha</label>
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
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestListInterface>();
  const [cedulaFiles, setCedulaFiles] = useState<string[]>([]); // Ahora el estado acepta arreglos de cadenas
  const [documentosFiles, setDocumentosFiles] = useState<string[]>([]);

  // Cargar archivos previamente guardados en localStorage
  useEffect(() => {
    const savedCedulaFiles = localStorage.getItem("cedulaFiles");
    const parsedCedulaFiles = savedCedulaFiles
      ? JSON.parse(savedCedulaFiles)
      : [];

    const savedDocumentosFiles = localStorage.getItem("documentosFiles");
    const parsedDocumentosFiles = savedDocumentosFiles
      ? JSON.parse(savedDocumentosFiles)
      : [];

    setCedulaFiles(parsedCedulaFiles);
    setDocumentosFiles(parsedDocumentosFiles);
  }, []);

  // Manejador para el cambio de archivos de cédula
  const handleCedulaFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const newCedulaFiles = files.map((file) => file.name);

    // Actualizar el estado y guardar los archivos de cédula en localStorage
    setCedulaFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newCedulaFiles];
      localStorage.setItem("cedulaFiles", JSON.stringify(updatedFiles));
      return updatedFiles;
    });
  };

  // Manejador para el cambio de archivos de documentos
  const handleDocumentosFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const newDocumentosFiles = files.map((file) => file.name);

    // Actualizar el estado y guardar los archivos de documentos en localStorage
    setDocumentosFiles((prevFiles: string[]) => {
      const updatedFiles = [...prevFiles, ...newDocumentosFiles]; // Asegúrate de que newDocumentosFiles sea del tipo correcto
      localStorage.setItem("documentosFiles", JSON.stringify(updatedFiles));
      return updatedFiles;
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Recaudos Necesarios
      </h2>

      {/* Copia de la Cédula de Identidad */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Copia de la Cédula de Identidad:
        </label>
        <input
          type="file"
          {...register("recaudos.cedula", {
            required: "Este campo es obligatorio.",
          })}
          className={`w-full px-4 py-2 border ${
            errors.recaudos?.cedula ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={handleCedulaFileChange}
        />
        {errors.recaudos?.cedula && (
          <p className="text-red-500 text-sm mt-1">
            {errors.recaudos.cedula.message}
          </p>
        )}
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
        <input
          type="file"
          multiple
          {...register("recaudos.documentos")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleDocumentosFileChange}
        />
        {/* Mostrar los archivos de los Documentos Probatorios subidos */}
        {documentosFiles.length > 0 && (
          <ul className="mt-2">
            {documentosFiles.map((file, index) => (
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

export default MultiStepForm;
