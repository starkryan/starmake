"use client"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import UserBalanceDisplay from "@/components/ui/user-balance-display"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/redeem", label: "Redeem" },
  { href: "/profile", label: "Profile" },
]

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      toast.success('Signed out successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession()
        if (session?.data?.user) {
          setUserEmail(session.data.user.email)
          setUserId(session.data.user.id)
          // Use type assertion to access role field
          const userWithRole = session.data.user as any
          setUserRole(userWithRole.role || 'user')
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      }
    }

    fetchSession()
  }, [])

  return (
    <header className="fixed md:sticky top-0 left-0 right-0 z-50 w-full border-b bg-background px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className={pathname === link.href ? "text-primary py-1.5" : "text-muted-foreground py-1.5"}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
          <a href="/" className="text-primary hover:text-primary/90">
            <Star />
          </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className={pathname === link.href ? "text-primary hover:text-primary py-1.5 font-medium" : "text-muted-foreground hover:text-primary py-1.5 font-medium"}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {userEmail ? (
            <>
              {/* Balance Display */}
              {userId && (
                <UserBalanceDisplay 
                  userId={userId}
                  showAddButton={true}
                  onAddMoney={() => router.push('/redeem')}
                />
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 p-0 rounded-full overflow-hidden aspect-square md:h-8 md:w-8">
                    <Avatar className="h-full w-full rounded-full">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg md:text-xs flex items-center justify-center">
                        {userEmail.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-w-[300px] md:w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        Welcome back!
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="py-3 text-base md:py-2 md:text-sm">
                    <a href="/">Home</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base md:py-2 md:text-sm">
                    <a href="/tasks">Tasks</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base md:py-2 md:text-sm">
                    <a href="/redeem">Redeem</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base md:py-2 md:text-sm">
                    <a href="/profile">Profile</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base md:py-2 md:text-sm">
                    <a href="/dashboard">Dashboard</a>
                  </DropdownMenuItem>
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild className="py-3 text-base md:py-2 md:text-sm">
                      <a href="/admin">Admin</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="py-3 text-base md:py-2 md:text-sm">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/login">Sign In</a>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <a href="/signup">Get Started</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
