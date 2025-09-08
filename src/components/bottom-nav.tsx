"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ClipboardList, Gift, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { authClient } from "@/lib/auth-client"
import { useEffect, useState } from "react"

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Task",
    href: "/tasks",
    icon: ClipboardList,
  },
  {
    name: "Redeem",
    href: "/redeem",
    icon: Gift,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession()
        setIsAuthenticated(!!session?.data?.user)
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  // Avoid rendering until we know the screen size to prevent hydration mismatch
  if (isMobile === undefined) return null
  if (!isMobile) return null

  // Dynamic navigation items based on authentication
  const dynamicNavigationItems = navigationItems.map(item => {
    if (item.name === "Home") {
      return {
        ...item,
        href: isAuthenticated ? "/dashboard" : "/"
      }
    }
    return item
  })

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around px-4">
        {dynamicNavigationItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all",
                  isActive ? "scale-110" : "scale-100"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all",
                  isActive ? "scale-105" : "scale-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
