import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: { id: params.channelId }
  });

  if (!channel) {
    redirect("/");
  }

  return ( 
    <div className="h-full flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader type="channel" serverId={channel.serverId} name={channel.name} />

      <div className="flex-1 relative">
        <div className="absolute left-5 bottom-5">
          <h1 className="font-semibold text-4xl">Welcome to #{channel.name}!</h1>
          This is the start of the new <span>#{channel.name}</span> channel.
        </div>
      </div>

      <ChatInput type="channel" name={channel.name}
        apiUrl="/api/socket/messages"
        query={{ channelId: channel.id, serverId: channel.serverId }}
      />
    </div>
  );
}

export default ChannelPage;