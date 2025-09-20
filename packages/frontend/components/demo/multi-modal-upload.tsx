"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Music, Video, X, AlertTriangle, CheckCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: "uploading" | "analyzing" | "complete" | "error";
  result?: {
    verdict: "AUTHENTIC" | "DEEPFAKE" | "SUSPICIOUS";
    confidence: number;
    reasoning: string;
  };
}

interface MultiModalUploadProps {
  onFileAnalyzed?: (file: UploadedFile) => void;
  className?: string;
}

export function MultiModalUpload({ onFileAnalyzed, className = "" }: MultiModalUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || 
      file.type.startsWith('audio/') || 
      file.type.startsWith('video/')
    );

    validFiles.forEach(file => {
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        file,
        status: "uploading"
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setUploadedFiles(prev => prev.map(f => f.id === uploadedFile.id ? uploadedFile : f));
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles(prev => [...prev, uploadedFile]);

      // Simulate analysis
      setTimeout(() => {
        const mockResults = [
          { verdict: "AUTHENTIC" as const, confidence: 92, reasoning: "No signs of digital manipulation detected" },
          { verdict: "DEEPFAKE" as const, confidence: 87, reasoning: "Facial inconsistencies and temporal artifacts detected" },
          { verdict: "SUSPICIOUS" as const, confidence: 65, reasoning: "Some anomalies detected, requires manual review" }
        ];

        const result = mockResults[Math.floor(Math.random() * mockResults.length)];
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: "complete", result }
            : f
        ));

        if (onFileAnalyzed) {
          onFileAnalyzed({ ...uploadedFile, status: "complete", result });
        }
      }, 2000 + Math.random() * 3000);
    });
  }, [onFileAnalyzed]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.startsWith('video/')) return Video;
    return Upload;
  };

  const getResultConfig = (verdict: string) => {
    switch (verdict) {
      case "AUTHENTIC":
        return { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle };
      case "DEEPFAKE":
        return { color: "text-red-500", bg: "bg-red-500/10", icon: AlertTriangle };
      case "SUSPICIOUS":
        return { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: AlertTriangle };
      default:
        return { color: "text-blue-500", bg: "bg-blue-500/10", icon: Upload };
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Deepfake Detection</span>
        </CardTitle>
        <CardDescription>
          Upload images, audio, or video files to analyze for deepfake content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/20'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports images, audio, and video files
          </p>
          <input
            type="file"
            multiple
            accept="image/*,audio/*,video/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Analysis Results</h4>
            {uploadedFiles.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file);
              const config = uploadedFile.result ? getResultConfig(uploadedFile.result.verdict) : null;
              const ResultIcon = config?.icon;

              return (
                <div key={uploadedFile.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-card/50">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {uploadedFile.preview ? (
                      <Image 
                        src={uploadedFile.preview} 
                        alt="Preview" 
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Status/Result */}
                  <div className="flex items-center space-x-2">
                    {uploadedFile.status === "uploading" && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    )}
                    
                    {uploadedFile.status === "analyzing" && (
                      <Badge variant="secondary">Analyzing...</Badge>
                    )}
                    
                    {uploadedFile.status === "complete" && uploadedFile.result && (
                      <div className="flex items-center space-x-2">
                        {ResultIcon && <ResultIcon className={`h-4 w-4 ${config?.color}`} />}
                        <Badge variant={uploadedFile.result.verdict === "AUTHENTIC" ? "default" : "destructive"}>
                          {uploadedFile.result.verdict}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {uploadedFile.result.confidence}%
                        </span>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}