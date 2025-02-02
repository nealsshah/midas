// hooks/use-webrtc.ts
"use client";

import { useState, useRef } from "react";

type UseWebRTCHookProps = {
  onMessage: (message: string) => void;
};

export function useWebRTC({ onMessage }: UseWebRTCHookProps) {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [transcript, setTranscript] = useState("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Establish the WebRTC connection.
  const startSession = async () => {
    try {
      // 1. Fetch the ephemeral token from your API route.
      const tokenResponse = await fetch("/api/session");
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      // 2. Create a new RTCPeerConnection.
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3. Set up remote audio playback.
      pc.ontrack = (e) => {
        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        audioEl.srcObject = e.streams[0];
        document.body.appendChild(audioEl);
      };

      // 4. Capture local audio (from the microphone).
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 5. Create a data channel for realtime events.
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          // Optionally update transcript if the event indicates so.
          if (event.type === "transcript") {
            setTranscript(event.text || "");
          }
          // Pass the received message to the provided onMessage callback.
          onMessage(event.text || JSON.stringify(event));
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };

      // 6. Create an SDP offer.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 7. Send the offer’s SDP to the Realtime API.
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      // 8. Set the remote description using the SDP answer.
      const answerSdp = await sdpResponse.text();
      const answer = { type: "answer", sdp: answerSdp };
      await pc.setRemoteDescription(answer);

      setConnectionStatus("connected");
    } catch (error) {
      console.error("Error starting session:", error);
      setConnectionStatus("error");
      throw error;
    }
  };

  // Terminate the session and clean up.
  const endSession = async () => {
    try {
      if (dcRef.current) dcRef.current.close();
      if (pcRef.current) pcRef.current.close();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      pcRef.current = null;
      dcRef.current = null;
      mediaStreamRef.current = null;
      setConnectionStatus("disconnected");
      setTranscript("");
    }
  };

  // Send a text message over the data channel.
  const sendTextMessage = async (message: string) => {
    if (!dcRef.current || dcRef.current.readyState !== "open") {
      throw new Error("Data channel is not open");
    }
    const payload = {
      type: "response.create",
      response: {
        modalities: ["text"],
        instructions: message,
      },
    };
    dcRef.current.send(JSON.stringify(payload));
  };

  // Simple implementation of recording using MediaRecorder.
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startRecording = async () => {
    if (!mediaStreamRef.current) {
      throw new Error("No media stream available");
    }
    const recorder = new MediaRecorder(mediaStreamRef.current);
    recorderRef.current = recorder;
    recorder.start();
    recorder.ondataavailable = (event) => {
      console.log("Recorded data chunk:", event.data);
    };
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
  };

  return {
    startSession,
    endSession,
    startRecording,
    stopRecording,
    sendTextMessage,
    connectionStatus,
    transcript,
  };
}
