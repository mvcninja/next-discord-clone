import { ModeToggle } from "@/components/mode-toggle";
import { db } from "@/lib/db";
import { UserButton, auth } from "@clerk/nextjs";
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
    <main className='flex flex-col'>
      <h1>Welcome to Encord!</h1>
      <a href="/sign-in" className="h-8 w-40 text-center align-middle rounded-md bg-indigo-700">
        Login
      </a>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </main>
  )
}
