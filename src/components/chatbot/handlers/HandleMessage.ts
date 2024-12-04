import { ChatInterface } from "../interfaces/ChatInterface";

export const handleSendMessage = (
    input: string,
    setMessages: React.Dispatch<React.SetStateAction<ChatInterface[]>>,
    chatData: { keywords: string[]; response: string }[]
  ) => {
    if (!input.trim()) return;
  
    const response =
      chatData.find((item) =>
        item.keywords.some((keyword) =>
          input.toLowerCase().includes(keyword.toLowerCase())
        )
      )?.response || "Lo siento, no entiendo tu pregunta.";
  
    setMessages((prev) => [...prev, { user: input, bot: response }]);
  };
  
  export const handleClearChat = (
    setMessages: React.Dispatch<React.SetStateAction<ChatInterface[]>>
  ) => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
    }
  };
  
  // Nueva función para verificar solicitudes
  export const checkSolicitud = (
    input: string,
    setMessages: React.Dispatch<React.SetStateAction<ChatInterface[]>>
  ) => {
    if (!input.trim()) return;
  
    // Verificar en localStorage si existe una solicitud con el código proporcionado
    if (typeof window !== "undefined") {
      let solicitudes = JSON.parse(localStorage.getItem("formData") || "[]");

      solicitudes = [solicitudes];
  
      console.log("Solicitudes cargadas:", solicitudes);
  
      // Verificar si el campo `encabezado.expediente` coincide
      const solicitud = solicitudes.find(
        (item: { encabezado: { expediente: string } }) =>
          (item && item.encabezado) ? item.encabezado.expediente === input.trim() : ""
      );
  
      if (solicitud && solicitud !== "") {
        // Generar recomendación aleatoria
        const recomendacion = Math.random() > 0.5 ? "aprobar" : "rechazar";
  
        const botResponse = `Hemos encontrado la solicitud con número ${input}. Basándonos en nuestra evaluación, recomendamos ${recomendacion}.`;
  
        setMessages((prev) => [
          ...prev,
          { user: input, bot: botResponse },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            user: input,
            bot: `No hemos encontrado ninguna solicitud con el código ${input}. Por favor verifica el número e inténtalo de nuevo.`,
          },
        ]);
      }
    }
  };
  
  