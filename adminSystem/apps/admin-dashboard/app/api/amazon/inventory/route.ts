import { NextResponse } from "next/server";
import pool from "../../../../src/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock") === "true";
    const search = searchParams.get("q") ?? "";

    const conditions: string[] = [];
    if (lowStock) conditions.push("p.stock <= p.minStock");
    if (search) conditions.push(`(p.sku LIKE '%${search.replace(/'/g, "''")}%' OR p.name LIKE '%${search.replace(/'/g, "''")}%')`);
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.sku,
        p.name,
        p.asin,
        p.stock,
        p.minStock,
        p.price,
        CASE WHEN p.stock <= p.minStock THEN 'low' ELSE 'ok' END AS stockStatus
      FROM products p
      ${where}
      ORDER BY p.stock ASC, p.name ASC
      LIMIT 200
    `);

    const [statsRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalSkus,
        SUM(CASE WHEN stock <= minStock THEN 1 ELSE 0 END) AS lowStockCount,
        SUM(CASE WHEN asin IS NOT NULL THEN 1 ELSE 0 END) AS linkedToAmazon,
        COALESCE(SUM(stock * price), 0) AS valorTotal
      FROM products
    `);

    return NextResponse.json({
      items: rows,
      stats: (statsRows as any)[0],
    });
  } catch (error) {
    console.error("Error en /api/amazon/inventory:", error);
    return NextResponse.json({ error: "Error al obtener inventario" }, { status: 500 });
  }
}
