import { NextResponse } from "next/server";
import pool from "../../../../src/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") ?? "30", 10);
    const estado = searchParams.get("estado");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = [
      `o.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`,
    ];
    if (estado && estado !== "todos") {
      conditions.push(`o.estado = '${estado.replace(/'/g, "''")}'`);
    }
    const where = conditions.join(" AND ");

    const [rows] = await pool.query(`
      SELECT
        o.id,
        o.external_order_id,
        o.estado,
        o.total,
        o.fecha_pedido,
        c.nombre AS cliente,
        p.nombre AS plataforma
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN platforms p ON p.id = o.platform_id
      WHERE ${where}
      ORDER BY o.fecha_pedido DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const [countRows] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      WHERE ${where}
    `);

    const [statsRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalPedidos,
        COALESCE(SUM(total), 0) AS totalIngresos,
        SUM(CASE WHEN estado = 'pendiente'  THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado = 'confirmado' THEN 1 ELSE 0 END) AS confirmados,
        SUM(CASE WHEN estado = 'enviado'    THEN 1 ELSE 0 END) AS enviados,
        SUM(CASE WHEN estado = 'cancelado'  THEN 1 ELSE 0 END) AS cancelados
      FROM orders o
      WHERE o.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
    `);

    return NextResponse.json({
      orders: rows,
      total: (countRows as any)[0].total,
      page,
      limit,
      stats: (statsRows as any)[0],
    });
  } catch (error) {
    console.error("Error en /api/amazon/orders:", error);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}
