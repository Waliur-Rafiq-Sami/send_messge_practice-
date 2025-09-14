"use client";

import MessageCard from "@/components/MessageCard";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { Message, User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// useCallback -> useCallback is a React hook that memoizes a function.( It returns a cached version of a function that only changes if its dependencies change.)

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]); //compulsory

  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  //session-> session is an object that represents the currently logged-in user.

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const { setValue, watch, control } = form;
  // setValue ->
  // setValue is a function to programmatically update a form field’s value.
  // Useful when you want to change a field from code, not user input.

  // Watch ->
  // watch lets you monitor one or more form fields.
  // Returns the current value(s), and updates whenever the user changes it.

  // control-->
  // control is an object used by controlled components, especially when working with React Hook Form + UI libraries.
  // Needed for components like Controller, which wraps inputs that don’t naturally integrate with React Hook Form (e.g.,
  // Switch, Select, custom components).

  const acceptMessages = watch("acceptMessages");

  // Fetch the user's current message acceptance status
  const fetchAcceptMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages!);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch message status");
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  // Fetch messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) toast.info("Showing latest messages");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  if (!session || !session.user) return <> Please login... </>;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`; //for get url
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL has been copied to clipboard");
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-900 dark:border-gray-700 rounded w-full max-w-6xl text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-4 flex items-center">
        <Controller
          name="acceptMessages"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              disabled={isSwitchLoading}
              onCheckedChange={async (val) => {
                setIsSwitchLoading(true);
                try {
                  const response = await axios.post<ApiResponse>("/api/accept-messages", {
                    acceptMessages: val,
                  });
                  field.onChange(val);
                  toast.success(response.data.message);
                  fetchMessages();
                } catch (error) {
                  const axiosError = error as AxiosError<ApiResponse>;
                  toast.error(axiosError.response?.data.message || "Failed to update status");
                } finally {
                  setIsSwitchLoading(false);
                }
              }}
            />
          )}
        />
        <span className="ml-2">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>

      <Separator className="dark:border-gray-700" />

      {/* Refresh Messages Button */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* Messages Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={(id) => setMessages(messages.filter((m) => m._id !== id))}
            />
          ))
        ) : (
          <div className="min-h-[500px] flex items-center justify-center">
            <p>No message to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
