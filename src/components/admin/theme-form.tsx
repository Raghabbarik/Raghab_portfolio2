
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
import { ColorPicker } from "./color-picker";
import { hexToHslString, hslStringToHex } from "@/lib/colors";

const colorSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  primary: z.string(),
  accent: z.string(),
});

const formSchema = z.object({
  light: colorSchema,
  dark: colorSchema,
});

type ThemeFormData = z.infer<typeof formSchema>;

const ColorInput = ({ form, name, label, isDarkMode = false }: { form: any, name: any, label: string, isDarkMode?: boolean }) => {
    const hexColor = form.watch(name);
    const hslColor = hexToHslString(hexColor);
    
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={isDarkMode ? 'text-foreground' : ''}>{label}</FormLabel>
                    <div className="flex items-center gap-2">
                        <ColorPicker
                          hslColor={hslColor}
                          onChange={(newHsl) => {
                              const newHex = hslStringToHex(newHsl);
                              form.setValue(name, newHex, { shouldValidate: true, shouldDirty: true });
                          }}
                        />
                        <FormControl>
                            <Input 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.setValue(name, e.target.value, { shouldValidate: true, shouldDirty: true });
                              }}
                            />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
};


export function ThemeForm() {
    const { theme, setTheme } = useData();
    const { toast } = useToast();

    const form = useForm<ThemeFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            light: {
                background: hslStringToHex(theme.light.background),
                foreground: hslStringToHex(theme.light.foreground),
                primary: hslStringToHex(theme.light.primary),
                accent: hslStringToHex(theme.light.accent),
            },
            dark: {
                background: hslStringToHex(theme.dark.background),
                foreground: hslStringToHex(theme.dark.foreground),
                primary: hslStringToHex(theme.dark.primary),
                accent: hslStringToHex(theme.dark.accent),
            }
        },
    });

    React.useEffect(() => {
        form.reset({
            light: {
                background: hslStringToHex(theme.light.background),
                foreground: hslStringToHex(theme.light.foreground),
                primary: hslStringToHex(theme.light.primary),
                accent: hslStringToHex(theme.light.accent),
            },
            dark: {
                background: hslStringToHex(theme.dark.background),
                foreground: hslStringToHex(theme.dark.foreground),
                primary: hslStringToHex(theme.dark.primary),
                accent: hslStringToHex(theme.dark.accent),
            }
        });
    }, [theme, form]);

    const onSubmit = (values: ThemeFormData) => {
        const newThemeSettings: ThemeSettings = {
            light: {
                background: hexToHslString(values.light.background),
                foreground: hexToHslString(values.light.foreground),
                primary: hexToHslString(values.light.primary),
                accent: hexToHslString(values.light.accent),
            },
            dark: {
                background: hexToHslString(values.dark.background),
                foreground: hexToHslString(values.dark.foreground),
                primary: hexToHslString(values.dark.primary),
                accent: hexToHslString(values.dark.accent),
            },
        };
        setTheme(newThemeSettings);
        toast({
            title: "Theme Saved!",
            description: "Your new color theme has been applied.",
        });
    };
    
    const darkBgHsl = hexToHslString(form.watch('dark.background'));
    const darkFgHsl = hexToHslString(form.watch('dark.foreground'));


    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Theme Settings</CardTitle>
                    <CardDescription>
                        Customize the color scheme of your website. Click the color swatch to open the picker or enter Hex codes directly.
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
                         '--background': `hsl(${darkBgHsl})`,
                         '--foreground': `hsl(${darkFgHsl})`
                      } as React.CSSProperties}>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Dark Mode</h3>
                        <ColorInput form={form} name="dark.background" label="Background" isDarkMode />
                        <ColorInput form={form} name="dark.foreground" label="Foreground" isDarkMode />
                        <ColorInput form={form} name="dark.primary" label="Primary" isDarkMode />
                        <ColorInput form={form} name="dark.accent" label="Accent" isDarkMode />
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
