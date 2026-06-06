import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:4000/api";

async function authHeaders() {
  const store = await cookies();
  const token = store.get("auth_token")?.value ?? "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function GET() {
  const res = await fetch(`${API}/users`, { headers: await authHeaders() });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
