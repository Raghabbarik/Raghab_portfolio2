
"use client";

import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Upload, XCircle, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useData } from "@/lib/data-context";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [urlInput, setUrlInput] = useState("");

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
  
  const handleSetUrl = () => {
    setValue(name, urlInput, { shouldValidate: true });
  };


  return (
    <FormItem className="space-y-4 rounded-lg border p-4">
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
       <div className="space-y-2">
        <div className="flex items-center gap-2">
           <LinkIcon className="h-4 w-4 text-muted-foreground" />
           <p className="text-sm text-muted-foreground">Or upload from a URL</p>
        </div>
        <div className="flex gap-2">
          <Input 
            type="url"
            placeholder="https://example.com/image.png" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={handleSetUrl}>Set URL</Button>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}

