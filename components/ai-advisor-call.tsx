// components/AIAdvisorCall.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, Mic, Send, MessageSquare, Timer } from "lucide-react";
import { useWebRTC } from "@/hooks/use-webrtc";

export function AIAdvisorCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCallActive]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      await startSession();
      setIsCallActive(true);
      setSeconds(0);
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
    setSeconds(0);
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
    <Card className="border border-primary/20 bg-background/50 backdrop-blur">
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="relative h-2 w-2">
            <div className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-yellow-500 to-primary animate-wave" />
          </div>
          <h3 className="text-sm font-medium">AI Financial Advisor</h3>
        </div>
        <div className="flex items-center gap-4">
          {isCallActive && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatTime(seconds)}</span>
            </div>
          )}
          {!isCallActive ? (
            <Button
              onClick={startCall}
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" /> Start Call
            </Button>
          ) : (
            <Button 
              onClick={endCall} 
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <Phone className="h-4 w-4" /> End Call
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status Indicator */}
      {isCallActive && (
        <div className="px-4 py-2">
          <div className="h-1.5 bg-primary/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                connectionStatus === "connected"
                  ? "w-full bg-gradient-to-r from-primary/50 to-primary animate-pulse"
                  : "w-1/3 bg-yellow-500/50"
              }`}
            />
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="p-4 pt-2">
          <div className="h-[200px] mb-3 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    message.role === "user" 
                      ? "bg-primary/10 text-primary ml-4" 
                      : "bg-muted/50 text-foreground mr-4"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-grow bg-muted/50 border-primary/20 text-sm"
            />
            <Button 
              onClick={sendMessage}
              size="icon"
              variant="ghost"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 transition-colors ${
                isRecording ? "text-red-500 hover:text-red-600" : "hover:text-primary"
              }`}
              onClick={toggleRecording}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
