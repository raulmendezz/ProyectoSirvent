import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:4000/api";

async function authHeaders() {
  const store = await cookies();
  const token = store.get("auth_token")?.value ?? "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${API}/whitelist/${id}`, { method: "DELETE", headers: await authHeaders() });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
