// app/api/orders/route.ts
// Devuelve los últimos 10 pedidos con cliente y plataforma

import { NextResponse } from "next/server";
import pool from "../../../src/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        o.id,
        o.external_order_id,
        o.estado,
        o.total,
        o.fecha_pedido,
        c.nombre  AS cliente,
        p.nombre  AS plataforma
      FROM orders o
      JOIN customers c  ON c.id = o.customer_id
      JOIN platforms p  ON p.id = o.platform_id
      ORDER BY o.fecha_pedido DESC
      LIMIT 10
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en /api/orders:", error);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}
