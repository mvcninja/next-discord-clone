import { redirect } from "next/navigation";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { Hash, LucideIcon, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

export const groupByType = (map: Map<ChannelType, Channel[]>, channel: Channel): Map<ChannelType, Channel[]> => {
  if (!map.has(channel.type)) {
    map.set(channel.type, []);
  }
  map.get(channel.type)?.push(channel);
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

  const channelIconMap = {
    [ChannelType.TEXT]:  <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  };
  
  const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  }
  
  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">

        <div className="mt-2">
          <ServerSearch data={[
            {
              label: "Text Channels",
              type: "channel",
              data: channels.get(ChannelType.TEXT)?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: channelIconMap[channel.type],
              }))
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: channels.get(ChannelType.AUDIO)?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: channelIconMap[channel.type],
              }))
            },
            {
              label: "Video Channels",
              type: "channel",
              data: channels.get(ChannelType.VIDEO)?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: channelIconMap[channel.type],
              }))
            },
            {
              label: "Members",
              type: "member",
              data: members?.map(member => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role]
              }))
            },
          ]} />
        </div>

        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />

        {channels.has(ChannelType.TEXT) && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels" />
              {channels.get(ChannelType.TEXT)?.map(channel => (
                <ServerChannel key={channel.id}
                  channel={channel}
                  server={server}
                  role={role} />
              ))}
          </div>
        )}

        {channels.has(ChannelType.AUDIO) && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels" />
              {channels.get(ChannelType.AUDIO)?.map(channel => (
                <ServerChannel key={channel.id}
                  channel={channel}
                  server={server}
                  role={role} />
              ))}
          </div>
        )}

        {channels.has(ChannelType.VIDEO) && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels" />
              {channels.get(ChannelType.VIDEO)?.map(channel => (
                <ServerChannel key={channel.id}
                  channel={channel}
                  server={server}
                  role={role} />
              ))}
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server} />
              {members.map(member => (
                <ServerMember key={member.id}
                  member={member}
                  server={server} />
              ))}
          </div>
        )}

      </ScrollArea>
    </div>
  )
}