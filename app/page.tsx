import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    const profile = await db.profile.findFirst({
      where: { userId },
      include: {
        servers: {
          where: { profile: { userId } }
        }
      }
    });
  
    const serverId = profile?.servers[0].id;

    if (serverId) {
      return redirect(`/servers/${serverId}`);
    }
  }

  return (
    <main className="flex flex-col">
      <h1>Welcome to Encord!</h1>
      <Badge className="w-20 text-md">
        <Link href="/sign-in">&gt; Login</Link>
      </Badge>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </main>
  )
}
