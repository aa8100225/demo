import { PropsWithChildren, Suspense } from "react"

export default function LoginLayout(props: PropsWithChildren) {
  return (
    <>
      <Suspense>{props.children}</Suspense>
    </>
  )
}
