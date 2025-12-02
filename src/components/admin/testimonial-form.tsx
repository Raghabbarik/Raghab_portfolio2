
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
import type { Testimonial } from "@/lib/definitions";
import { Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { ImageUploadField } from "./image-upload-field";


const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role is required." }),
  quote: z.string().min(10, { message: "Quote must be at least 10 characters." }),
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

type TestimonialFormData = z.infer<typeof formSchema>;

interface TestimonialFormProps {
  testimonial: Testimonial;
  onSave: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
}

export function TestimonialForm({ testimonial, onSave, onDelete }: TestimonialFormProps) {
  const [isEditing, setIsEditing] = React.useState(testimonial.id.startsWith('new-'));

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ...testimonial,
        imageUrl: testimonial.imageUrl || "",
    },
  });

  useEffect(() => {
    form.reset({
        ...testimonial,
        imageUrl: testimonial.imageUrl || "",
    });
     if (testimonial.id.startsWith('new-')) {
      setIsEditing(true);
    }
  }, [testimonial, form]);

  const onSubmit = (values: TestimonialFormData) => {
    onSave(values);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    if (testimonial.id.startsWith('new-')) {
      onDelete(testimonial.id);
    } else {
      form.reset(testimonial);
      setIsEditing(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className="text-lg">{isEditing ? "Edit Testimonial" : testimonial.name}</CardTitle>
            <div className="flex items-center gap-2">
                {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                )}
                 <DeleteTestimonialAlert 
                    testimonial={testimonial} 
                    onDelete={() => onDelete(testimonial.id)} 
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
                                <Input placeholder="Client's Name" {...field} />
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
                                <Input placeholder="e.g. CEO, Example Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quote"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quote</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A glowing testimonial..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="imageUrl"
                        render={() => (
                            <ImageUploadField name="imageUrl" label="Client's Image" folder="testimonials" />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image AI Hint</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 'woman face'" {...field} />
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

function DeleteTestimonialAlert({ testimonial, onDelete }: { testimonial: Testimonial, onDelete: () => void }) {
  const handleDelete = () => {
    onDelete();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Testimonial</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the testimonial from "{testimonial.name}".
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
