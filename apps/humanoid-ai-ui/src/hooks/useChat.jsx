import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const resp = await data.json();
      
      // Log the entire response to see what is being returned
      console.log("Backend response:", resp);
      
      // Log the audio file URL or base64 string (if available)
      if (resp.audio) {
        console.log("Audio file received from backend:", resp.audio);
      } else {
        console.log("No audio file in the response");
      }
      
      // Log each message in the response
      resp.messages.forEach((msg, index) => {
        console.log(`Message ${index + 1}:`, msg);
      });

      setMessages((messages) => [...messages, ...resp.messages]);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
