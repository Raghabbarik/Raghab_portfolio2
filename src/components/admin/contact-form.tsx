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
import type { ContactDetail } from "@/lib/definitions";
import { iconNames } from "@/lib/get-icon";
import { Trash2 } from "lucide-react";


const formSchema = z.object({
  id: z.string(),
  iconName: z.string().min(1, "Icon is required."),
  text: z.string().min(1, "Text is required."),
  href: z.string().min(1, "Link/Href is required."),
});

type ContactFormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  contact: ContactDetail;
  onSave: (contact: ContactDetail) => void;
  onDelete: (contactId: string) => void;
}

export function ContactForm({ contact, onSave, onDelete }: ContactFormProps) {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: contact,
  });

  async function onSubmit(values: ContactFormData) {
    onSave(values);
    toast({
      title: "Contact Detail Saved!",
      description: `The contact detail "${values.text}" has been updated.`,
    });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Edit Contact Detail</CardTitle>
            </div>
             <DeleteContactAlert 
                contact={contact} 
                onDelete={() => onDelete(contact.id)} 
            />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-0">
             <FormField
                control={form.control}
                name="iconName"
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
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Text</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (href)</FormLabel>
                  <FormControl>
                    <Input placeholder="mailto:your.email@example.com" {...field} />
                  </FormControl>
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


function DeleteContactAlert({ contact, onDelete }: { contact: ContactDetail, onDelete: () => void }) {
  const { toast } = useToast();
  
  const handleDelete = () => {
    onDelete();
    toast({
      variant: "destructive",
      title: "Contact Deleted",
      description: `The contact detail "${contact.text}" has been removed.`,
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Contact</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the contact detail "{contact.text}".
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
