
"use client";

import React, { useRef, useState } from "react";
import { useFormContext }_ from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useData } from "@/lib/data-context";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  folder: string;
}

export function ImageUploadField({ name, label, folder }: ImageUploadFieldProps) {
  const { uploadFile: uploadFileToStorage } = useData();
  const { setValue, watch } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageUrl = watch(name);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      const uploadedUrl = await uploadFileToStorage(file, `${folder}/${Date.now()}_${file.name}`, (progress) => {
        setUploadProgress(progress);
      });
      if (uploadedUrl) {
        setValue(name, uploadedUrl, { shouldValidate: true });
      }
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      {imageUrl ? (
        <div className="relative group w-full h-48 rounded-md overflow-hidden border">
          <Image src={imageUrl} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-48 rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
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
              <p className="text-sm text-muted-foreground">Click or drag to upload</p>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={isUploading}
      />
      <FormMessage />
    </FormItem>
  );
}
