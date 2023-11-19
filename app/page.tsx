import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className='flex flex-col'>
      Hello Discord Clone
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </main>
  )
}
