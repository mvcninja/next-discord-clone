import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { Hash } from "crypto";

// api to create new server
export async function POST(req: Request) {
  try {

    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: crypto.randomUUID(),
        channels: {
          create: [
            { profileId: profile.id, name: "general" }
          ]
        },
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    });

    return NextResponse.json(server);

  } catch (error) {

    console.error("[SERVERS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });

  }
}
