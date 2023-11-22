import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  // retrieve list of servers for user
  const servers = await db.server.findMany({
    where: {
      members: {
        some: { profileId: profile.id }
      }
    }
  });

  return ( 
    <nav className="space-y-4 py-3 flex flex-col items-center h-full w-full text-primary dark:bg-[#1e1f22]">
      <NavigationAction/>
      <Separator className="h-[2px] rounded-md w-10 mx-auto bg-zinc-300 dark:bg-zinc-700"/>
      <ScrollArea className="flex-1 w-full">
        {servers.map(server => (
          <NavigationItem key={server.id} id={server.id} name={server.name} imageUrl={server.imageUrl} className="mb-4" />
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
          <ModeToggle/>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" }}}/>
      </div>
    </nav>
  );
}
