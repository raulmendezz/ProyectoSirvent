import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Module-level cache for the whitelist (persists within the server process)
let whitelistCache: string[] = [];
let cacheTime = 0;
const CACHE_TTL = 30_000;

async function getWhitelist(): Promise<string[]> {
  if (Date.now() - cacheTime < CACHE_TTL && whitelistCache.length > 0) {
    return whitelistCache;
  }
  try {
    const apiPort = process.env.API_PORT ?? "4000";
    const res = await fetch(`http://localhost:${apiPort}/api/whitelist/ips`, {
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      whitelistCache = (await res.json()) as string[];
      cacheTime = Date.now();
      return whitelistCache;
    }
  } catch {
    // fall through to env fallback
  }
  const fallback = (process.env.ALLOWED_IPS ?? "127.0.0.1,::1")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  whitelistCache = fallback;
  cacheTime = Date.now();
  return fallback;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}

const ALWAYS_ALLOWED_IPS = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- IP whitelist check ---
  const ip = getClientIp(request);
  if (!ALWAYS_ALLOWED_IPS.includes(ip)) {
    const whitelist = await getWhitelist();
    if (!whitelist.includes(ip)) {
      return new NextResponse(
        `<!DOCTYPE html><html lang="es"><head><title>403 - Acceso Denegado</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f1f5f9}
.box{text-align:center;padding:2rem}h1{font-size:2rem;color:#1e293b}p{color:#64748b}</style></head>
<body><div class="box"><h1>403</h1><p>Tu IP (<strong>${ip}</strong>) no está autorizada para acceder a este sistema.</p></div></body></html>`,
        { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  }

  // --- Auth check ---
  const token = request.cookies.get("auth_token")?.value;
  const isLoginPage = pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/).*)"],
};
