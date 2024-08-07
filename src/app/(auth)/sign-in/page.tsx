"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = signInSchema;

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Sign-in failed",
        description: result.error,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else if (result?.url) {
      toast({
        title: "Success!",
        description: "Sign-in successful.",
      });
      if (result?.url) {
        router.replace("/dashboard");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-8 rounded-lg antialiased shadow-md w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Feedback Nexus
          </h1>
          <p className="mb-5">
            Back to{" "}
            <Link className="text-blue-500 hover:underline" href={"/"}>
              Home
            </Link>{" "}
            for Demo Login
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="secondary" type="submit" className="w-full">
              Submit
            </Button>
            <div className="text-center mt-4">
              <div className="text-sm">
                Not registered?{" "}
                <Link className="text-blue-500 hover:underline" href="/sign-up">
                  SIGN UP
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
