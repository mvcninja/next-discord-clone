import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH (
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    } else if (!params.serverId) {
      return new Response("Missing serverId", { status: 400 });
    }

    // Remove [non-admin] member from server
    // prisma converts json into SQL
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: { not: profile.id },
        members: {
          some: { profileId: profile.id }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    });

    return Response.json(server);
  } catch (error) {
    console.error("[SERVER_LEAVE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
