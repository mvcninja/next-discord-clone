import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

// api to edit channel
export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { name } = await req.json();
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
          update: {
            where: {
              id: params?.channelId,
              NOT: { name: "general" },
            },
            data: {
              name,
            }
          }
        }
      }
    });

    return Response.json(server);

  } catch (error) {

    console.error("[CHANNELS_PATCH", error);
    return new Response("Internal Error", { status: 500 });

  }
}


// api to delete channel
export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    } else if (!serverId) {
      return new Response("Missing serverId", { status: 400 });
    }

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
          delete: {
            id: params.channelId,
            name: { not: "general" },
          }
        }
      }
    });

    return Response.json(server);

  } catch (error) {

    console.error("[CHANNELS_DELETE", error);
    return new Response("Internal Error", { status: 500 });

  }
}
