"use client";

import { useParams, useRouter } from "next/navigation";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full mb-1",
        "transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}>
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8" />
      <p className={cn(
        "font-semibold text-sm transition text-zinc-500",
        "group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
        params?.channelId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}>
        {member.profile.name}
      </p>
      {roleIconMap[member.role]}
    </button>
  )
}
