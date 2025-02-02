"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FinancialDataUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
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

    try {
      // Read the text file content
      const text = await file.text();
      
      // Send the text content to the API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="text-lg font-semibold mb-2">Upload Financial Data</h3>
      <Input 
        type="file" 
        accept=".txt"
        onChange={handleFileChange}
        className="mb-2"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={!file || loading} 
        className="mt-2"
      >
        {loading ? "Processing with AI..." : "Process Data"}
      </Button>
      {result && (
        <div className="mt-4">
          <h4 className="font-bold">Converted Finances JSON:</h4>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}