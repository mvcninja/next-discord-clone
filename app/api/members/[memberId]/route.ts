import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH (
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const profile = await currentProfile();
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    } else if (!params.memberId) {
      return new Response("Missing memberId", { status: 400 });
    } else if (!serverId) {
      return new Response("Missing serverId", { status: 400 });
    }

    // prisma converts json into SQL
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: { not: profile.id } // exclude current user
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: { role: "asc" }
        }
      }
    });

    return Response.json(server);
  } catch (error) {
    console.error("[MEMBER_UPDATE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}


export async function DELETE (
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    } else if (!params.memberId) {
      return new Response("Missing memberId", { status: 400 });
    } else if (!serverId) {
      return new Response("Missing serverId", { status: 400 });
    }

    // prisma converts json into SQL
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: { not: profile.id }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: { role: "asc" }
        }
      }
    });

    return Response.json(server);
  } catch (error) {
    console.error("[MEMBER_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
