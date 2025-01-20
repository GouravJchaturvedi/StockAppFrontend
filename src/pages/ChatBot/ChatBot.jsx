import React, { useState } from "react";
import AIChatBox from "./AIChatBox";
import UserChatBox from "./UserChatBox";
import PromptBox from "./PromptBox";
import Header from "@/components/Header";

function ChatBot() {
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDt6aRuVYjf2dWD7nITIZTw3Un90eL-wTE";

  async function generateResponse(message) {
    const summarizedMessage = ` You are a friendly and helpful chatbot. Respond in a concise and user-friendly way:
                                - For technical or doubt-related queries, provide accurate and short answers in a single sentence.
                                - For casual or personal interactions like "Hello" or "How are you," respond in a friendly and conversational manner, like a human.

                                Query: ${message}`;
    let RequestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: summarizedMessage }],
          },
        ],
      }),
    };

    try {
      let response = await fetch(API_URL, RequestOption);
      let data = await response.json();
      let apiResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      console.log(apiResponse);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI", message: apiResponse },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI", message: "Error fetching AI response." },
      ]);
    }
  }

  const [messages, setMessages] = useState([]);

  const handleUserSubmit = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", message },
    ]);

    generateResponse(message);
  };

  return (
    <div className="bg-black min-h-screen">
      <h1 className="text-white p-4">This is a ChatBot.</h1>

      {messages.map((msg, index) => {
        if (msg.sender === "user") {
          return <UserChatBox key={index} message={msg.message} />;
        } else if (msg.sender === "AI") {
          return <AIChatBox key={index} message={msg.message} />;
        }
        return null;
      })}

      <PromptBox onSubmit={handleUserSubmit} />
    </div>
  );
}

export default ChatBot;
