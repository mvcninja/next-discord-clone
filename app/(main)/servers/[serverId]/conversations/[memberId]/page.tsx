import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const member = await db.member.findUnique({
    where: {
      id: params?.memberId,
      serverId: params?.serverId,
    },
    include: {
      profile: true,
    }
  });

  if (!member) {
    redirect(`/servers/${params.serverId}`);
  }  

  return ( 
    <div className="h-full flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="conversation"
        serverId={params?.serverId}
        name={member.profile?.name}
        imageUrl={member.profile.imageUrl}
      />
    </div>
  );
}

export default MemberIdPage;