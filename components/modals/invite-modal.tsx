"use client"

import { Check, Copy, RefreshCw } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  // copy invite url to clipboard
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  // refresh modal with new invite code from server
  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await sendData(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: response });
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const sendData = async (url: string = "", data: object = {}) => {
    const response = await fetch(url, {
      method: "PATCH",
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

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input disabled={isLoading} 
              className="text-black bg-zinc-300/50 border-0
              focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl} />
            <Button disabled={isLoading} size="icon" onClick={onCopy}>
              { copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4" /> }
            </Button>
          </div>
          <Button disabled={isLoading} onClick={onNew} 
            variant="link" size="sm" className="text-xs text-zinc-500 mt-4">
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

