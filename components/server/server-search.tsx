"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data: {
      icon: React.ReactNode;
      name: string;
      id: string;
    }[] | undefined;
  }[]
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const isHotkey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    }

    document.addEventListener("keydown", isHotkey);
    return () => document.removeEventListener("keydown", isHotkey);
  }, []);

  const onSearchClicked = ({ id, type }: { id: string, type: "channel" | "member" }) => {
    setOpen(false);

    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    } else if (type === "channel") {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full transition",
        "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50")}>
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className={cn("font-semibold text-sm text-zinc-500 dark:text-zinc-400",
          "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition")}>
          Search
        </p>
        <kbd className={cn("h-5 pointer-events-none select-none inline-flex items-center gap-1",
          "rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto")}>
          <span className="text-xs">CTRL</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>
            No results found
          </CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => (
                  <CommandItem key={id} onSelect={() => onSearchClicked({ id, type })}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}