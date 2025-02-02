"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FinancialDataUploaderProps {
  onProcessingStart: () => void;
  onProcessingComplete: () => void;
}

export function FinancialDataUploader({ 
  onProcessingStart, 
  onProcessingComplete 
}: FinancialDataUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    onProcessingStart();

    try {
      const text = await file.text();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        onProcessingComplete();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-background/50 backdrop-blur">
      <h3 className="text-xl font-semibold mb-4">Welcome to Midas!</h3>
      <p className="text-muted-foreground mb-6">
        Upload your financial data to get started.
      </p>
      <Input 
        type="file" 
        accept=".txt"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={!file || loading}
        className="w-full"
      >
        {loading ? "Processing with AI..." : "Upload & Process Data"}
      </Button>
    </div>
  );
}