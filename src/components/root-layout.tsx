import Link from "next/link";

import { ThemeProvider } from "@/providers/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="container py-5">
        <nav className="flex gap-3 items-center py-3 border-b">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/add">
            <Button variant="ghost">Add</Button>
          </Link>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </nav>
        <section className="mt-5">{children}</section>
      </main>
    </ThemeProvider>
  );
}
