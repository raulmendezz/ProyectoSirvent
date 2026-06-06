// app/api/stats/route.ts
// Devuelve los datos de las 4 tarjetas del dashboard

import { NextResponse } from "next/server";
import pool from "../../../src/lib/db";

export async function GET() {
  try {
    const [ventasHoy] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS total
      FROM orders
      WHERE DATE(fecha_pedido) = CURDATE()
    `);

    const [usuariosActivos] = await pool.query(`
      SELECT COUNT(*) AS total FROM customers
    `);

    const [pedidosPendientes] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM orders
      WHERE estado = 'pendiente'
    `);

    const [ingresosMes] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS total
      FROM orders
      WHERE MONTH(fecha_pedido) = MONTH(CURDATE())
        AND YEAR(fecha_pedido)  = YEAR(CURDATE())
        AND estado != 'cancelado'
    `);

    return NextResponse.json({
      ventasHoy:         (ventasHoy as any)[0].total,
      usuariosActivos:   (usuariosActivos as any)[0].total,
      pedidosPendientes: (pedidosPendientes as any)[0].total,
      ingresosMes:       (ingresosMes as any)[0].total,
    });
  } catch (error) {
    console.error("Error en /api/stats:", error);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}
