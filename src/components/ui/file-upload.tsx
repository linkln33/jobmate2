"use client";

import * as React from "react";
import { UploadCloud, X, FileIcon, ImageIcon, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  value?: File[];
  className?: string;
  disabled?: boolean;
  variant?: "default" | "compact";
  allowPreview?: boolean;
}

export function FileUpload({
  accept = "*/*",
  maxSize = 5, // 5MB default
  maxFiles = 1,
  onFilesChange,
  value = [],
  className,
  disabled = false,
  variant = "default",
  allowPreview = true,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>(value);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isCompact = variant === "compact";

  React.useEffect(() => {
    setFiles(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    validateAndSetFiles(selectedFiles);
    // Reset the input value so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateAndSetFiles = (selectedFiles: File[]) => {
    setError(null);

    // Check number of files
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}`);
      return;
    }

    // Check file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`File${oversizedFiles.length > 1 ? 's' : ''} exceed${oversizedFiles.length === 1 ? 's' : ''} the maximum size of ${maxSize}MB`);
      return;
    }

    // Check file type
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map(type => type.trim());
      const invalidFiles = selectedFiles.filter(file => {
        return !acceptedTypes.some(type => {
          if (type.endsWith("/*")) {
            const mainType = type.split("/")[0];
            return file.type.startsWith(`${mainType}/`);
          }
          return file.type === type;
        });
      });

      if (invalidFiles.length > 0) {
        setError(`Invalid file type${invalidFiles.length > 1 ? 's' : ''}`);
        return;
      }
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />;
    } else if (file.type.startsWith("text/") || file.type.includes("pdf")) {
      return <FileText className="h-5 w-5" />;
    } else {
      return <FileIcon className="h-5 w-5" />;
    }
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/") && allowPreview) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg",
          isDragging ? "border-primary bg-primary/5" : "border-input",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          isCompact ? "p-4" : "p-8"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <UploadCloud className={cn("text-muted-foreground", isCompact ? "h-8 w-8" : "h-10 w-10")} />
          <div className="space-y-1">
            <p className={cn("text-muted-foreground", isCompact ? "text-sm" : "text-base")}>
              Drag & drop {maxFiles > 1 ? "files" : "file"} here, or <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {accept === "*/*" ? "Any file format" : `Accepted formats: ${accept}`} up to {maxSize}MB
              {maxFiles > 1 ? ` (max ${maxFiles} files)` : ""}
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <div className="flex items-center text-destructive text-sm space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const preview = getFilePreview(file);
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 border rounded-md bg-background"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {preview ? (
                    <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                        onLoad={() => URL.revokeObjectURL(preview)}
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
