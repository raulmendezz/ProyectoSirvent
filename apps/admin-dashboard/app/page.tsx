// app/page.tsx
// Fix #6: redirige la raíz "/" directamente al dashboard

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
