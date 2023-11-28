import { randomUUID } from "crypto";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
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

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        inviteCode: randomUUID()
      }
    });

    return Response.json(server);
  } catch (error) {
    console.error("[SERVER_INVITE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}