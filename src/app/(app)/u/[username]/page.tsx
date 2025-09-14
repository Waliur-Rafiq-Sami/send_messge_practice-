"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useParams } from "next/navigation";

type MessageInput = z.infer<typeof messageSchema>;

const SendMessagePage = () => {
  const { username } = useParams<{ username: string }>();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const { register, handleSubmit, formState, reset } = form;
  // register -> It tells RHF: “Track this field and handle its value & validation
  // handleSubmit -> handleSubmit wraps your submit function to validate and process the form.
  // It ensures that all validations pass before calling your submit handler.
  // formState-> formState contains state info about the form, like validation errors, dirty fields, touched fields, etc.

  const onSubmit = async (data: MessageInput) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });
      toast.success(response.data.message || "Message sent successfully!");
      reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded shadow w-full max-w-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">
          Send a Message to <span className="text-blue-600">@{username}</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Your Message</label>
            <Textarea
              {...register("content")}
              placeholder="Write your message here..."
              className="h-40 dark:bg-gray-700 dark:text-white"
              rows={10}
              cols={10}
            />
            {formState.errors.content && (
              <p className="text-sm text-red-500 mt-1">{formState.errors.content.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? (
              <span className="flex font-bold items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="pb-[2px]">wait</span>
              </span>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SendMessagePage;
