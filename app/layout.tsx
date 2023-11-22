import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModalProvider } from '@/components/providers/modal-provider'

const font = Open_Sans({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Encord',
  description: 'Group chat application',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn(font.className, "bg-neutral-200 dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="encord-theme"
          >
            <ModalProvider/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
