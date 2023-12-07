import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";

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
    </div>
  );
}

export default ChannelPage;