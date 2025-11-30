
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Companion } from "@/lib/definitions";
import { Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { ImageUploadField } from "./image-upload-field";


const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  profileUrl: z.string().url({ message: "Please enter a valid URL." }),
  imageUrl: z.string().optional(),
  imageHint: z.string().min(1, { message: "Image hint is required." })
}).refine(data => {
    if (data.imageUrl && data.imageUrl.length > 0) {
        return z.string().url("Image URL must be a valid URL").safeParse(data.imageUrl).success;
    }
    return true;
}, {
    message: "Image URL must be a valid URL",
    path: ["imageUrl"],
});

type CompanionFormData = z.infer<typeof formSchema>;

interface CompanionFormProps {
  companion: Companion;
  onSave: (companion: Companion) => void;
  onDelete: (companionId: string) => void;
}

export function CompanionForm({ companion, onSave, onDelete }: CompanionFormProps) {
  const [isEditing, setIsEditing] = React.useState(companion.id.startsWith('new-'));

  const form = useForm<CompanionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ...companion,
        imageUrl: companion.imageUrl || "",
        profileUrl: companion.profileUrl || "#",
    },
  });

  useEffect(() => {
    form.reset({
        ...companion,
        imageUrl: companion.imageUrl || "",
        profileUrl: companion.profileUrl || "#",
    });
     if (companion.id.startsWith('new-')) {
      setIsEditing(true);
    }
  }, [companion, form]);

  const onSubmit = (values: CompanionFormData) => {
    onSave(values);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    if (companion.id.startsWith('new-')) {
      onDelete(companion.id);
    } else {
      form.reset(companion);
      setIsEditing(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className="text-lg">{isEditing ? "Edit Companion" : companion.name}</CardTitle>
            <div className="flex items-center gap-2">
                {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                )}
                 <DeleteCompanionAlert 
                    companion={companion} 
                    onDelete={() => onDelete(companion.id)} 
                />
            </div>
          </CardHeader>
          {isEditing && (
            <>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Companion's Name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. AI | Backend Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A short description of the companion" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="imageUrl"
                        render={() => (
                            <ImageUploadField name="imageUrl" label="Companion's Image" folder="companions" />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image AI Hint</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 'woman portrait'" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profileUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Profile Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/profile/name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="gap-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                </CardFooter>
            </>
          )}
        </form>
      </Form>
    </Card>
  );
}

function DeleteCompanionAlert({ companion, onDelete }: { companion: Companion, onDelete: () => void }) {
  const handleDelete = () => {
    onDelete();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Companion</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the companion "{companion.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
