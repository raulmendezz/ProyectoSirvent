import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  let apiRes: Response;
  try {
    apiRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con la API" }, { status: 503 });
  }

  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json(
      { error: data.message ?? "Credenciales incorrectas" },
      { status: apiRes.status },
    );
  }

  const response = NextResponse.json({ ok: true, role: data.role });
  response.cookies.set("auth-token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
