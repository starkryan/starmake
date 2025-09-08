"use client"

import { useState, useEffect, useRef } from "react"
import { FaStar } from "react-icons/fa6"
import { GiHamburgerMenu } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import UserBalanceDisplay from "@/components/ui/user-balance-display"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/redeem", label: "Redeem" },
  { href: "/profile", label: "Profile" },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const setBodyPadding = () => {
      const height = el.getBoundingClientRect().height
      document.body.style.paddingTop = `${height}px`
    }
    setBodyPadding()
    window.addEventListener("resize", setBodyPadding)
    return () => {
      window.removeEventListener("resize", setBodyPadding)
      document.body.style.paddingTop = "0px"
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully!")
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  const userEmail = user?.email || null
  const userId = user?.id || null
  const userRole = (user as any)?.role || "user"

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger using react-icons */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring"
            >
              <GiHamburgerMenu className="w-5 h-5" />
            </button>

            <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
              <FaStar className="w-6 h-6" />
              <span className="sr-only">SalaryWork</span>
            </a>

            <nav className="hidden md:block">
              <NavigationMenu className="max-w-none">
                <NavigationMenuList className="flex items-center gap-4">
                  {navigationLinks.map((link, idx) => (
                    <NavigationMenuItem key={idx}>
                      <NavigationMenuLink
                        href={link.href}
                        className={`px-2 py-1 rounded-md ${pathname === link.href ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {userId && (
              <div className="hidden sm:block">
                <UserBalanceDisplay userId={userId} showAddButton onAddMoney={() => router.push('/redeem')} />
              </div>
            )}

            {userEmail ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full h-10 w-10 overflow-hidden">
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary text-primary-foreground">{userEmail.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userEmail}</span>
                      <span className="text-xs text-muted-foreground">Welcome back</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/">Home</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/tasks">Tasks</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/redeem">Redeem</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/profile">Profile</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/dashboard">Dashboard</a>
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <a href="/admin">Admin</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm"><a href="/login">Sign In</a></Button>
                <Button asChild size="sm"><a href="/signup">Get Started</a></Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden"
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-background border-b"
            >
              <div className="px-4 py-3">
                <nav className="flex flex-col gap-1">
                  {navigationLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 rounded-md ${pathname === link.href ? 'bg-muted/60 text-primary' : 'text-muted-foreground hover:bg-muted/20'}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>

                <div className="mt-3 border-t pt-3">
                  {userEmail ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{userEmail.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{userEmail}</div>
                          <div className="text-xs text-muted-foreground">{userRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => router.push('/profile')}>Profile</Button>
                        <Button size="sm" variant="outline" onClick={handleSignOut}>Sign out</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button asChild size="sm"><a href="/login">Sign In</a></Button>
                      <Button asChild size="sm"><a href="/signup">Get Started</a></Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
