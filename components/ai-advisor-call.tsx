// components/AIAdvisorCall.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, Mic, Send, MessageSquare } from "lucide-react";
import { useWebRTC } from "@/hooks/use-webrtc";

export function AIAdvisorCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Initialize the WebRTC hook.
  const {
    startSession,
    endSession,
    startRecording,
    stopRecording,
    sendTextMessage,
    connectionStatus,
    transcript,
  } = useWebRTC({
    onMessage: (message) => {
      setMessages((prev) => [...prev, { role: "ai", content: message }]);
    },
  });

  const startCall = async () => {
    try {
      await startSession();
      setIsCallActive(true);
      setMessages([{ role: "ai", content: "Hello! I'm your AI financial advisor. How can I help you today?" }]);
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  const endCall = async () => {
    await endSession();
    setIsCallActive(false);
    setMessages([]);
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
    setIsRecording((prev) => !prev);
  };

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: inputMessage }]);
      try {
        await sendTextMessage(inputMessage);
        setInputMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  useEffect(() => {
    if (transcript) {
      setMessages((prev) => [...prev, { role: "user", content: transcript }]);
    }
  }, [transcript]);

  return (
    <Card className="p-4 bg-background/50 backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI Financial Advisor</h3>
        <div className="flex gap-2">
          {!isCallActive ? (
            <Button
              onClick={startCall}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="h-4 w-4" /> Start Call
            </Button>
          ) : (
            <Button onClick={endCall} variant="destructive" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> End Call
            </Button>
          )}
          <Button onClick={() => setIsChatOpen(!isChatOpen)} variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> {isChatOpen ? "Close Chat" : "Open Chat"}
          </Button>
        </div>
      </div>

      {/* Connection Status Indicator */}
      {isCallActive && (
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-300 ${
              connectionStatus === "connected"
                ? "w-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
                : "w-1/3 bg-yellow-500"
            }`}
          />
        </div>
      )}

      {isChatOpen && (
        <>
          <div className="h-40 mb-4 overflow-y-auto border rounded p-2">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message or speak..."
              className="flex-grow"
            />
            <Button onClick={sendMessage}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant={isRecording ? "destructive" : "outline"} onClick={toggleRecording}>
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
