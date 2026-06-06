import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:4000/api";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: "No se puede conectar con el servidor" }, { status: 503 });
  }

  const data = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : (data.message ?? "Credenciales incorrectas");
    return NextResponse.json({ error: msg }, { status: res.status });
  }

  const response = NextResponse.json({ role: data.role });
  response.cookies.set("auth_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
