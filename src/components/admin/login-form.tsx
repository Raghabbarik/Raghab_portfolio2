
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mountain } from "lucide-react";
import Link from "next/link";
import { useFirebase } from "@/firebase/provider";
import { signInAnonymously } from "firebase/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm() {
  const { auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.email !== "rraghabbarik@gmail.com" || values.password !== "Raghab@2006") {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password.",
        });
        return;
    }

    if (!auth) {
         toast({
            variant: "destructive",
            title: "Authentication service not ready",
            description: "Please try again in a moment.",
        });
        return;
    }
    
    try {
        await signInAnonymously(auth);
        toast({
            title: "Login Successful",
            description: "Redirecting to your dashboard...",
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/admin/dashboard");
    } catch (error: any) {
        console.error("Anonymous sign-in failed", error);
        if (error.code === 'auth/operation-not-allowed') {
             toast({
                variant: "destructive",
                title: "Firebase Login Failed",
                description: "Anonymous sign-in is not enabled in your Firebase console.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Firebase Login Failed",
                description: "Could not sign in. Please check console for details.",
            });
        }
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <Mountain className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Admin Panel</CardTitle>
        <CardDescription>
          Enter your credentials to access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
