"use client"

import Link from "next/link"
import { Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} J02 Building. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Facebook size={20} />
            <span>Join our Residents Group</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

