import { NextResponse } from "next/server";
import { Pool } from "pg";

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await pgPool.query(
      `SELECT r.*, p.name as product_name 
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Reviews error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
