import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: {
    serverId: string;
  }
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  // find text channel
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        }
      }
    }
  });

  const defaultChannel = server?.channels[0];
  
  if (defaultChannel?.name === "general") {
    return redirect(`/servers/${params.serverId}/channels/${defaultChannel.id}`);
  }

  return new Response("Default channel not found.", { status: 404 });
}

export default ServerPage;
