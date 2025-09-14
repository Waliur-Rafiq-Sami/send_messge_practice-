"use client";
import { zodResolver } from "@hookform/resolvers/zod"; //(a schema validation library)
import { useForm } from "react-hook-form"; //(a form management library)
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    //infer -> It extracts the TypeScript type from a Zod schema
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    // console.log("result: ", result);
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Incorrect username or password");
      } else {
        toast.error(result.error);
      }
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="min-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join my todo app
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={`${isShowPassword ? "" : "password"}`}
                            placeholder="password"
                            {...field}
                          />
                          <span
                            className="absolute top-2 right-3"
                            onClick={() => setIsShowPassword(!isShowPassword)}
                          >
                            {!isShowPassword ? <Eye size={18}></Eye> : <EyeClosed size={18} />}
                          </span>
                        </div>
                      </FormControl>
                      <div className="w-[350px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Signin"
                )}
              </Button>
            </form>
          </Form>
          <div className="pt-5">
            Already a member?
            <Link
              href={"/sign-up"}
              className="pl-2 text-blue-600 hover:text-blue-800 hover:underline"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
