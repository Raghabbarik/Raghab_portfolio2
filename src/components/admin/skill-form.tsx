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
import { Slider } from "@/components/ui/slider";
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

import type { Skill } from "@/lib/definitions";
import { iconNames, getIcon } from "@/lib/get-icon";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  level: z.number().min(0).max(100),
  icon: z.string().min(1, { message: "Icon is required." }),
});

// We need to transform the data to fit the form
type SkillFormData = {
  name: string;
  level: number;
  icon: string;
};

interface SkillFormProps {
  skill: Skill;
  onSave: (skill: Skill) => void;
  onDelete: (skillName: string) => void;
}

export function SkillForm({ skill, onSave, onDelete }: SkillFormProps) {
  const { toast } = useToast();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: skill.name,
        level: skill.level,
        icon: skill.icon.displayName || "",
    },
  });

  async function onSubmit(values: SkillFormData) {
    const skillToSave: Skill = {
        ...values,
        icon: getIcon(values.icon),
    };
    onSave(skillToSave);
    
    toast({
      title: "Skill Saved!",
      description: `The skill "${values.name}" has been updated.`,
    });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Edit Skill</CardTitle>
            </div>
            <DeleteSkillAlert 
                skill={skill} 
                onDelete={() => onDelete(skill.name)} 
            />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Skill Name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider 
                        defaultValue={[field.value]} 
                        onValueChange={(value) => field.onChange(value[0])}
                        max={100} 
                        step={1} 
                    />
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


function DeleteSkillAlert({ skill, onDelete }: { skill: Skill, onDelete: () => void }) {
  const { toast } = useToast();
  
  const handleDelete = () => {
    onDelete();
    toast({
      variant: "destructive",
      title: "Skill Deleted",
      description: `The skill "${skill.name}" has been removed.`,
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Skill</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the skill "{skill.name}".
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
