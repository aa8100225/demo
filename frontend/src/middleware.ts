import { stackMiddlewares } from "@/middlewares/stackMiddlewares";
import { withAuthorization } from "@/middlewares/withAuthorization";
import { withHeaders } from "@/middlewares/withHeaders";
import { withLogging } from "@/middlewares/withLogging";

export default stackMiddlewares([withAuthorization, withLogging, withHeaders]);

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  missing: [
    { type: "header", key: "next-router-prefetch" },
    { type: "header", key: "purpose", value: "prefetch" },
  ],
};
