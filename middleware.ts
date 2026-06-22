import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "staff_session";
const SESSION_TOKEN = process.env.SESSION_TOKEN || "cstu-courses-staff-session";

// Admin pages + the back-office APIs require a staff session.
const PROTECTED_API = [
  "/api/customers",
  "/api/messages",
  "/api/content",
  "/api/videos",
  "/api/attendance",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = req.cookies.get(COOKIE)?.value === SESSION_TOKEN;

  const isLogin = pathname === "/admin/login";
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtectedApi = PROTECTED_API.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtectedApi && !authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isAdminPage && !isLogin && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in but sitting on the login page → send to admin.
  if (isLogin && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/customers/:path*",
    "/api/messages/:path*",
    "/api/content/:path*",
    "/api/videos/:path*",
    "/api/attendance/:path*",
  ],
};
