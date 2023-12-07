"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Plus, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const sendData = async (url: string = "", data: object = {}, method: string = "POST") => {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  return response.json();
}


interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({
  apiUrl,
  query,
  name,
  type
}: ChatInputProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    }
  });

  const isLoading = form.formState.isSubmitting;
  const placeholder = type === "channel" ? `Message #${name}` : `Message @${name}`;


  //TODO: try "use server" function

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = new URL(apiUrl, window.location.origin);
      url.search = new URLSearchParams(query).toString();
      await sendData(url.toString(), values);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative p-4 pb-6">
                <button type="button"
                  onClick={() => {}} className={cn(
                  "absolute top-7 left-8 h-[24px] w-[24px] rounded-full p-1 flex items-center justify-center",
                  "transition bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300"
                )}>
                  <Plus className="text-white dark:text-[#313338]" />
                </button>
                <Input
                  disabled={isLoading}
                  placeholder={placeholder}
                  {...field}
                  className={cn(
                    "px-14 py-6 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                    "bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200"
                  )} />
                <div className="absolute top-7 right-8">
                  <Smile />
                </div>
              </div>
            </FormControl>
          </FormItem>
        )} />
      </form>
    </Form>
  )
}