import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

export function ProfileNav() {
  const pathname = usePathname()

  const links = [
    {
      href: "/profile",
      label: "Profile",
      active: pathname === "/profile",
      icon: <User className="mr-2 h-4 w-4" />
    }
  ]

  return (
    <nav className="flex overflow-x-auto py-2 mb-8">
      <ul className="flex flex-row items-center space-x-4 px-4">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-white",
                link.active ? 
                  "bg-purple-900/50 text-white" : 
                  "text-gray-400 hover:bg-purple-900/20"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
} 