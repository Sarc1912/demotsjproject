// app/layout.tsx
import Image from "next/image";
import DropdownMenu from "../components/dropdown/DropdownMenu"; // Asegúrate de importar el componente
import UsersIcons from "@/components/users/UsersIcons";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TSJ",
  description: "Solicitud de amparo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="antialiased"
      >
        <div className="bg-tsjcolor text-white p-4 flex justify-between items-center">
          <div className="flex items-center ">
            <div className="flex items-center justify-center w-20 h-20 bg-white border-4 border-tsjcolor rounded-full">
              <Image
                src="/logo_tsj.png"
                width={60}
                height={60}
                alt="Logo TSJ"
              />
            </div>
            <h1 className="text-4xl text-white font-bold ml-4 tsjtitle">
              Tribunal Supremo de Justicia
            </h1>
          </div>

          {/* Ícono de sesión iniciada y menú desplegable */}
          <div className="flex items-center">
            <UsersIcons />
            <DropdownMenu /> {/* Aquí está el menú desplegable */}
          </div>
        </div>
        <div className="p-10">

        {children}
        </div>
      </body>
    </html>
  );
}
