
"use client";

import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Upload, XCircle, Link as LinkIcon, FileText } from "lucide-react";
import { useData } from "@/lib/data-context";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface ResumeUploadFieldProps {
  name: string;
  label: string;
}

export function ResumeUploadField({ name, label }: ResumeUploadFieldProps) {
  const { uploadFile: uploadFileToStorage } = useData();
  const { setValue, watch } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileUrl = watch(name);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      const uploadedUrl = await uploadFileToStorage(file, `resumes/${Date.now()}_${file.name}`, (progress) => {
        setUploadProgress(progress);
      });
      if (uploadedUrl) {
        setValue(name, uploadedUrl, { shouldValidate: true });
      }
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <FormItem className="space-y-4 rounded-lg border p-4">
      <FormLabel>{label}</FormLabel>
      {fileUrl ? (
        <div className="relative group w-full p-4 rounded-md border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Resume uploaded</span>
                    <Link href={fileUrl} target="_blank" className="text-xs text-muted-foreground hover:underline">
                        View resume
                    </Link>
                </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={handleRemoveFile}
            >
              <XCircle className="h-5 w-5" />
            </Button>
        </div>
      ) : (
        <div
          className="w-full h-24 rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">Uploading...</p>
              <Progress value={uploadProgress} className="w-3/4" />
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click or drag to upload PDF</p>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf"
        disabled={isUploading}
      />
      <FormMessage />
    </FormItem>
  );
}
