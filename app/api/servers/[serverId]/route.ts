import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH (
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new Response("Server ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      }
    });

    return Response.json(server);
  } catch (error) {
    console.error("[SERVER_UPDATE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}


export async function DELETE (
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new Response("Server ID missing", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      }
    });

    return Response.json(server);
  } catch (error) {
    console.error("[SERVER_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}