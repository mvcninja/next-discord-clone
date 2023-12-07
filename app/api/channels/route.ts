import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

// api to create new channel
export async function POST(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { name, type } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    } else if (!serverId) {
      return new Response("Missing serverId", { status: 400 });
    } else if (name === "general") {
      return new Response("Name conflict", { status: 400 });
    }

    // Add new channel to server
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          }
        }
      },
      data: {
        channels: {
          create: {
            profile: {
              connect: {
                id: profile.id
              }
            },
            name,
            type,
            conversation: {
              create: { }
            }
          }
        }
      }
    });

    return Response.json(server);

  } catch (error) {

    console.error("[CHANNELS_POST", error);
    return new Response("Internal Error", { status: 500 });

  }
}
