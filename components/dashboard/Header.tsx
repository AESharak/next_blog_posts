"use client";

import Link from "next/link";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="font-bold">
            Blog Platform
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Your Dashboard
            </Link>
            <Link
              href="/dashboard/posts/new"
              className={`text-sm font-medium transition-colors ${
                isActive("/dashboard/posts/new")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              New Post
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                isActive("/blog")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Public Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:flex"
          >
            <Link href="/dashboard/posts/new">Create Post</Link>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
