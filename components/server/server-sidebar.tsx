import { redirect } from "next/navigation";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { ServerDetails, ServerHeader } from "./server-header";

export const groupByType = (map: Map<ChannelType, Channel[]>, channel: Channel): Map<ChannelType, Channel[]> => {
  if (!map.has(channel.type)) {
    map.set(channel.type, []);
    map.get(channel.type)?.push(channel);
  }
  return map;
};

export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: { createdAt: "asc" },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: { role: "asc" },
      }
    },
  });

  if (!server) {
    return redirect("/");
  }

  const currentMember = server.members.find(member => member.profileId === profile.id);
  const role = currentMember?.role ?? MemberRole.GUEST;
  const members = server.members.filter(member => member !== currentMember);

  // group channels by type
  const channels = server.channels.reduce(
    groupByType,
    new Map<ChannelType, Channel[]>()
  );


  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={role} />
    </div>
  )
}