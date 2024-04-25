import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ChakraProvider } from "@chakra-ui/react"

import { default as nextDynamic } from "next/dynamic"
import { headers } from "next/headers"
import StyledJsxRegistry from "./registry"
import AuthWrapper from "./authWrapper"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Demo",
  description: "demo",
}

const ToastContainer = nextDynamic(
  () => import("react-toastify").then((module) => module.ToastContainer),
  {
    ssr: false,
  }
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nonce = headers().get("x-nonce") || ""

  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <StyledJsxRegistry nonce={nonce}>
            <ChakraProvider>
              <AuthWrapper>{children}</AuthWrapper>
            </ChakraProvider>
          </StyledJsxRegistry>
        </>
      </body>
    </html>
  )
}
