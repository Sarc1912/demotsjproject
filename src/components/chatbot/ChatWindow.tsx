'use client';

import React, { useState, useEffect, useRef } from "react";
import { chatData } from "./chatData";

import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { checkSolicitud, handleClearChat, handleSendMessage } from "./handlers/HandleMessage";

interface ChatInterface {
  user?: string;
  bot?: string;
}

const ChatWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatInterface[]>(() => {
    if (typeof window !== "undefined") {
      const storedMessages = localStorage.getItem("chatMessages");
      return storedMessages ? JSON.parse(storedMessages) : [];
    }
    return [];
  });

  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleInputSubmit = () => {
    // Extraer el número de la entrada si existe
    const numberMatch = input.match(/\d+/);
  
    if (numberMatch) {
      // Si se encuentra un número, usarlo como un código de solicitud
      const extractedNumber = numberMatch[0]; // Obtener el primer número encontrado
      checkSolicitud(extractedNumber, setMessages);
    } else {
      // Manejarlo como un mensaje general
      handleSendMessage(input, setMessages, chatData);
    }
  
    setInput("");
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <Image
          src="/justice.webp"
          alt="Abrir Chat"
          className="w-32 h-w-32 cursor-pointer hover:scale-110 transition-transform rounded-full"
          onClick={() => setIsOpen(true)}
          width={128}
          height={128}
        />
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg w-[20rem] h-[26rem] flex flex-col border border-gray-300">
          {/* Encabezado */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="/justice.webp"
                alt="Bot Icon"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h2 className="text-lg font-semibold">Asistente Virtual Lex</h2>
            </div>
            <button onClick={() => handleClearChat(setMessages)}>
              <FaTrash />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold hover:text-gray-200"
            >
              ✖
            </button>
          </div>

          {/* Cuerpo del Chat */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center">
                <p>¡Hola! Por favor, indícame el número de caso para que pueda asistirte de la mejor manera posible.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className="flex flex-col">
                {message.user && (
                  <div className="text-right">
                    <span className="inline-block bg-blue-100 text-blue-600 px-3 py-2 rounded-lg">
                      {message.user}
                    </span>
                  </div>
                )}
                {message.bot && (
                  <div className="text-left mt-2">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">
                      {message.bot}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="flex items-center border-t border-gray-300 p-3 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe aquí..."
              className="flex-1 border-none focus:outline-none p-2"
            />
            <button
              onClick={handleInputSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
