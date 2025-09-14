"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const NavbarPage = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const ThemeToggle = (
    <div className="pr-1">
      {isDark ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme("light")}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 text-yellow-500" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme("dark")}
          className="rounded-full"
        >
          <MoonStar className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </Button>
      )}
    </div>
  );

  return (
    <nav className="p-4 md:p-6 shadow-md border-b-2 bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="md:text-3xl font-bold mb-4 md:mb-0 text-gray-900 dark:text-white">
          Todo
        </Link>

        {session ? (
          <>
            <span className="mr-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-900 text-gray-900 dark:text-white font-semibold shadow-md backdrop-blur-sm border border-gray-300 dark:border-gray-700 transition-all duration-300">
              Welcome, {user?.name || user?.email}
            </span>

            <div className="space-x-2 flex flex-wrap items-center">
              {ThemeToggle}
              <Link href={"/dashboard"}>
                <Button className="w-full md:w-auto">Dashboard</Button>
              </Link>
              <Button className="w-full md:w-auto" onClick={() => signOut()}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            {ThemeToggle}
            <Link href={"/sign-in"}>
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarPage;
