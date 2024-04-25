"use client"
import useUserStore from "@/store/useUserStore"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isLogged] = useUserStore((state) => [state.isLogged])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLogged && !["/login", "/register"].includes(pathname)) {
      router.replace("/login")
    }
  }, [isLogged, router])

  return <>{children}</>
}
