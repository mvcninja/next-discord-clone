import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className='flex flex-col'>
      Hello Discord Clone
      <UserButton afterSignOutUrl="/" />
    </main>
  )
}
