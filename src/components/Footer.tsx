"use client";

import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-cyan-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section */}
        <p className="text-sm text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} Todo App. All rights reserved.
        </p>

        {/* Center Divider (hidden on mobile) */}
        <Separator
          orientation="vertical"
          className="hidden md:block mx-4 h-5 dark:border-gray-600"
        />

        {/* Right Section */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://twitter.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://facebook.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Facebook className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
