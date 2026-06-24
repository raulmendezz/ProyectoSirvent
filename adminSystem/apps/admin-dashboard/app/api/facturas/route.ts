import { NextResponse } from "next/server";
import pool from "../../../src/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const days = parseInt(searchParams.get("days") ?? "90", 10);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const offset = (page - 1) * limit;

    const conditions = [
      `i.fecha_emision >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`,
    ];
    if (estado && estado !== "todas") {
      conditions.push(`i.estado = '${estado.replace(/'/g, "''")}'`);
    }
    const where = conditions.join(" AND ");

    const [rows] = await pool.query(`
      SELECT
        i.id,
        i.numero_factura,
        i.total,
        i.estado,
        i.fecha_emision,
        o.external_order_id,
        o.estado      AS estado_pedido,
        c.nombre      AS cliente,
        p.nombre      AS plataforma
      FROM invoices i
      JOIN orders   o ON o.id = i.order_id
      JOIN customers c ON c.id = o.customer_id
      JOIN platforms p ON p.id = o.platform_id
      WHERE ${where}
      ORDER BY i.fecha_emision DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM invoices i WHERE ${where}`
    );

    const [statsRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalFacturas,
        COALESCE(SUM(CASE WHEN estado = 'pendiente' THEN total ELSE 0 END), 0) AS importePendiente,
        COALESCE(SUM(CASE WHEN estado = 'emitida'   THEN total ELSE 0 END), 0) AS importeEmitida,
        COALESCE(SUM(CASE WHEN estado = 'pagada'    THEN total ELSE 0 END), 0) AS importePagada,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado = 'emitida'   THEN 1 ELSE 0 END) AS emitidas,
        SUM(CASE WHEN estado = 'pagada'    THEN 1 ELSE 0 END) AS pagadas,
        SUM(CASE WHEN estado = 'anulada'   THEN 1 ELSE 0 END) AS anuladas
      FROM invoices
    `);

    return NextResponse.json({
      invoices: rows,
      total: (countRows as any)[0].total,
      page,
      limit,
      stats: (statsRows as any)[0],
    });
  } catch (error) {
    console.error("Error en /api/facturas:", error);
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 });
  }
}
