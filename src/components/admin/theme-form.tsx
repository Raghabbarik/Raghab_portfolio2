
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ThemeSettings } from "@/lib/definitions";
import React from "react";
import { useData } from "@/lib/data-context";
import { useToast } from "@/hooks/use-toast";

const colorSchema = z.object({
  background: z.string().regex(/^\d{1,3} \d{1,3}% \d{1,3}%$/, "Invalid HSL format (e.g., '0 0% 100%')"),
  foreground: z.string().regex(/^\d{1,3} \d{1,3}% \d{1,3}%$/, "Invalid HSL format"),
  primary: z.string().regex(/^\d{1,3} \d{1,3}% \d{1,3}%$/, "Invalid HSL format"),
  accent: z.string().regex(/^\d{1,3} \d{1,3}% \d{1,3}%$/, "Invalid HSL format"),
});

const formSchema = z.object({
  light: colorSchema,
  dark: colorSchema,
});

type ThemeFormData = z.infer<typeof formSchema>;

const ColorInput = ({ form, name, label }: { form: any, name: any, label: string }) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <div className="flex items-center gap-2">
                     <div 
                        className="w-8 h-8 rounded-md border" 
                        style={{ backgroundColor: `hsl(${field.value})`}}
                    />
                    <FormControl>
                        <Input placeholder="e.g., 240 10% 3.9%" {...field} />
                    </FormControl>
                </div>
                <FormMessage />
            </FormItem>
        )}
    />
);


export function ThemeForm() {
    const { theme, setTheme } = useData();
    const { toast } = useToast();

    const form = useForm<ThemeFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: theme,
    });

    React.useEffect(() => {
        form.reset(theme);
    }, [theme, form]);

    const onSubmit = (values: ThemeFormData) => {
        setTheme(values);
        toast({
            title: "Theme Saved!",
            description: "Your new color theme has been applied.",
        });
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Theme Settings</CardTitle>
                    <CardDescription>
                        Customize the color scheme of your website. Enter HSL values without the 'hsl()' wrapper (e.g., '271 76% 53%').
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Light Mode</h3>
                        <ColorInput form={form} name="light.background" label="Background" />
                        <ColorInput form={form} name="light.foreground" label="Foreground" />
                        <ColorInput form={form} name="light.primary" label="Primary" />
                        <ColorInput form={form} name="light.accent" label="Accent" />
                    </div>
                     <div className="space-y-4 p-4 border rounded-lg bg-background" style={{ 
                         '--background': `hsl(${form.watch('dark.background')})`,
                         '--foreground': `hsl(${form.watch('dark.foreground')})`
                      } as React.CSSProperties}>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Dark Mode</h3>
                        <ColorInput form={form} name="dark.background" label="Background" />
                        <ColorInput form={form} name="dark.foreground" label="Foreground" />
                        <ColorInput form={form} name="dark.primary" label="Primary" />
                        <ColorInput form={form} name="dark.accent" label="Accent" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Save Theme</Button>
                </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
