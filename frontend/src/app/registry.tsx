"use client"

import React, { useState } from "react"
import { useServerInsertedHTML } from "next/navigation"
import { StyleRegistry, createStyleRegistry } from "styled-jsx"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"

export default function StyledJsxRegistry({
  children,
  nonce,
}: {
  children: React.ReactNode
  nonce: string
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  const cache = createCache({
    key: "css",
    nonce: nonce,
  })

  return (
    <StyleRegistry registry={jsxStyleRegistry}>
      <CacheProvider value={cache}>{children} </CacheProvider>
    </StyleRegistry>
  )
}
