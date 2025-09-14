"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts"; //custom React hook
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUserNameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const debounce = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(`/api/check-user-name-unique?username=${username}`);
          setUserNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUserNameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      // console.log(response);
      if (response.status === 201) {
        toast.success(response.data.message);
        router.replace(`/verify/${data.username}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error in signup:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage ?? "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
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
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounce(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && (
                      <Loader2 className="animate-spin absolute right-3 top-7 text-blue-500 w-5"></Loader2>
                    )}
                    {username && (
                      <p
                        className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>
          <div className="pt-5">
            Already a member?
            <Link
              href={"/sign-in"}
              className="pl-2 text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sing in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
