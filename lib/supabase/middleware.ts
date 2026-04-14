import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const hasLocalAuth = request.cookies.get("local_auth")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/gerador",
    "/organizacao",
    "/calendario",
    "/tutoriais",
    "/configuracoes",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!hasLocalAuth && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (hasLocalAuth && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
