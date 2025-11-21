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
import { useToast } from "@/hooks/use-toast";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Service } from "@/lib/definitions";
import { iconNames, getIcon } from "@/lib/get-icon";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  icon: z.string().min(1, { message: "Icon is required." }),
});

// We need to transform the data to fit the form
type ServiceFormData = {
  title: string;
  description: string;
  icon: string;
};

interface ServiceFormProps {
  service: Service;
  onSave: (service: Service) => void;
  onDelete: (serviceTitle: string) => void;
}

export function ServiceForm({ service, onSave, onDelete }: ServiceFormProps) {
  const { toast } = useToast();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: service.title,
        description: service.description,
        icon: service.icon.displayName || "",
    },
  });

  async function onSubmit(values: ServiceFormData) {
    const serviceToSave: Service = {
        ...values,
        icon: getIcon(values.icon),
    };
    onSave(serviceToSave);
    
    toast({
      title: "Service Saved!",
      description: `The service "${values.title}" has been updated.`,
    });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Edit Service</CardTitle>
            </div>
            <DeleteServiceAlert 
                service={service} 
                onDelete={() => onDelete(service.title)} 
            />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
             <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Service Title" {...field} />
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
                    <Textarea placeholder="Describe the service" {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {iconNames.map(name => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


function DeleteServiceAlert({ service, onDelete }: { service: Service, onDelete: () => void }) {
  const { toast } = useToast();
  
  const handleDelete = () => {
    onDelete();
    toast({
      variant: "destructive",
      title: "Service Deleted",
      description: `The service "${service.title}" has been removed.`,
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Service</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the service "{service.title}".
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
